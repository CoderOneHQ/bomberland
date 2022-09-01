import { Link } from "gatsby";
import * as React from "react";
import { IRouterLinkStyleProps, Root } from "./RouterLink.styles";

interface IProps extends IRouterLinkStyleProps {
    readonly "aria-label"?: string;
    readonly href?: string;
    readonly onClick?: () => void;
}
export const RouterLink: React.FC<React.PropsWithChildren<IProps>> = ({
    href,
    children,
    onClick,
    fontSize,
    hoverColor,
    color,
    textDecoration,
    "aria-label": ariaLabel,
}) => {
    const styleProps: IRouterLinkStyleProps = {
        fontSize,
        hoverColor,
        textDecoration,
        color,
    };
    if (href !== undefined) {
        return (
            <Link to={href} onClick={onClick} style={{ textDecoration: textDecoration ?? "none" }} aria-label={ariaLabel}>
                <Root {...styleProps}>{children}</Root>
            </Link>
        );
    } else {
        return (
            <Root {...styleProps} onClick={onClick} aria-label={ariaLabel}>
                {children}
            </Root>
        );
    }
};
