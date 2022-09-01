import * as React from "react";
import { useCallback } from "react";
import { Icon } from "@fluentui/react/lib/Icon";
import { useTranslation } from "react-i18next";
import { UploaderContainer, FormField, TextBox, IconWrapper } from "./FileUploader.style";

interface IProps {
    readonly onFileLoaded: (value: string | undefined) => void;
}

export const FileUploader: React.FC<React.PropsWithChildren<IProps>> = ({ onFileLoaded }) => {
    const [t] = useTranslation();

    const onChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const uploadedFiles = e.target.files;
            if (uploadedFiles !== null && uploadedFiles.length === 1) {
                const file = uploadedFiles[0];
                const reader = new FileReader();

                reader.readAsText(file);

                reader.onload = () => {
                    onFileLoaded(reader.result as string | undefined);
                };

                reader.onerror = () => {
                    console.error(reader.error);
                };
            }
        },
        [onFileLoaded]
    );

    return (
        <UploaderContainer>
            <IconWrapper>
                <Icon iconName="CloudUpload" />
            </IconWrapper>
            <TextBox>{t("selectOrDragAndDropAReplay")}</TextBox>
            <FormField type="file" onChange={onChange} />
        </UploaderContainer>
    );
};
