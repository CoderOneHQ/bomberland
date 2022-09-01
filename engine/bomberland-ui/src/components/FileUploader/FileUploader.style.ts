import styled from "styled-components";
import { Palette } from "../../theme/Palette";

export const UploaderContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    width: 256px;
    height: 256px;
    background-color: ${Palette.Primary10};
    text-align: center;
    cursor: pointer;
    text-decoration: none;
    border: 1px;
    border-style: dashed;
    border-radius: 2px;
    border-color: ${Palette.Primary100};
    color: ${Palette.Neutral0};
    transition: background-color 250ms ease;

    :hover {
        opacity: 0.9;
    }

    :active {
        background-color: ${Palette.Neutral20};
    }
`;

export const FormField = styled.input`
    cursor: pointer;
    width: 256px;
    z-index: 1;
    position: absolute;
    opacity: 0;
    top: 0;
    left: 0;
    height: 256px;
`;

export const TextBox = styled.div`
    color: ${Palette.Primary110};
    font-size: 14px;
`;

export const IconWrapper = styled.div`
    color: ${Palette.Primary110};
    font-size: 64px;
    margin-top: -24px;
`;
