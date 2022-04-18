import styled from "styled-components";
import { Palette } from "../../theme/Palette";

export const Root = styled.div`
    background: ${Palette.Neutral10};
    max-width: 450px;
`;

export const SetupFormContainer = styled.div`
    background: ${Palette.Neutral0};
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    box-sizing: border-box;
    width: 450px;
    padding: 32px;
    border-radius: 3px;
    text-align: center;
`;

export const SetupFormWrapper = styled.div`
    display: grid;
    grid-row-gap: 16px;
    text-align: left;
    position: relative;
`;

export const HelpTooltipWrapper = styled.div`
    position: absolute;
    top: 0px;
    right: 0px;
`;
