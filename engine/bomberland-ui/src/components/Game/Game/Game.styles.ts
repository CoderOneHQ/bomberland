import styled from "styled-components";

export const Grid = styled.div`
    display: grid;
    width: 100%;
    height: 100%;
    grid-template-columns: max-content max-content;
    grid-column-gap: 32px;
`;

export const GridItem = styled.div`
    display: flex;
    flex-direction: column;
`;

export const ErrorMessageContainer = styled.div`
    max-width: 640px;
`;

export const LoadingContainer = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    -moz-transform: translateX(-50%) translateY(-50%);
    -webkit-transform: translateX(-50%) translateY(-50%);
    transform: translateX(-50%) translateY(-50%);
`;

export const LoadingMessage = styled.div`
    margin-top: 128px;
`;
