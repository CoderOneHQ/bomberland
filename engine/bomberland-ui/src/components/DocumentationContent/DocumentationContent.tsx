import React from "react";
import { useTranslation, Trans } from "react-i18next";
import { Grid, Root, Headline, InformationHeader } from "./DocumentationContent.styles";
import { BomberlandRoute } from "../../utilities/BomberlandRoute";
import { TelemetryLink } from "../TelemetryLink/TelemetryLink";

interface IProps {
    readonly posts: JSX.Element;
}

export const DocumentationContent: React.FC<React.PropsWithChildren<IProps>> = ({ posts }) => {
    const [t] = useTranslation();

    return (
        <Root>
            <InformationHeader>
                <Headline>{t("documentation")}</Headline>
                <Trans key="documentationDescription">
                    Resources for interacting with the <TelemetryLink href={BomberlandRoute.Bomberland}>Bomberland</TelemetryLink>{" "}
                    environment.
                </Trans>
            </InformationHeader>
            <Grid>{posts}</Grid>
        </Root>
    );
};
