import bomb1 from "../svg/bombs/remote_bomb_anim_1.svg";
import bomb2 from "../svg/bombs/remote_bomb_anim_2.svg";
import pinkBomb1 from "../svg/bombs/pink_remote_bomb_anim_1.svg";
import pinkBomb2 from "../svg/bombs/pink_remote_bomb_anim_2.svg";
import styled, { keyframes } from "styled-components";

interface IStyleProps {
    readonly image: string;
    readonly x: number;
    readonly y: number;
    readonly owner?: string;
    readonly width: number;
    readonly height: number;
}

export const ImageDiv = styled("div")<IStyleProps>`
    width: ${({ width }) => Math.floor((100 / width) * 100) / 100}%;
    height: ${({ height }) => Math.floor((100 / height) * 100) / 100}%;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    user-select: none;
    font-weight: bold;
    background-image: url(${({ image }) => image});
    position: absolute;
    bottom: ${({ y, height }) => (y * Math.floor((100 / height) * 100)) / 100}%;
    left: ${({ x, width }) => (x * Math.floor((100 / width) * 100)) / 100}%;
`;

const blastImageAnimation = keyframes`
    0% {
        transform: scale(0.9);
    }

    50% {
        transform: scale(1.0);
    }
    100% {
        transform: scale(0.9);
    }
`;

const throbbing = keyframes`
    0% {
        transform: scale(0.6);
    }

    50% {
        transform: scale(1.2);
    }
    100% {
        transform: scale(0.6);
    }
`;

const bombAnimation = keyframes`
    0%{
        background-image: url(${bomb1});
    }

    50%{
        background-image: url(${bomb2});
    }

    100%{
        background-image: url(${bomb1});
    }
`;

const pinkBombAnimation = keyframes`
    0%{
        background-image: url(${pinkBomb1});
    }

    50%{
        background-image: url(${pinkBomb2});
    }

    100%{
        background-image: url(${pinkBomb1});
    }
`;

export const BombDiv = styled("div")<Omit<IStyleProps, "image">>`
    width: ${({ width }) => Math.floor((100 / width) * 100) / 100}%;
    height: ${({ height }) => Math.floor((100 / height) * 100) / 100}%;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    user-select: none;
    font-weight: bold;
    animation: ${throbbing} 0.5s linear infinite, ${({ owner }) => (owner === "a" ? bombAnimation : pinkBombAnimation)} 0.2s linear infinite;
    cursor: pointer;
    position: absolute;
    bottom: ${({ y, height }) => (y * Math.floor((100 / height) * 100)) / 100}%;
    left: ${({ x, width }) => (x * Math.floor((100 / width) * 100)) / 100}%;
`;

export const BlastDiv = styled("div")<IStyleProps>`
    width: ${({ width }) => Math.floor((100 / width) * 100) / 100}%;
    height: ${({ height }) => Math.floor((100 / height) * 100) / 100}%;
    background-size: cover;
    background-image: url(${({ image }) => image});
    background-repeat: no-repeat;
    background-position: center center;
    animation: ${throbbing} 1s linear infinite;
    user-select: none;
    font-weight: bold;
    position: absolute;
    bottom: ${({ y, height }) => (y * Math.floor((100 / height) * 100)) / 100}%;
    left: ${({ x, width }) => (x * Math.floor((100 / width) * 100)) / 100}%;
`;

export const FireDiv = styled("div")<IStyleProps>`
    width: ${({ width }) => Math.floor((100 / width) * 100) / 100}%;
    height: ${({ height }) => Math.floor((100 / height) * 100) / 100}%;
    background-size: cover;
    background-image: url(${({ image }) => image});
    background-repeat: no-repeat;
    background-position: center center;
    animation: ${blastImageAnimation} 1s linear infinite;
    user-select: none;
    font-weight: bold;
    position: absolute;
    bottom: ${({ y, height }) => (y * Math.floor((100 / height) * 100)) / 100}%;
    left: ${({ x, width }) => (x * Math.floor((100 / width) * 100)) / 100}%;
`;
