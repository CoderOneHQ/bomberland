import styled from "styled-components";
import { Palette } from "../../theme/Palette";

export const TableOfContents = styled.div`
    line-height: 1.6;
    padding-bottom: 16px;

    & a {
        color: ${Palette.Primary100};
        text-decoration: none;

        :hover {
            color: ${Palette.Primary110};
        }
    }

    & ul {
        list-style: none;
        padding-left: 0px;
    }

    & ul ul {
        padding-left: 1em;
    }
`;
