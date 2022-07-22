import * as React from "react";
import { useTranslation } from "react-i18next";
import { NavigationLinkItem } from "./NavigationLinkItem";
import styled from "styled-components";

export interface IOrderedPageNavigation {
    readonly slug: string;
    readonly title: string;
    readonly description: string;
    readonly timeToRead: number;
    readonly next: IOrderedPageNavigation | null;
    readonly previous: IOrderedPageNavigation | null;
    readonly order: number;
}

interface IProps {
    readonly pageNavigation: IOrderedPageNavigation | undefined;
}

const Root = styled.div`
    padding: 8px 0;
`;

export const OrderedNavigation: React.FC<React.PropsWithChildren<IProps>> = ({ pageNavigation }) => {
    const [t] = useTranslation();
    if (pageNavigation === undefined) {
        return null;
    } else {
        const { next, previous } = pageNavigation;
        return (
            <Root>
                <NavigationLinkItem link={previous} label={t("previous")} />
                <NavigationLinkItem link={next} label={t("next")} />
            </Root>
        );
    }
};
