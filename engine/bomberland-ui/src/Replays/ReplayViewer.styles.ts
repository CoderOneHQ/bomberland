import styled from "styled-components";

export const Grid = styled.div`
    display: grid;
    max-width: 100%;
    max-height: 100%;
    grid-template-columns: max-content max-content;
    grid-column-gap: 32px;
`;

export const GridItem = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;
