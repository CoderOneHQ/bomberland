import React from "react";
import { useTranslation } from "react-i18next";
import {
    Breadcrumb,
    Section,
    Header,
    H1,
    ContentsHeading,
    ContentRoot,
    StickyContainer,
    PageContainer,
} from "../../page-styles/markdown.styles";
import { RouterLink } from "../RouterLink/RouterLink";
import { TableOfContents } from "../TableOfContents/TableOfContents";
import { DocumentationOrderedNavigation } from "../DocumentationOrderedNavigation/DocumentationOrderedNavigation";
import { BomberlandRoute } from "../../utilities/BomberlandRoute";

interface IProps {
    readonly title: string;
    readonly order: number;
    readonly html: string;
    readonly tableOfContents: string;
}

export const DocumentationPageContent: React.FC<React.PropsWithChildren<IProps>> = ({ title, order, html, tableOfContents }) => {
    const [t] = useTranslation();
    return (
        <PageContainer>
            <div></div>
            <ContentRoot>
                <Header>
                    <Breadcrumb>
                        <RouterLink href={BomberlandRoute.DocumentationIndex}>{t("allDocs")}</RouterLink> / {title}
                    </Breadcrumb>
                    <DocumentationOrderedNavigation currentPageOrder={order} />
                    <H1>{title}</H1>
                </Header>
                <Section className="markdown-body" dangerouslySetInnerHTML={{ __html: html }} />
                <DocumentationOrderedNavigation currentPageOrder={order} />
            </ContentRoot>
            <StickyContainer>
                <ContentsHeading>{t("contents")}</ContentsHeading>
                <TableOfContents dangerouslySetInnerHTML={{ __html: tableOfContents }} />
            </StickyContainer>
        </PageContainer>
    );
};
