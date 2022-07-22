import * as React from "react";
import { PendingStatusTag, RunningStatusTag, EndedStatusTag } from "./StatusTag.styles";

export enum GameStatus {
    Pending = "pending",
    Running = "running",
    GameOver = "ended",
}

interface IProps {
    readonly status: GameStatus.Pending | GameStatus.Running | GameStatus.GameOver;
}

export const StatusTag: React.FC<React.PropsWithChildren<IProps>> = ({ status, children }) => {
    switch (status) {
        case GameStatus.Pending:
            return <PendingStatusTag>{children}</PendingStatusTag>;
        case GameStatus.Running:
            return <RunningStatusTag>{children}</RunningStatusTag>;
        case GameStatus.GameOver:
            return <EndedStatusTag>{children}</EndedStatusTag>;
    }
};
