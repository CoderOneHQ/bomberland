import * as React from "react";
import helpIcon from "../Icons/help_outline.svg";
import { Tooltip } from "../Tooltip/Tooltip";
import { RouterLink } from "../RouterLink/RouterLink";
import { Icon } from "./HelpToolTip.styles";

interface IProps {
    readonly href: string;
    readonly label?: string;
}

export const HelpTooltip: React.FC<React.PropsWithChildren<IProps>> = ({ href, label }) => {
    return (
        <Tooltip text={label}>
            <RouterLink href={href}>
                <Icon src={helpIcon} alt={label} />
            </RouterLink>
        </Tooltip>
    );
};
