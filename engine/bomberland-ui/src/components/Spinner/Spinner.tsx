import * as React from "react";
import { AnimatedSpinner, Root, Text } from "./Spinner.styles";

interface IProps {
    readonly label?: string;
    readonly color?: string;
    readonly fontSize?: string;
}

export const Spinner: React.FC<React.PropsWithChildren<IProps>> = ({ label, color, fontSize }) => {
    return (
        <Root>
            <AnimatedSpinner color={color} fontSize={fontSize} />
            {label !== undefined && <Text>{label}</Text>}
        </Root>
    );
};
