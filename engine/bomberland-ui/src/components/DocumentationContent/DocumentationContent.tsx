import React from "react";
import { useTranslation, Trans } from "react-i18next";
import { Grid, Root, Headline, InformationHeader } from "./DocumentationContent.styles";
import { RouterLink } from "../RouterLink/RouterLink";
import { CoderOneRoute } from "../Pages/CoderOneRoute";

interface IProps {
    readonly posts: JSX.Element;
}

export const DocumentationContent: React.FC<IProps> = ({ posts }) => {
    const [t] = useTranslation();

    return (
        <Root>
            <InformationHeader>
                <Headline>{t("documentation")}</Headline>
                <Trans key="documentationDescription">
                    Resources for interacting with the <RouterLink href={CoderOneRoute.Bomberland}>Bomberland</RouterLink> environment.
                </Trans>
            </InformationHeader>
            <Grid>{posts}</Grid>
        </Root>
    );
};
