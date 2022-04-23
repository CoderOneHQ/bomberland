import * as React from "react";
import { Icon } from "@fluentui/react/lib/Icon";
import { LinkButton } from "../LinkButton/LinkButton";
import { telemetry } from "../../utilities/Telemetry/Telemetry";
import { TelemetryEvent } from "../../utilities/Telemetry/TelemetryEvent";

const DownloadIcon = () => <Icon iconName="Download" />;

interface IProps {
    readonly mediaType: string;
    readonly data: string;
    readonly fileName: string;
    readonly label: string;
}

export const DownloadFileButton: React.FC<IProps> = ({ data, fileName, mediaType, label }) => {
    const dataStr = `data:${mediaType},${data}`;
    return (
        <LinkButton href={dataStr} download={fileName}>
            {label} <DownloadIcon />
        </LinkButton>
    );
};
