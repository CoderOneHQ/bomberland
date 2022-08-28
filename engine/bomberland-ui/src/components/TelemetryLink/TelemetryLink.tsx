import * as React from "react";
import { useCallback, useState } from "react";
import { telemetry } from "../../utilities/Telemetry/Telemetry";
import { TelemetryEvent } from "../../utilities/Telemetry/TelemetryEvent";
import styled, { StyledComponent } from "styled-components";
import { ExternalLinkIcon } from "../Icons/ExternalLink";
import { StyledLink } from "./TelemetryLink.styles";

interface IProps {
    readonly href: string;
    readonly target?: "_blank" | "_self" | "_parent" | "_top" | "framename";
    readonly styledOverride?: StyledComponent<"a", any, {}, never>;
}

export const TelemetryLink: React.FC<React.PropsWithChildren<IProps>> = ({ href, children, target = "_self", styledOverride }) => {
    const shouldShowIcon = target === "_blank";
    const LinkComponent = styledOverride ?? StyledLink;
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
        <LinkComponent onClick={onClick} href={href} target={target}>
            <>
                {children} {shouldShowIcon && <ExternalLinkIcon />}
            </>
        </LinkComponent>
    );
};
