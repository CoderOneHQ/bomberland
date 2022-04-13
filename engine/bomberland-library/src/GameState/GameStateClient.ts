import { AgentBombPacket, AgentDetonatePacket, UnitMove, AgentMovePacket, AgentPacket } from "../Types/ClientPacket/AgentPacket";
import { AdminPacket, EvaluateNextStatePacket } from "../Types/ClientPacket/AdminPacket";
import { GameStateMachine } from "./GameStateMachine";
import { IEndGameState, IGameState, IGameTick } from "../Types/Game.types";
import { PacketType } from "../Types/Connection.types";
import { ServerPacket } from "../Types/ServerPacket/ServerPacket";
const WebSocketClient = require("websocket").w3cwebsocket;

export class GameStateClient {
    private socket: WebSocket;
    private onGameTickCallback: ((gameState: Omit<IGameState, "connection"> | undefined) => void) | undefined;
    private onEndGameCallback: ((endGameState: IEndGameState) => void) | undefined;
    private onSocketError: ((error: Event) => void) | undefined;
    private stateMachine: GameStateMachine | undefined;
    public Connection: IGameState["connection"] | undefined;

    public constructor(private gameServerConnectionString: string) {
        this.socket = new WebSocketClient(this.gameServerConnectionString);
        this.attachHandlers();
    }

    public Destroy = (): void => {
        this.socket.close();
    };

    public SetOnSocketError = (onSocketError: (error: Event) => void) => {
        this.onSocketError = onSocketError;
    };

    public SetGameTickCallback = (onGameState: ((gameState: Omit<IGameState, "connection"> | undefined) => void) | undefined): void => {
        this.onGameTickCallback = onGameState;
    };

    public SetOnEndGameCallback = (onEndGameState: ((endGameState: IEndGameState) => void) | undefined): void => {
        this.onEndGameCallback = onEndGameState;
    };

    public SendMove = (unit_id: string, move: UnitMove): void => {
        const packet: AgentMovePacket = { type: PacketType.Move, move, unit_id };
        const payload = JSON.stringify(packet);
        this.socket.send(payload);
    };

    public SendPlaceBomb = (unit_id: string): void => {
        const packet: AgentBombPacket = { type: PacketType.Bomb, unit_id };
        const payload = JSON.stringify(packet);
        this.socket.send(payload);
    };

    public SendDetonateBomb = (unit_id: string, coordinates: [number, number]): void => {
        const packet: AgentDetonatePacket = { type: PacketType.Detonate, coordinates, unit_id };
        const payload = JSON.stringify(packet);
        this.socket.send(payload);
    };

    public SendAdminPacket = (adminPacket: AdminPacket): void => {
        const payload = JSON.stringify(adminPacket);
        this.socket.send(payload);
    };

    public SendEvaluateNextState = (
        sequenceId: number,
        state: Omit<IGameState, "connection">,
        actions: Array<{ readonly agent_id: string; readonly action: AgentPacket }>
    ): void => {
        const packet: EvaluateNextStatePacket = {
            type: PacketType.EvaluateNextState,
            sequence_id: sequenceId,
            state,
            actions,
        };
        const payload = JSON.stringify(packet);
        this.socket.send(payload);
    };

    private attachHandlers = (): void => {
        const connection = this.socket;
        connection.onopen = (_ev) => {
            console.log("Connection opened");
        };
        connection.onmessage = (ev) => {
            const rawMessage = ev.data;
            try {
                const data = JSON.parse(rawMessage) as ServerPacket;
                switch (data.type) {
                    case PacketType.Info:
                        break;
                    case PacketType.GameState:
                        this.onGameState(data.payload);
                        break;
                    case PacketType.Tick:
                        this.onGameTickReceived(data.payload);
                        break;
                    case PacketType.EndGameState:
                        this.onEndGameState(data.payload);
                        break;
                    default:
                        console.error(`Unknown server packet:`);
                        console.error(data);
                }
            } catch (e) {
                console.error(`failed to process payload with error:`);
                console.error(e);
                console.error(rawMessage);
            }
        };
        connection.onerror = (err) => {
            this.onSocketError?.(err);
        };
    };

    private onEndGameState = (state: IEndGameState) => {
        this.onEndGameCallback?.(state);
    };

    private onGameState = (state: IGameState) => {
        this.stateMachine = new GameStateMachine(state);
        this.Connection = state.connection;
        this.onGameTickCallback?.(state);
    };

    private onGameTickReceived = (tick: IGameTick) => {
        this.stateMachine?.Update(tick);
        const state = this.stateMachine?.State;
        state && this.onGameTickCallback?.(state);
    };
}
