import * as React from "react";
import { IconButton, Label, Root, Body } from "./CopyToClipboardField.styles";
import { TextInput } from "../TextInput/TextInput";
import CopyPasteIcon from "./copy_paste.svg";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

interface IProps {
    readonly value: string | undefined;
    readonly label?: string;
    readonly readOnly?: boolean;
    readonly placeholder?: string;
}

export const CopyToClipboardField: React.FC<React.PropsWithChildren<IProps>> = ({ value, label, readOnly = true, placeholder }) => {
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
                    <img src={CopyPasteIcon} alt="Copy paste icon" />
                </IconButton>
            </Body>
        </Root>
    );
};
