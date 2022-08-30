import unitCFrame1 from "../svg/astronaut-u1-1.svg";
import unitCFrame2 from "../svg/astronaut-u1-2.svg";
import unitCFrame3 from "../svg/astronaut-u1-3.svg";
import unitCFrame4 from "../svg/astronaut-u1-4.svg";
import unitDFrame1 from "../svg/alien-u1-1.svg";
import unitDFrame2 from "../svg/alien-u1-2.svg";
import unitDFrame3 from "../svg/alien-u1-3.svg";
import unitDFrame4 from "../svg/alien-u1-4.svg";
import unitEFrame1 from "../svg/astronaut-u2-1.svg";
import unitEFrame2 from "../svg/astronaut-u2-2.svg";
import unitEFrame3 from "../svg/astronaut-u2-3.svg";
import unitEFrame4 from "../svg/astronaut-u2-4.svg";
import unitFFrame1 from "../svg/alien-u2-1.svg";
import unitFFrame2 from "../svg/alien-u2-2.svg";
import unitFFrame3 from "../svg/alien-u2-3.svg";
import unitFFrame4 from "../svg/alien-u2-4.svg";
import unitGFrame1 from "../svg/astronaut-u3-1.svg";
import unitGFrame2 from "../svg/astronaut-u3-2.svg";
import unitGFrame3 from "../svg/astronaut-u3-3.svg";
import unitGFrame4 from "../svg/astronaut-u3-4.svg";
import unitHFrame1 from "../svg/alien-u3-1.svg";
import unitHFrame2 from "../svg/alien-u3-2.svg";
import unitHFrame3 from "../svg/alien-u3-3.svg";
import unitHFrame4 from "../svg/alien-u3-4.svg";
import styled, { keyframes } from "styled-components";

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
    readonly isStunned: boolean;
    readonly isSelected: boolean;
    readonly x: number;
    readonly y: number;
    readonly hasClickHandler: boolean;
    readonly width: number;
    readonly height: number;
}

interface UnitMap {
    [id: string]: any;
}

const unitSprites: UnitMap = {
    c: [unitCFrame1, unitCFrame2, unitCFrame3, unitCFrame4],
    d: [unitDFrame1, unitDFrame2, unitDFrame3, unitDFrame4],
    e: [unitEFrame1, unitEFrame2, unitEFrame3, unitEFrame4],
    f: [unitFFrame1, unitFFrame2, unitFFrame3, unitFFrame4],
    g: [unitGFrame1, unitGFrame2, unitGFrame3, unitGFrame4],
    h: [unitHFrame1, unitHFrame2, unitHFrame3, unitHFrame4],
};

const agentDefaultSprites: UnitMap = {
    a: [unitCFrame1, unitCFrame2, unitCFrame3, unitCFrame4],
    b: [unitDFrame1, unitDFrame2, unitDFrame3, unitDFrame4],
};

function getUnitAnimation(unitId: string, agentId: string) {
    if (unitId in unitSprites) {
        const unitAnimation = keyframes`
        0% {
            background-image: url(${[unitSprites[unitId][0]]});
        }

        25% {
            background-image: url(${unitSprites[unitId][1]});
        }

        50% {
            background-image: url(${unitSprites[unitId][2]});
        }

        75% {
            background-image: url(${unitSprites[unitId][3]});
        }

        100% {
            background-image: url(${unitSprites[unitId][0]});
        }
        `;

        return unitAnimation;
    } else {
        const unitAnimation = keyframes`
        0% {
            background-image: url(${[agentDefaultSprites[agentId][0]]});
        }

        25% {
            background-image: url(${agentDefaultSprites[agentId][1]});
        }

        50% {
            background-image: url(${agentDefaultSprites[agentId][2]});
        }

        75% {
            background-image: url(${agentDefaultSprites[agentId][3]});
        }

        100% {
            background-image: url(${agentDefaultSprites[agentId][0]});
        }
        `;

        return unitAnimation;
    }
}

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

export interface IUnitRootProps {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
}

export const UnitRoot = styled("div")<IUnitRootProps>`
    position: absolute;
    width: ${({ width }) => Math.floor((100 / width) * 100) / 100}%;
    height: ${({ height }) => Math.floor((100 / height) * 100) / 100}%;
    bottom: ${({ y, height }) => (y * Math.floor((100 / height) * 100)) / 100}%;
    left: ${({ x, width }) => (x * Math.floor((100 / width) * 100)) / 100}%;
    transition: 0.07s;
`;

export const UnitIdLabel = styled("div")`
    top: 0px;
    left: 0px;
    position: absolute;
    font-size: 12px;
    color: #ffffff;
    font-weight: 700;
    text-shadow: 0 0 2px #000;
`;

export const UnitHealthLabel = styled("div")`
    top: 0px;
    right: 0px;
    position: absolute;
    font-size: 12px;
    font-weight: 700;
    color: #ffffff;
    text-shadow: 0 0 2px #000;
`;

export const UnitDiv = styled("div")<IUnitStyleProps>`
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    cursor: ${({ hasClickHandler }) => (hasClickHandler ? `pointer` : `default`)};
    color: #ff9900;
    font-weight: bold;
    background-size: contain;
    background-position: center center;
    border: ${({ isSelected }) => (isSelected ? `5px solid #ff9900` : `none`)};
    box-sizing: border-box;
    opacity: ${({ isInvulnerable, isDead }) => (isInvulnerable || isDead ? 0.4 : 1)};
    filter: ${({ isStunned }) => (isStunned ? `grayscale(100%)` : `grayscale(0%)`)};
    animation: ${({ unitId, agentId, isDead, isStunned }) => !(isDead || isStunned) && getUnitAnimation(unitId, agentId)} 0.5s linear
        infinite;
    background-image: url(${({ agentId, unitId, isDead, isStunned }) =>
        (isDead || isStunned) && (unitId in unitSprites ? unitSprites[unitId][0] : agentDefaultSprites[agentId])});

    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.07s;
`;
