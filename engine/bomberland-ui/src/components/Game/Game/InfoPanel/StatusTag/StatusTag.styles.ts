import styled from "styled-components";
import { Palette } from "../../../../../theme/Palette";

const TagRoot = styled.span`
    border: 1px solid;
    border-radius: 2px;
    padding: 4px 8px;
    display: inline-block;
`;

export const PendingStatusTag = styled(TagRoot)`
    border-color: ${Palette.Error100};
    color: ${Palette.Error100};
    background-color: ${Palette.Error10};
`;

export const RunningStatusTag = styled(TagRoot)`
    border-color: ${Palette.Success100};
    color: ${Palette.Success100};
    background-color: ${Palette.Success10};
`;

export const EndedStatusTag = styled(TagRoot)`
    border-color: ${Palette.Primary100};
    color: ${Palette.Primary100};
    background-color: ${Palette.Primary10};
`;
