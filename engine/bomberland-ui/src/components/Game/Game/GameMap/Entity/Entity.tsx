import * as React from "react";
import ammunition from "../svg/remote_ammo.svg";
import blast3 from "../svg/boom_3.svg";
import fire1 from "../svg/fire_1.svg";
import blastpowerup from "../svg/blast_powerup.svg";
import bombPlacedSfx from "../../sounds/bomb_placed.wav";
import concreteBreak5Sfx from "../../sounds/concrete_break2.wav";
import explode5Sfx from "../../sounds/explode5.wav";
import oreblock from "../svg/ore_block.svg";
import steelblock from "../svg/steel_block.svg";
import steelBreak1Sfx from "../../sounds/steel_break1.wav";
import steelBreak2Sfx from "../../sounds/steel_break2.wav";
import useSound from "use-sound";
import woodCreateBreak3Sfx from "../../sounds/wood_crate_break3.wav";
import woodenblock from "../svg/crate.svg";
import { BlastDiv, BombDiv, FireDiv, ImageDiv } from "./Entity.styles";
import { EntityType } from "@coderone/bomberland-library";
import { SoundContext } from "../../SoundContext";
import { useCallback, useContext, useEffect, useState } from "react";

interface IProps {
    readonly type: string;
    readonly x: number;
    readonly y: number;
    readonly expires?: number;
    readonly agent_id?: string;
    readonly onBombDetonated?: (coordinates: [number, number]) => void;
    readonly width: number;
    readonly height: number;
}

export const imagedEntities = new Set<string>([EntityType.Bomb, EntityType.WoodBlock, EntityType.OreBlock, EntityType.MetalBlock]);

// TODO: split out into individual entities since this is growing large
export const Entity: React.FC<IProps> = ({ expires, type, x, y, onBombDetonated, agent_id, width, height }) => {
    const { volume } = useContext(SoundContext);
    const [playExplode5] = useSound(explode5Sfx, { volume });
    const [playConcreteBreak5] = useSound(concreteBreak5Sfx, { volume: volume });
    const [playWoodCreateBreak3] = useSound(woodCreateBreak3Sfx, { volume });
    const [playBombPlaced] = useSound(bombPlacedSfx, { volume });
    const [playSteelBreak1] = useSound(steelBreak1Sfx, { volume });
    const [playSteelBreak2] = useSound(steelBreak2Sfx, { volume });

    const onClick = useCallback(() => {
        onBombDetonated?.([x, y]);
    }, [x, y, onBombDetonated]);

    useEffect(() => {
        return () => {
            if (type === EntityType.WoodBlock) {
                playWoodCreateBreak3();
            }
        };
    }, [type, playWoodCreateBreak3]);

    useEffect(() => {
        return () => {
            if (type === EntityType.OreBlock) {
                playConcreteBreak5();
            }
        };
    }, [type, playConcreteBreak5]);

    useEffect(() => {
        return () => {
            if (type === EntityType.Bomb) {
                playExplode5();
            }
        };
    }, [type, playExplode5]);

    useEffect(() => {
        if (type === EntityType.Bomb) {
            playBombPlaced();
        }
    }, [type, playBombPlaced]);

    const steelSounds = [playSteelBreak1, playSteelBreak2];
    const [randomSteelSound] = useState(Math.floor(Math.random() * steelSounds.length));
    useEffect(() => {
        return () => {
            if (type === EntityType.MetalBlock && randomSteelSound === 0) {
                playSteelBreak1();
            }
        };
    }, [type, randomSteelSound, playSteelBreak1]);

    useEffect(() => {
        return () => {
            if (type === EntityType.MetalBlock && randomSteelSound === 1) {
                playSteelBreak2();
            }
        };
    }, [type, randomSteelSound, playSteelBreak2]);

    switch (type) {
        case EntityType.BlastPowerup:
            return <ImageDiv image={blastpowerup} x={x} y={y} width={width} height={height} />;
        case EntityType.Ammo:
            return <ImageDiv image={ammunition} x={x} y={y} width={width} height={height} />;
        case EntityType.Bomb:
            return <BombDiv onClick={onClick} x={x} y={y} width={width} height={height} owner={agent_id} />;
        case EntityType.WoodBlock:
            return <ImageDiv image={woodenblock} x={x} y={y} width={width} height={height} />;
        case EntityType.OreBlock:
            return <ImageDiv image={oreblock} x={x} y={y} width={width} height={height} />;
        case EntityType.MetalBlock:
            return <ImageDiv image={steelblock} x={x} y={y} width={width} height={height} />;
        case EntityType.Blast:
            if (expires) {
                return <BlastDiv image={blast3} x={x} y={y} width={width} height={height} />;
            }
            return <FireDiv image={fire1} x={x} y={y} width={width} height={height} />;
        default:
            return null;
    }
};
