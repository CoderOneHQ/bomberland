/* Button with disabled/enabled states */

import styled from "styled-components";
import { Palette } from "../../theme/Palette";

export const StateButton = styled.button`
    position: relative;
    border-radius: 4px;
    padding: 8px 16px;
    font-size: 14px;
    font-weight: 700;
    font-family: inherit;
    border-style: solid;
    border: 1px;
    display: inline-block;
    min-height: 36px;

    ${(props) =>
        props.disabled
            ? `
    background-color: ${Palette.Neutral20};
    font-color: ${Palette.Neutral60};
    `
            : `
    cursor: pointer;
    background-color: ${Palette.Neutral100};
    border-color: ${Palette.Neutral100};
    color: ${Palette.Neutral0};
    transition: background-color 200ms ease;

    :hover {
        background-color: ${Palette.Neutral90};
    }

    `};
`;
