import * as React from "react";
import f1 from "../svg/tile-1.svg";
import f2 from "../svg/tile-2.svg";
import f3 from "../svg/tile-3.svg";
import f4 from "../svg/tile-4.svg";
import f5 from "../svg/tile-5.svg";
import styled from "styled-components";
import { useEffect, useState } from "react";

const imageSet = [f1, f2, f3, f4, f5];

const Tile = styled("div")<IStyleProps>`
    color: #ff9900;
    width: ${({ width }) => Math.floor((100 / width) * 100) / 100}%;
    height: ${({ height }) => Math.floor((100 / height) * 100) / 100}%;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    background-image: url(${({ image }) => image});
    position: absolute;
    bottom: ${({ y, height }) => (y * Math.floor((100 / height) * 100)) / 100}%;
    left: ${({ x, width }) => (x * Math.floor((100 / width) * 100)) / 100}%;
`;

interface IStyleProps {
    readonly image: string;
    readonly width: number;
    readonly height: number;
    readonly x: number;
    readonly y: number;
}

interface IProps {
    readonly width: number;
    readonly height: number;
    readonly x: number;
    readonly y: number;
}

export const Cell: React.FC<React.PropsWithChildren<IProps>> = ({ x, y, width, height }) => {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * imageSet.length);
        setSelectedImageIndex(randomIndex);
    }, [setSelectedImageIndex]);
    return <Tile image={imageSet[selectedImageIndex]} x={x} y={y} width={width} height={height} />;
};
