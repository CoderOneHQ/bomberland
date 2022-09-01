import * as React from "react";
import { UnitMove, GameRole, GameStateClient, IEndGameState, IGameState, AdminPacket } from "@coderone/bomberland-library";
import { GameMap } from "./GameMap/GameMap";
import { SoundContextProvider } from "./SoundContext";
import { ControlPane } from "./ControlPane/ControlPane";
import { InfoPanel } from "./InfoPanel/InfoPanel";
import { useCallback, useEffect, useRef, useState } from "react";
import { Grid, GridItem, ErrorMessageContainer, LoadingContainer, LoadingMessage } from "./Game.styles";
import { Trans } from "react-i18next";
import { RouterLink } from "../../RouterLink/RouterLink";
import { Spinner } from "../../Spinner/Spinner";
import { TelemetryLink } from "../../TelemetryLink/TelemetryLink";
import { useKeypress } from "../../../hooks/useKeyPress";
import { InfoBar } from "../../InfoBar/InfoBar";
import { telemetry } from "../../../utilities/Telemetry/Telemetry";
import { TelemetryEvent } from "../../../utilities/Telemetry/TelemetryEvent";
import { BomberlandRoute } from "../../../utilities/BomberlandRoute";
import { Constants } from "../../../utilities/Constants";

export enum GameKeys {
    Up = "ArrowUp",
    Left = "ArrowLeft",
    Down = "ArrowDown",
    Right = "ArrowRight",
    Space = " ",
    SpaceBar = "Spacebar",
}

const gameKeys = new Set<string>(["ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight", "Spacebar", " "]);

const keyActionMap = new Map<GameKeys, UnitMove>([
    [GameKeys.Up, UnitMove.Up],
    [GameKeys.Down, UnitMove.Down],
    [GameKeys.Left, UnitMove.Left],
    [GameKeys.Right, UnitMove.Right],
]);

interface IProps {
    readonly connectionString: string;
}

export const Game: React.FC<React.PropsWithChildren<IProps>> = ({ connectionString }) => {
    const state = useRef<GameStateClient>();
    const [hasSentConnectionSucces, setHasSentConnectionSucces] = useState(false);
    const [gameState, setGameState] = useState<Omit<IGameState, "connection"> | undefined>();
    const [endGameState, setEndGameState] = useState<IEndGameState | undefined>();
    const [selectedUnitId, setSelectedUnitId] = useState<string | undefined>();
    const connection = state.current?.Connection;

    useEffect(() => {
        state.current = new GameStateClient(connectionString);
        telemetry.Log(TelemetryEvent.EngineConnectInit, null);

        return () => {
            state.current?.Destroy();
        };
    }, [connectionString]);

    const onGameState = useCallback(
        (gameStateResult: Omit<IGameState, "connection"> | undefined) => {
            if (gameStateResult !== undefined) {
                setGameState({ ...gameStateResult });
                if (hasSentConnectionSucces === false) {
                    telemetry.Log(TelemetryEvent.EngineConnectSuccess, null);
                    setHasSentConnectionSucces(true);
                }
            }
        },
        [setGameState, hasSentConnectionSucces]
    );

    const [hasSocketErrored, setHasSocketErrored] = useState(false);
    const onSocketError = useCallback(
        (_err: any) => {
            setHasSocketErrored(true);
            telemetry.Log(TelemetryEvent.EngineConnectError, null);
        },
        [setHasSocketErrored]
    );

    useEffect(() => {
        state.current?.SetGameTickCallback(onGameState);
    }, [onGameState]);

    useEffect(() => {
        state.current?.SetOnSocketError(onSocketError);
    }, [onSocketError]);

    const onEndGameState = useCallback(
        (endGameStateResult: IEndGameState) => {
            setEndGameState({ ...endGameStateResult });
        },
        [setEndGameState]
    );

    useEffect(() => {
        state.current?.SetOnEndGameCallback(onEndGameState);
    }, [onEndGameState]);

    const adminControlsEnabled = connection?.role === GameRole.Admin;
    const onKeyPress = useCallback(
        (key: string) => {
            if (gameKeys.has(key) === true && selectedUnitId !== undefined) {
                const move = keyActionMap.get(key as GameKeys);
                if (key === GameKeys.SpaceBar || key === GameKeys.Space) {
                    state.current?.SendPlaceBomb(selectedUnitId);
                } else if (move !== undefined) {
                    state.current?.SendMove(selectedUnitId, move);
                }
            }
        },
        [selectedUnitId]
    );
    useKeypress(onKeyPress);

    const sendAdminPacket = useCallback(
        (adminPacket: AdminPacket) => {
            if (adminControlsEnabled) {
                state.current?.SendAdminPacket(adminPacket);
            }
        },
        [adminControlsEnabled]
    );

    const onBombDetonated = useCallback(
        (coordinates: [number, number]) => {
            if (selectedUnitId !== undefined) {
                state.current?.SendDetonateBomb(selectedUnitId, coordinates);
            }
        },
        [selectedUnitId]
    );
    const isConnecting = connection === undefined && hasSocketErrored === false;

    if (isConnecting) {
        return (
            <LoadingContainer>
                <Spinner />
                <LoadingMessage>
                    <Trans key="gameEngineLoadingMessage">
                        Having issues? Join our{" "}
                        <TelemetryLink href={Constants.DiscordSupportLink} target="_blank">
                            Discord
                        </TelemetryLink>{" "}
                        for help.
                    </Trans>
                </LoadingMessage>
            </LoadingContainer>
        );
    }

    return (
        <SoundContextProvider>
            {hasSocketErrored === false ? (
                <Grid>
                    <GridItem>
                        <GameMap
                            connection={connection}
                            state={gameState}
                            onBombDetonated={onBombDetonated}
                            endGameState={endGameState}
                            setSelectedUnitId={setSelectedUnitId}
                            selectedUnitId={selectedUnitId}
                        />
                    </GridItem>
                    <GridItem>
                        <InfoPanel connection={connection} state={gameState} selectedUnitId={selectedUnitId} endGameState={endGameState} />
                        <ControlPane
                            connection={connection}
                            state={gameState}
                            endGameState={endGameState}
                            selectedUnitId={selectedUnitId}
                            sendAdminPacket={sendAdminPacket}
                        />
                    </GridItem>
                </Grid>
            ) : (
                <ErrorMessageContainer>
                    <InfoBar>
                        <div>
                            <Trans key="gameEngineConnectionErrorMessage">
                                Failed to connect to the game engine. Troubleshooting tips:
                                <br />
                                a) Please check that the game engine is running and reload this page
                                <br />
                                b) Use a Chrome or Firefox browser
                                <br />
                                Get help by joining our{" "}
                                <TelemetryLink href={Constants.DiscordSupportLink} target="_blank">
                                    Discord
                                </TelemetryLink>{" "}
                                or check the{" "}
                                <RouterLink href={BomberlandRoute.DocumentationGettingStarted}>Getting Started documentation</RouterLink>.
                            </Trans>
                        </div>
                    </InfoBar>
                </ErrorMessageContainer>
            )}
        </SoundContextProvider>
    );
};
