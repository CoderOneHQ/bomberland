import * as React from "react";
import { useTranslation } from "react-i18next";
import { RouterLink } from "../RouterLink/RouterLink";
import { IOrderedPageNavigation } from "./OrderedNavigation";
import styled from "styled-components";

interface IProps {
    readonly label: string;
    readonly link: IOrderedPageNavigation | null;
}

const Root = styled.div`
    padding: 4px 0;
`;

export const NavigationLinkItem: React.FC<React.PropsWithChildren<IProps>> = ({ link, label }) => {
    const [t] = useTranslation();
    if (link === null) {
        return null;
    }
    const { slug, title } = link;
    return (
        <Root>
            <span>{label}: </span>
            <RouterLink href={`${slug}`}>{title}</RouterLink>
        </Root>
    );
};
