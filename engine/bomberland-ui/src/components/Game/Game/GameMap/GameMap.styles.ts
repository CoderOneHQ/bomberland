import styled from "styled-components";

interface IStyleProps {
    readonly maxWidth: number;
    readonly maxHeight: number;
}

export const MapContainer = styled("div")<IStyleProps>`
    background: #424242;
    width: ${({ maxWidth }) => maxWidth}px;
    height: ${({ maxHeight }) => maxHeight}px;
    display: flex;
    flex-wrap: wrap;
    position: relative;
`;
