import styled from "styled-components";
import { Palette } from "../../theme/Palette";

export const LinkButton = styled.a`
    cursor: pointer;
    text-decoration: none;
    font-size: 14px;
    font-weight: 700;
    border: 1px;
    border-style: solid;
    border-radius: 4px;
    background-color: ${Palette.Neutral100};
    border-color: ${Palette.Neutral100};
    display: inline-block;
    padding: 4px 8px;
    color: ${Palette.Neutral0};
    text-align: center;
    transition: background-color 100ms ease;
    margin-left: 8px;

    :hover {
        background-color: ${Palette.Neutral90};
        color: ${Palette.Neutral0};
    }

    :active {
        background-color: ${Palette.Neutral90};
    }
`;
