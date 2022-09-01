import * as React from "react";
import { GameReplay } from "./GameReplay";
import { ReplayViewer } from "./ReplayViewer";
import { useCallback, useState } from "react";
import { useEffect } from "react";
import { telemetry } from "../utilities/Telemetry/Telemetry";
import { TelemetryEvent } from "../utilities/Telemetry/TelemetryEvent";
import { FileUploader } from "../components/FileUploader/FileUploader";

export const ReplaysContent: React.FC<React.PropsWithChildren<unknown>> = () => {
    const [replay, setReplay] = useState<GameReplay>();
    const [replayFile, setReplayFile] = useState<string | undefined>(window.history.state?.replayFile);

    const onFileLoaded = useCallback(
        (value: string | undefined) => {
            setReplayFile(value);
            telemetry.Log(TelemetryEvent.LoadReplayInit, null);
        },
        [setReplayFile]
    );
    useEffect(() => {
        if (replayFile !== undefined) {
            try {
                const gameReplay = new GameReplay(replayFile);
                setReplay(gameReplay);
                telemetry.Log(TelemetryEvent.LoadReplaySuccess, null);
            } catch (e) {
                telemetry.Log(TelemetryEvent.LoadReplayError, e);
            }
        } else {
            setReplay(undefined);
        }
    }, [replayFile]);

    return (
        <React.Fragment>
            {replayFile === undefined ? <FileUploader onFileLoaded={onFileLoaded} /> : <ReplayViewer replay={replay} />}
        </React.Fragment>
    );
};
