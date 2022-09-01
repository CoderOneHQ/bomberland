import * as React from "react";
import { GameReplay } from "./GameReplay";
import { Grid, GridItem } from "./ReplayViewer.styles";
import { Slider } from "@fluentui/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Box } from "../components/Box/Box";
import { GameMap } from "../components/Game/Game/GameMap/GameMap";
import { SoundControl } from "../components/Game/Game/SoundControl/SoundControl";
import { InfoPanel } from "../components/Game/Game/InfoPanel/InfoPanel";

interface IProps {
    readonly replay: GameReplay | undefined;
}

export const ReplayViewer: React.FC<React.PropsWithChildren<IProps>> = ({ replay }) => {
    const [t] = useTranslation();
    const [tickRateHz, setTickRateHz] = useState(15);
    const [tick, setTick] = useState(0);
    const [selectedUnitId, setSelectedUnitId] = useState<string | undefined>();
    const gameState = useMemo(() => {
        return replay?.GetState(tick);
    }, [tick, replay]);

    useEffect(() => {
        const tickIntervalMs = tickRateHz !== 0 ? 1000 / tickRateHz : 4;
        const timeout = setTimeout(() => {
            const isReplayPaused = tickRateHz === 0;
            if (isReplayPaused === false) {
                if (tick < (replay?.TotalTicks ?? 0)) {
                    setTick(tick + 1);
                }
            }
        }, tickIntervalMs);

        return () => {
            clearTimeout(timeout);
        };
    }, [tick, setTick, tickRateHz, replay?.TotalTicks]);

    const onSpeedChanged = useCallback(
        (value: number) => {
            setTickRateHz(value);
        },
        [setTickRateHz]
    );

    const onProgressChanged = useCallback(
        (value: number) => {
            setTick(value);
        },
        [setTick]
    );

    if (replay === undefined) {
        return <React.Fragment>{t("noReplay")}</React.Fragment>;
    }
    return (
        <Grid>
            <GridItem>
                <GameMap connection={undefined} state={gameState} setSelectedUnitId={setSelectedUnitId} selectedUnitId={selectedUnitId} />
            </GridItem>
            <GridItem>
                <Box>
                    <Slider
                        label={t("tickNumber", { tick: tick, totalTicks: replay.TotalTicks })}
                        onChange={onProgressChanged}
                        min={0}
                        max={replay.TotalTicks}
                        value={tick}
                    />
                    <Slider label={t("playbackSpeed")} onChange={onSpeedChanged} min={0} max={30} value={tickRateHz} />
                    <SoundControl />
                </Box>
                <InfoPanel state={gameState} selectedUnitId={selectedUnitId} />
            </GridItem>
        </Grid>
    );
};
