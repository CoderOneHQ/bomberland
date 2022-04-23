import * as React from "react";
import styled from "styled-components";
import { Palette } from "../../theme/Palette";
import { Icon } from "@fluentui/react/lib/Icon";

export const InfoIcon = () => <Icon iconName="Info" />;

const Root = styled.div`
    display: grid;
    grid-template-columns: 24px auto;
    align-items: center;
    margin-top: 16px;
    margin-bottom: 16px;
    padding: 16px;
    background-color: ${Palette.Primary10};
    border: solid 1px ${Palette.Primary100};
    border-radius: 4px;
`;

export const InfoBar: React.FC = ({ children }) => {
    return (
        <Root>
            <InfoIcon />
            <div>{children}</div>
        </Root>
    );
};
