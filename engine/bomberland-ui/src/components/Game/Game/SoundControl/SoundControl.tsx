import * as React from "react";
import { Root } from "./SoundControl.styles";
import { Slider } from "@fluentui/react";
import { SoundContext } from "../SoundContext";
import { useCallback } from "react";
import { useContext } from "react";
import { useTranslation } from "react-i18next";

export const SoundControl: React.FC = () => {
    const { setVolume, volume } = useContext(SoundContext);
    const [t] = useTranslation();

    const onVolumeChanged = useCallback(
        (value: number) => {
            setVolume(value);
        },
        [setVolume]
    );
    return (
        <Root>
            <Slider label={t("volume")} min={0} max={1} value={volume} step={0.1} onChange={onVolumeChanged} />
        </Root>
    );
};
