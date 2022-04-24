import * as React from "react";
import sand1 from "../../sounds/sand1.wav";
import sand2 from "../../sounds/sand2.wav";
import sand3 from "../../sounds/sand3.wav";
import sand4 from "../../sounds/sand4.wav";
import useSound from "use-sound";
import { UnitDiv } from "./Units.styles";
import { SoundContext } from "../../SoundContext";
import { useContext, useEffect, useMemo, useState } from "react";

interface IProps {
    readonly x: number;
    readonly y: number;
    readonly agentId: string;
    readonly unitId: string;
    readonly isInvulnerable: boolean;
    readonly isDead: boolean;
    readonly isSelected: boolean;
    readonly onClick?: () => void;
    readonly width: number;
    readonly height: number;
}

export const Unit: React.FC<IProps> = ({ x, y, agentId, unitId, isInvulnerable, isDead, isSelected, onClick, width, height }) => {
    const { volume } = useContext(SoundContext);
    const [playSand1] = useSound(sand1, { volume });
    const [playSand2] = useSound(sand2, { volume });
    const [playSand3] = useSound(sand3, { volume });
    const [playSand4] = useSound(sand4, { volume });
    const sounds = useMemo(() => {
        return [playSand1, playSand2, playSand3, playSand4];
    }, [playSand1, playSand2, playSand3, playSand4]);
    const [randomSoundIndex] = useState(Math.floor(Math.random() * sounds.length));
    useEffect(() => {
        sounds[randomSoundIndex]();
    }, [x, y, agentId, randomSoundIndex, sounds]);

    const hasClickHandler = onClick !== undefined;
    return (
        <UnitDiv
            onClick={onClick}
            hasClickHandler={hasClickHandler}
            key={agentId}
            agentId={agentId}
            unitId={unitId}
            x={x}
            y={y}
            width={width}
            height={height}
            isInvulnerable={isInvulnerable}
            isSelected={isSelected}
            isDead={isDead}
        />
    );
};
