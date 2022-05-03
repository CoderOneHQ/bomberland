import * as React from "react";
import { useTranslation } from "react-i18next";
import { Root, ExcerptWrapper } from "./DocumentationPagePreview.styles";
import { Subtitle } from "../../page-styles/markdown.styles";
import { RouterLink } from "../RouterLink/RouterLink";
import { Palette } from "../../theme/Palette";

interface IProps {
    readonly id: string;
    readonly excerpt: string;
    readonly timeToRead: number;
    readonly frontmatter: {
        readonly slug: string;
        readonly title: string;
        readonly description: string;
    };
}

export const DocumentationPagePreview: React.FC<IProps> = ({ excerpt, frontmatter, children, timeToRead }) => {
    const { title, slug } = frontmatter;
    const [t] = useTranslation();
    return (
        <Root>
            <RouterLink href={slug}>{children}</RouterLink>
            <RouterLink href={slug} fontSize="24px" color={Palette.Neutral100} hoverColor={Palette.Neutral90}>
                {title}
            </RouterLink>
            <Subtitle>{t("readingTime", { minutes: timeToRead })}</Subtitle>
            <ExcerptWrapper>{excerpt}</ExcerptWrapper>
            <RouterLink href={slug}>{t("readMore")} →</RouterLink>
        </Root>
    );
};
