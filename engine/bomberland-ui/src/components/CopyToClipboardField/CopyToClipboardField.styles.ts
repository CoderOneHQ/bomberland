import styled from "styled-components";
import { Palette } from "../../theme/Palette";

export const Root = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

export const Body = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    border-radius: 4px;
    background-color: ${Palette.Neutral20};
    position: relative;
`;

export const IconButton = styled.button`
    display: flex;
    align-items: center;
    padding: 0px 8px;
    cursor: pointer;
`;

export const Label = styled.span`
    font-weight: 600;
    margin-bottom: 4px;
`;
