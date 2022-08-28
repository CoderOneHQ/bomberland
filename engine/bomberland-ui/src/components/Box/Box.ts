import styled from "styled-components";
import { Palette } from "../../theme/Palette";

export const Box = styled.div`
    display: grid;
    grid-row-gap: 16px;
    border: solid 1px ${Palette.Neutral20};
    border-radius: 4px;
    padding: 16px;
    background-color: ${Palette.Neutral0};
`;
