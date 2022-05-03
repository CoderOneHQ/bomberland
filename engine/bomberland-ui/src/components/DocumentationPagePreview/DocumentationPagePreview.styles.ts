import styled from "styled-components";
import { Palette } from "../../theme/Palette";

export const Root = styled.div`
    font-size: 16px;
    line-height: 1.25;
    color: ${Palette.Neutral100};
    padding-bottom: 16px;
`;

export const ExcerptWrapper = styled.p`
    padding-bottom: 16px;
    color: ${Palette.Neutral60};
`;
