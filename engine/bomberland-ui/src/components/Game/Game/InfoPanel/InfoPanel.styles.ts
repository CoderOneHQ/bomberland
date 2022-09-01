import styled from "styled-components";
import { Palette } from "../../../../theme/Palette";

interface ICellStyleProps {
    readonly currAgent: boolean;
    readonly selectableUnit: boolean;
}

export const GameInfoContainer = styled.div`
    display: grid;
    grid-row-gap: 16px;
    line-height: 1.2;
`;

export const Table = styled.table`
    border: 1px solid ${Palette.Neutral20};
    width: 100%;
    font-size: 14px;
    text-align: center;
    border-collapse: collapse;
`;

export const HeaderColumn = styled.th`
    background-color: ${Palette.Neutral10};
    border: 1px solid ${Palette.Neutral20};
    padding: 8px;
    font-weight: bold;
`;

export const TableCell = styled.td<ICellStyleProps>`
    width: 100%;
    background-color: ${({ currAgent }) => (currAgent ? Palette.Primary10 : Palette.Neutral0)};
    border: 1px solid ${Palette.Neutral20};
    font-weight: ${({ selectableUnit }) => (selectableUnit ? "700" : "400")};
    padding: 8px;
`;

export const Field = styled.div`
    display: inline;
`;