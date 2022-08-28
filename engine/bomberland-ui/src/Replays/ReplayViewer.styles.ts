import styled from "styled-components";

export const Grid = styled.div`
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
    column-gap: 16px;
`;

export const GridItem = styled.div`
    display: flex;
    flex-direction: column;
`;
