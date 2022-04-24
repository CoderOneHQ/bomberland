import * as React from "react";
import styled from "styled-components";

interface IProps {
    readonly color?: string;
    readonly fontSize?: string;
}

const Root = styled.span`
    vertical-align: middle;
    display: inline-block;
`;

export const RoundCheckIcon: React.FC<IProps> = ({ color = "currentColor", fontSize = "1em" }) => {
    return (
        <Root>
            <svg fill={color} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={fontSize} height={fontSize}>
                <path d="M12,2C6.477,2,2,6.477,2,12c0,5.523,4.477,10,10,10s10-4.477,10-10C22,6.477,17.523,2,12,2z M10,17.414l-4.707-4.707 l1.414-1.414L10,14.586l7.293-7.293l1.414,1.414L10,17.414z" />
            </svg>
        </Root>
    );
};
