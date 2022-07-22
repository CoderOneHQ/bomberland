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

export const ExternalLinkIcon: React.FC<React.PropsWithChildren<IProps>> = ({ color = "currentColor", fontSize = "1em" }) => {
    return (
        <Root>
            <svg fill={color} xmlns="http://www.w3.org/2000/svg" viewBox="0 -1 23 23" width={fontSize} height={fontSize}>
                <path d="M 5 3 C 3.9069372 3 3 3.9069372 3 5 L 3 19 C 3 20.093063 3.9069372 21 5 21 L 19 21 C 20.093063 21 21 20.093063 21 19 L 21 12 L 19 12 L 19 19 L 5 19 L 5 5 L 12 5 L 12 3 L 5 3 z M 14 3 L 14 5 L 17.585938 5 L 8.2929688 14.292969 L 9.7070312 15.707031 L 19 6.4140625 L 19 10 L 21 10 L 21 3 L 14 3 z" />
            </svg>
        </Root>
    );
};
