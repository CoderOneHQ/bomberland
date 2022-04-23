import styled from "styled-components";
import { Palette } from "../../theme/Palette";

export interface IRouterLinkStyleProps {
    readonly fontSize?: string;
    readonly color?: string;
    readonly hoverColor?: string;
    readonly textDecoration?: string;
}

export const Root = styled("span")<IRouterLinkStyleProps>`
    font-size: ${({ fontSize }) => fontSize ?? "inherit"};
    cursor: pointer;
    font-weight: 700;
    color: ${({ color }) => color ?? Palette.Primary100};
    text-decoration: ${({ textDecoration }) => textDecoration ?? "none"};

    :hover {
        color: ${({ hoverColor }) => hoverColor ?? Palette.Primary110};
    }
`;
