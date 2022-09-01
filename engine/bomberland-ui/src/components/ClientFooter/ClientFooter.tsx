import * as React from "react";
import CoderOneLogo from "./coder-one-logo.svg";
import { TelemetryLink } from "../TelemetryLink/TelemetryLink";
import { Constants } from "../../utilities/Constants";
import styled from "styled-components";
import { Palette } from "../../theme/Palette";
import ReportBugIcon from "./bug_report.svg";
import { useTranslation } from "react-i18next";

const Root = styled.div`
    display: flex;
    flex-direction: column;
    padding-top: 32px;
    margin: 0 auto;
    text-align: center;
    align-items: center;
    font-size: 14px;
`;

const LinkStyledOverride = styled.a`
    display: flex;
    gap: 4px;
    justify-content: center;
    color: ${Palette.Neutral50};
    transition: background-color 100ms ease;
    line-height: 16px;
    padding: 4px 8px;
    text-decoration: none;
    border-radius: 4px;
    background-color: ${Palette.Neutral10};

    :hover {
        background-color: ${Palette.Neutral20};
    }
`;

export const ClientFooter: React.FC<React.PropsWithChildren<unknown>> = () => {
    const [t] = useTranslation();
    return (
        <Root>
            <TelemetryLink href={Constants.Home}>
                <img src={CoderOneLogo} alt="Coder One logo" />
            </TelemetryLink>
            <TelemetryLink href={Constants.ReportBugIssuesLink} styledOverride={LinkStyledOverride} target="_blank">
                <img src={ReportBugIcon} alt="Report an issue icon" />
                Report an issue
            </TelemetryLink>
        </Root>
    );
};
