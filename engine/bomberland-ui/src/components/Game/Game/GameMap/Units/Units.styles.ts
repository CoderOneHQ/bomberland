import knight1 from "../svg/knight_animation_1.svg";
import knight2 from "../svg/knight_animation_2.svg";
import knight3 from "../svg/knight_animation_3.svg";
import knight4 from "../svg/knight_animation_4.svg";
import styled, { keyframes } from "styled-components";
import wizard1 from "../svg/wizard_animation_1.svg";
import wizard2 from "../svg/wizard_animation_2.svg";
import wizard3 from "../svg/wizard_animation_3.svg";
import wizard4 from "../svg/wizard_animation_4.svg";

interface IStyleProps {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
}

interface IUnitStyleProps {
    readonly agentId: string;
    readonly unitId: string;
    readonly isInvulnerable: boolean;
    readonly isDead: boolean;
    readonly isSelected: boolean;
    readonly x: number;
    readonly y: number;
    readonly hasClickHandler: boolean;
    readonly width: number;
    readonly height: number;
}

const wizardAnimation = keyframes`
    0% {
        background-image: url(${wizard1});
    }

    25% {
        background-image: url(${wizard2});
    }

    50% {
        background-image: url(${wizard3});
    }

    75% {
        background-image: url(${wizard4});
    }

    100% {
        background-image: url(${wizard1});
    }
`;

const knightAnimation = keyframes`
    0% {
        background-image: url(${knight1});
    }

    25% {
        background-image: url(${knight2});
    }

    50% {
        background-image: url(${knight3});
    }

    75% {
        background-image: url(${knight4});
    }

    100% {
        background-image: url(${knight1});
    }
`;

export const ImageDiv = styled("div")<IStyleProps>`
    width: ${({ width }) => Math.floor((100 / width) * 100) / 100}%;
    height: ${({ height }) => Math.floor((100 / height) * 100) / 100}%;
    color: #ff9900;
    font-weight: bold;
    position: absolute;
    background-size: contain;
    background-position: center center;
    bottom: ${({ y, height }) => (y * Math.floor((100 / height) * 100)) / 100}%;
    left: ${({ x, width }) => (x * Math.floor((100 / width) * 100)) / 100}%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.07s;
`;

export const UnitDiv = styled("div")<IUnitStyleProps>`
    cursor: ${({ hasClickHandler }) => (hasClickHandler ? `pointer` : `default`)};
    width: ${({ width }) => Math.floor((100 / width) * 100) / 100}%;
    height: ${({ height }) => Math.floor((100 / height) * 100) / 100}%;
    color: #ff9900;
    font-weight: bold;
    position: absolute;
    background-size: contain;
    background-position: center center;
    border: ${({ isSelected }) => (isSelected ? `5px solid #ff9900` : `none`)};
    box-sizing: border-box;
    opacity: ${({ isInvulnerable, isDead }) => (isInvulnerable || isDead ? 0.4 : 1)};
    animation: ${({ agentId, isDead }) => !isDead && (agentId === "a" ? wizardAnimation : knightAnimation)} 0.5s linear infinite;
    background-image: url(${({ agentId, isDead }) => isDead && (agentId === "a" ? wizard1 : knight1)});
    bottom: ${({ y, height }) => (y * Math.floor((100 / height) * 100)) / 100}%;
    left: ${({ x, width }) => (x * Math.floor((100 / width) * 100)) / 100}%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.07s;
`;
