import styled from "styled-components";
import { Palette } from "../../theme/Palette";

export const StyledLink = styled.a`
    color: ${Palette.Primary100};
    cursor: pointer;
    text-decoration: none;
    display: inline;
    font-weight: 700;

    :hover {
        color: ${Palette.Primary110};
    }
`;
