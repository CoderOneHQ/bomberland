import * as fs from "fs";
import { AbstractSocketHandler } from "../Services/SocketHandler/AbstractSocketHandler";
import { AdminSocketHandler } from "../Services/SocketHandler/AdminSocketHandler";
import { CoderOneApi } from "../Services/CoderOneApi/CoderOneApi";
import { ConnectionTracker } from "../Services/ConnectionTracker";
import { createGameFromSeed } from "./Game/createGameFromSeed";
import { EngineTelemetryEvent } from "../Services/CoderOneApi/EngineTelemetryEvent";
import { evaluateNextState } from "./Training/evaluateNextState";
import { Game } from "./Game/Game";
import { GameWebsocket } from "../Services/GameWebSocket";
import { sys } from "typescript";
import { Telemetry } from "../Services/Telemetry";
import { Utilities } from "../Utilities";
import {
    AdminPacket,
    AgentPacket,
    EndGameStatePacket,
    GameStatePacket,
    GameTickPacket,
    IEndGameState,
    IGameState,
    InfoPacket,
    NextGameStatePacket,
    PacketType,
    ServerPacket,
} from "@coderone/bomberland-library";
import { IConfig } from "../Config/IConfig";

export class GameRunner {
    private minimumNumberOfAgents = this.config.TotalAgents;
    private checkReadyInterval = 1000;
    private tickIntervalMs = 1000 / this.config.TickrateHz;
    private tickCount = 1;
    private intervalLoop: NodeJS.Timeout | undefined;

    private instantiatedUtc = Utilities.UTCNowMs;
    private gracePeriod = this.config.TournamentAgentConnectionGracePeriodMs;

    private game: Game;

    private get shouldWaitForPlayers(): boolean {
        return this.connectionTracker.TotalAgents < this.minimumNumberOfAgents;
    }

    public constructor(
        private telemetry: Telemetry,
        private config: IConfig,
        private api: CoderOneApi,
        private sockets: GameWebsocket,
        private connectionTracker: ConnectionTracker,
        private isTrainingMode: boolean
    ) {
        this.game = createGameFromSeed(telemetry, config, config.WorldSeed, config.PrngSeed);
        this.sockets.RegisterAdminActionCallback(this.onAdminAction);
        this.sockets.RegisterConnectionSuccessCallback(this.onConnectionSuccess);
        this.sockets.RegisterAgentActionCallback(this.onAgentAction);
    }

    public Start = async () => {
        await this.waitPlayersReady();
        if (this.isTrainingMode === false) {
            this.intervalLoop = global.setInterval(this.tick, this.tickIntervalMs);
        }
    };

    public Stop = async () => {
        if (this.intervalLoop !== undefined) {
            global.clearInterval(this.intervalLoop);
        }
    };

    private tick = async () => {
        this.telemetry.Info(`tick #${this.tickCount++}`);
        if (this.game.IsGameComplete() === true) {
            this.intervalLoop && global.clearInterval(this.intervalLoop);
            const endGameState: IEndGameState = this.game.GetEndGameState();
            const endGamePacket: EndGameStatePacket = {
                type: PacketType.EndGameState,
                payload: endGameState,
            };
            this.sockets.BroadCast(endGamePacket);
            this.writeEndGamePacket(endGamePacket);
            this.api.SendReplayToWebhook(endGamePacket);

            await this.telemetry.Engine.LogEvent(EngineTelemetryEvent.GameEnded, { tick: this.tickCount - 1 });
            this.shutdown();
        }
        const tickResult = await this.game.GetTickResult();
        const tickPacket: GameTickPacket = {
            type: PacketType.Tick,
            payload: tickResult,
        };
        this.sockets.BroadCast(tickPacket);
    };

    private waitPlayersReady = async () => {
        while (this.shouldWaitForPlayers) {
            if (this.gracePeriod !== null) {
                const delta = this.instantiatedUtc + this.gracePeriod - Utilities.UTCNowMs;
                if (delta < 0) {
                    this.onGracePeriodEnded();
                } else {
                    this.telemetry.Info(`Grace period configured to ${this.gracePeriod}ms, game will terminate in: ${delta}ms`);
                }
            }
            const message = `Waiting for agents to connect ${this.connectionTracker.TotalAgents} of ${this.minimumNumberOfAgents}`;
            // this.telemetry.Info(message);

            const infoPacket: InfoPacket = {
                type: PacketType.Info,
                payload: { message },
            };
            this.sockets.BroadCast(infoPacket);
            await Utilities.Sleep(this.checkReadyInterval);
        }
        this.telemetry.Info(`Agents have connected starting game in ${this.config.GameStartDelayMs} ms`);
        await Utilities.Sleep(this.config.GameStartDelayMs);
    };

