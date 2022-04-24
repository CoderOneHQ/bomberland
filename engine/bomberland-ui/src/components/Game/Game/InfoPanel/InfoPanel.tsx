import * as React from "react";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import { IEndGameState, IGameState } from "@coderone/bomberland-library";
import { Table, HeaderColumn, TableCell, GameInfoContainer } from "./InfoPanel.styles";
import { StatusTag, GameStatus } from "./StatusTag/StatusTag";
import { H2 } from "../../../H2/H2";
import { ContentCard } from "../../../ContentCard/ContentCard";

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

export const InfoPanel: React.FC<IProps> = ({ connection, state, selectedUnitId, endGameState }) => {
    if (state === undefined) {
        return null;
    }
    const [t] = useTranslation();
    const agentHeaderData = ["Unit", "Health", "Ammunition", "Blast diameter", "Coordinates", "Invulnerability"];
    const currentAgent = connection?.agent_id || "";
    const selectableUnits = currentAgent ? state.agents[currentAgent]?.unit_ids ?? [] : "";
    const isGameRunning = state.tick > 0;
    const gameStatus = useMemo(() => getGameStatus(endGameState, isGameRunning), [endGameState, isGameRunning]);
    const gameId = state.game_id;

    return (
        <GameInfoContainer>
            <ContentCard>
                <H2>{t("gameInfo")}</H2>
                <p>
                    {t("gameEngine.status")}: <StatusTag status={gameStatus}>{t(`gameEngine.${gameStatus}`)}</StatusTag>
                </p>
                <p>
                    {t("gameEngine.id")}: {gameId}
                </p>
                <p>
                    {t("gameEngine.myAgent")}: {currentAgent ? (currentAgent === "a" ? "A (Wizard)" : "B (Knight)") : ""}
                </p>
                <p>
                    {t("gameEngine.myUnits")}: {selectableUnits.toString()}
                </p>
                <p>
                    {t("gameEngine.winner")}: {endGameState ? "Agent " + (endGameState.winning_agent_id === "a" ? "A" : "B") : ""}
                </p>
                <p>
                    {t("gameEngine.currentTick")}: {state ? state.tick : ""}
                </p>
            </ContentCard>
            <Table>
                <tbody>
                    <tr>
                        {agentHeaderData.map((data) => {
                            return <HeaderColumn key={data}>{data}</HeaderColumn>;
                        })}
                    </tr>

                    {Object.values(state ? state.unit_state : "").map((unit) => {
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
                                    {unit.invulnerability}
                                </TableCell>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        </GameInfoContainer>
    );
};
