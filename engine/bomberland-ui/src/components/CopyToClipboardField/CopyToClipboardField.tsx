import * as React from "react";
import { IconButton, Label, Root, Body } from "./CopyToClipboardField.styles";
import { TextInput } from "../TextInput/TextInput";
import { Icon } from "@fluentui/react/lib/Icon";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

const CopyIcon = () => <Icon iconName="Copy" />;

interface IProps {
    readonly value: string | undefined;
    readonly label?: string;
    readonly readOnly?: boolean;
    readonly placeholder?: string;
}

export const CopyToClipboardField: React.FC<IProps> = ({ value, label, readOnly = true, placeholder }) => {
    const [t] = useTranslation();
    const copyToClipboard = useCallback(async () => {
        await navigator.clipboard.writeText(value ?? "");
    }, [value]);

    return (
        <Root>
            {label !== undefined && <Label>{label}</Label>}
            <Body>
                <TextInput type="text" value={value} readOnly={readOnly} placeholder={placeholder} />
                <IconButton onClick={copyToClipboard} aria-label={t("copyToClipboard")}>
                    <CopyIcon />
                </IconButton>
            </Body>
        </Root>
    );
};