    private onGracePeriodEnded = async () => {
        const winningAgent = this.getFirstConnectedAgentId();
        if (winningAgent !== undefined) {
            this.telemetry.Info(`Grace period over. AgentNumber: ${winningAgent} is winner.`);
        } else {
            this.telemetry.Info(`Grace period over. Game ended in a tie since no agent connected.`);
        }
        this.telemetry.Info(`Game completed shutting down.`);
        sys.exit(0);
    };

    private getFirstConnectedAgentId = () => {
        const expectedAgents = this.config.AgentSecretIdMap;
        const connectedAgentId = Array.from(expectedAgents.values()).find((agentId) => {
            return this.connectionTracker.IsAgentConnected(agentId) === true;
        });
        return connectedAgentId;
    };

    private onAdminAction = async (adminPacket: AdminPacket, connection: AdminSocketHandler) => {
        switch (adminPacket.type) {
            case PacketType.RequestTick:
                if (this.shouldWaitForPlayers === false) {
                    this.tick();
                }
                break;

            case PacketType.RequestGameReset:
                const { world_seed, prng_seed } = adminPacket;
                await this.resetGame(world_seed, prng_seed);
                break;

            case PacketType.EvaluateNextState:
                const { sequence_id } = adminPacket;
                const { next_state, is_complete, tick_result } = await evaluateNextState(
                    this.telemetry,
                    adminPacket.state,
                    adminPacket.actions
                );
                const nextStatePacket: NextGameStatePacket = {
                    type: PacketType.NextGameState,
                    payload: {
                        next_state,
                        is_complete,
                        tick_result,
                        sequence_id,
                    },
                };
                const output = JSON.stringify(nextStatePacket);
                connection.Send(output);
                break;
            default:
                this.telemetry.Error(`Unknown admin packet type: ${JSON.stringify(adminPacket)}`);
        }
    };

    private onAgentAction = (packet: AgentPacket, agentId: string) => {
        this.game.QueueAction(packet, agentId);
    };

    private onConnectionSuccess = (connection: AbstractSocketHandler) => {
        if (this.game.IsGameComplete() === true) {
            this.sendEndGameState(connection);
        } else {
            this.sendGameState(connection);
        }
    };

    private sendEndGameState = (connection: AbstractSocketHandler) => {
        const endGameState: IEndGameState = this.game.GetEndGameState();
        const endGamePacket: EndGameStatePacket = {
            type: PacketType.EndGameState,
            payload: endGameState,
        };
        const output = JSON.stringify(endGamePacket);

        connection.Send(output);
    };

    private sendGameState = (connection: AbstractSocketHandler) => {
        const id = connection.ConnectionId;
        const role = connection.Role;
        const agent_id = connection.AgentId;
        const gameState: IGameState = { ...this.game.GetCurrentGameState(), connection: { id, role, agent_id } };
        const gameStatePacket: GameStatePacket = {
            type: PacketType.GameState,
            payload: gameState,
        };
        const output = JSON.stringify(gameStatePacket);

        connection.Send(output);
    };

    private writeEndGamePacket = (packet: ServerPacket) => {
        if (this.config.SaveReplayEnabled === true) {
            const content = JSON.stringify(packet);
            try {
                fs.writeFileSync("./logs/replay.json", content);
            } catch (err) {
                console.error(err);
            }
        }
    };

    private shutdown = async () => {
        if (this.config.ShutdownOnGameEndEnabled) {
            this.telemetry.Info(`Game completed shutting down in 5000ms`);
            await Utilities.Sleep(5000);
            sys.exit(0);
        }
    };

    private resetGame = async (worldSeed?: number, prngSeed?: number) => {
        this.telemetry.Info(`Resetting game with world_seed: ${worldSeed ?? "current"}, prng_seed: ${prngSeed ?? "current"}`);
        this.api.LogEvent(EngineTelemetryEvent.GameReset, null);
        await this.Stop();
        this.tickCount = 1;
        this.game = createGameFromSeed(this.telemetry, this.config, worldSeed ?? this.config.WorldSeed, prngSeed ?? this.config.PrngSeed);

        this.connectionTracker.Connections.forEach((connection) => {
            this.sendGameState(connection);
        });
        await this.Start();
    };
}
