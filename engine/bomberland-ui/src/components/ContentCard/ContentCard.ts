import styled from "styled-components";
import { Palette } from "../../theme/Palette";

interface IProps {
    readonly minWidth?: string;
    readonly maxWidth?: string;
    readonly gridRowGap?: string;
    readonly padding?: string;
    readonly border?: string;
    readonly backgroundColor?: string;
}

export const ContentCard = styled("div")<IProps>`
    display: grid;
    grid-row-gap: ${({ gridRowGap }) => (gridRowGap !== undefined ? gridRowGap : "16px")};
    border: ${({ border }) => (border !== undefined ? border : `1px solid ${Palette.Neutral20}`)};
    border-radius: 4px;
    padding: ${({ padding }) => (padding !== undefined ? padding : "24px")};
    background-color: ${({ backgroundColor }) => (backgroundColor !== undefined ? backgroundColor : Palette.Neutral0)};
    max-width: ${({ maxWidth }) => (maxWidth !== undefined ? maxWidth : "500px")};
    min-width: ${({ minWidth }) => (minWidth !== undefined ? minWidth : "auto")};
`;
