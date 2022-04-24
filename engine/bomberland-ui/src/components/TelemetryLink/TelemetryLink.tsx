import * as React from "react";
import { useCallback, useState } from "react";
import { telemetry } from "../../utilities/Telemetry/Telemetry";
import { TelemetryEvent } from "../../utilities/Telemetry/TelemetryEvent";
import styled, { StyledComponent } from "styled-components";
import { Palette } from "../../theme/Palette";
import { ExternalLinkIcon } from "../Icons/ExternalLink";

interface IProps {
    readonly href: string;
    readonly target?: "_blank" | "_self" | "_parent" | "_top" | "framename";
    readonly styledOverride?: StyledComponent<"a", any, {}, never>;
}

export const TelemetryLink: React.FC<IProps> = ({ href, children, target = "_self", styledOverride }) => {
    const shouldShowIcon = target === "_blank";
    const StyledLink = React.useMemo(() => {
        return (
            styledOverride ??
            styled.a`
                color: ${Palette.Primary100};
                cursor: pointer;
                text-decoration: none;
                display: inline;
                font-weight: 700;

                :hover {
                    color: ${Palette.Primary110};
                }
            `
        );
    }, [styledOverride]);
    const [hasLoggedTelemetry, setHasLoggedTelemetry] = useState(false);
    const onClick = useCallback(
        async (ev: React.MouseEvent) => {
            if (target !== "_blank" && hasLoggedTelemetry === false) {
                await telemetry.Log(TelemetryEvent.ExternalLinkClicked, href);
                ev.stopPropagation();
                setHasLoggedTelemetry(true);
                ev.target.dispatchEvent(new MouseEvent("click"));
            } else if (target === "_blank") {
                telemetry.Log(TelemetryEvent.ExternalLinkClicked, href);
            }
        },
        [href, target, hasLoggedTelemetry, setHasLoggedTelemetry]
    );
    return (
        <StyledLink onClick={onClick} href={href} target={target}>
            <>
                {children} {shouldShowIcon && <ExternalLinkIcon />}
            </>
        </StyledLink>
    );
};
