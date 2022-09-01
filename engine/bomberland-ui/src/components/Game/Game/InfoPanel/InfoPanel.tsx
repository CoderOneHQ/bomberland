import * as React from "react";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import { IEndGameState, IGameState, IUnitState } from "@coderone/bomberland-library";
import { Table, HeaderColumn, TableCell, GameInfoContainer, Field } from "./InfoPanel.styles";
import { StatusTag, GameStatus } from "./StatusTag/StatusTag";
import { H2 } from "../../../H2/H2";
import { ContentCard } from "../../../ContentCard/ContentCard";
import { DownloadFileButton } from "../../../DownloadFileButton/DownloadFileButton";

interface IProps {
    readonly state: Omit<IGameState, "connection"> | undefined;
    readonly connection?: IGameState["connection"];
    readonly selectedUnitId: string | undefined;
    readonly endGameState?: IEndGameState;
}

const getGameStatus = (endGameState: IEndGameState | undefined, isGameRunning: boolean) => {
    if (endGameState !== undefined) {
        return GameStatus.GameOver;
    } else if (isGameRunning) {
        return GameStatus.Running;
    } else {
        return GameStatus.Pending;
    }
};

export const InfoPanel: React.FC<React.PropsWithChildren<IProps>> = ({ connection, state, selectedUnitId, endGameState }) => {
    if (state === undefined) {
        return null;
    }
    const [t] = useTranslation();
    const agentHeaderData = ["Unit", "Health", "Ammunition", "Blast diameter", "Coordinates", "Invulnerable", "Stunned"];
    const currentAgent = connection?.agent_id || "";
    const selectableUnits = currentAgent ? state.agents[currentAgent]?.unit_ids ?? [] : "";
    const isGameRunning = state.tick > 0;
    const gameStatus = useMemo(() => getGameStatus(endGameState, isGameRunning), [endGameState, isGameRunning]);
    const gameId = state.game_id;
    const dataUri = useMemo(() => encodeURIComponent(JSON.stringify(endGameState)), [endGameState]);

    return (
        <GameInfoContainer>
            <ContentCard>
                <H2>{t("gameInfo")}</H2>
                <Field>
                    <strong>{t("gameEngine.status")}:</strong> <StatusTag status={gameStatus}>{t(`gameEngine.${gameStatus}`)}</StatusTag>
                </Field>
                <Field>
                    <strong>{t("gameEngine.id")}:</strong> {gameId}
                </Field>
                <Field>
                    <strong>{t("gameEngine.myAgent")}:</strong> {currentAgent ? (currentAgent === "a" ? "A" : "B") : ""}
                </Field>
                <Field>
                    <strong>{t("gameEngine.myUnits")}:</strong> {selectableUnits.toString()}
                </Field>
                <Field>
                    <strong>{t("gameEngine.winner")}:</strong> {endGameState ? "Agent " + (endGameState.winning_agent_id === "a" ? "A" : "B") : ""}
                </Field>
                <Field>
                    <strong>{t("gameEngine.currentTick")}:</strong> {state ? state.tick : ""}
                </Field>
                <Field>
                    <strong>{t("replay")}</strong>:{" "} 
                    {endGameState !== undefined ? (
                        <DownloadFileButton
                                fileName="replay.json"
                                data={dataUri}
                                mediaType="text/json;charset=utf-8"
                                label={t("downloadReplay")}
                        />
                    )
                        :
                        "Available after the game ends"
                    }
                </Field>
            </ContentCard>
            <Table>
                <tbody>
                    <tr>
                        {agentHeaderData.map((data) => {
                            return <HeaderColumn key={data}>{data}</HeaderColumn>;
                        })}
                    </tr>

                    {Object.values(state ? state.unit_state : "").map((unit: IUnitState) => {
                        return (
                            <tr key={unit.unit_id}>
                                <TableCell currAgent={selectedUnitId === unit.unit_id} selectableUnit={currentAgent === unit.agent_id}>
                                    {unit.unit_id}
                                </TableCell>
                                <TableCell currAgent={selectedUnitId === unit.unit_id} selectableUnit={currentAgent === unit.agent_id}>
                                    {unit.hp}
                                </TableCell>
                                <TableCell currAgent={selectedUnitId === unit.unit_id} selectableUnit={currentAgent === unit.agent_id}>
                                    {unit.inventory.bombs}
                                </TableCell>
                                <TableCell currAgent={selectedUnitId === unit.unit_id} selectableUnit={currentAgent === unit.agent_id}>
                                    {unit.blast_diameter}
                                </TableCell>
                                <TableCell currAgent={selectedUnitId === unit.unit_id} selectableUnit={currentAgent === unit.agent_id}>
                                    {JSON.stringify(unit.coordinates)}
                                </TableCell>
                                <TableCell currAgent={selectedUnitId === unit.unit_id} selectableUnit={currentAgent === unit.agent_id}>
                                    {unit.invulnerable}
                                </TableCell>
                                <TableCell currAgent={selectedUnitId === unit.unit_id} selectableUnit={currentAgent === unit.agent_id}>
                                    {unit.stunned}
                                </TableCell>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        </GameInfoContainer>
    );
};
