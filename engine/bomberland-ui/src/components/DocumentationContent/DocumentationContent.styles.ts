import styled from "styled-components";
import { Viewport } from "../../utilities/Viewport";

export const Root = styled.div`
    @media screen and (max-width: ${Viewport.Large}px) {
        max-width: 800px;
    }
    padding-top: 64px;
    margin: 0 auto;
    max-width: 950px;
`;

export const Grid = styled.div`
    @media screen and (max-width: ${Viewport.Large}px) {
        display: flex;
        flex-direction: column;
    }

    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 16px;
    row-gap: 16px;
`;

export const Headline = styled.h1`
    font-size: 48px;
    font-weight: 700;
    padding-bottom: 8px;
`;

export const InformationHeader = styled.section`
    font-size: 16px;
    padding-bottom: 64px;
`;
