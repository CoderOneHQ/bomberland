import * as React from "react";
import { useCallback } from "react";
import { Input, Root, Error100, Label, PrefixAdornment, InputContainer } from "./TextInput.styles";

interface IProps {
    readonly value: string | undefined;
    readonly placeholder?: string;
    readonly onChange?: (ev: React.ChangeEvent<HTMLInputElement>, value: string) => void;
    readonly errorMessage?: string | undefined;
    readonly required?: boolean | undefined;
    readonly label?: string | undefined;
    readonly onGetErrorMessage?: (value: string) => void;
    readonly readOnly?: boolean;
    readonly type?:
        | "button"
        | "checkbox"
        | "color"
        | "date"
        | "datetime-local"
        | "email"
        | "file"
        | "hidden"
        | "image"
        | "month"
        | "number"
        | "password"
        | "radio"
        | "range"
        | "reset"
        | "search"
        | "submit"
        | "tel"
        | "text"
        | "time"
        | "url"
        | "week";
    readonly prefixAdornment?: string | undefined;
}

export const TextInput: React.FC<React.PropsWithChildren<IProps>> = ({
    onChange,
    placeholder,
    value,
    type = "text",
    label,
    required,
    errorMessage,
    readOnly,
    prefixAdornment,
}) => {
    const onInputChanged = useCallback(
        (ev: React.ChangeEvent<HTMLInputElement>) => {
            const formValue = ev.currentTarget.value;
            onChange?.(ev, formValue);
        },
        [onChange]
    );
    return (
        <Root>
            {label !== undefined && (
                <Label>
                    {label}
                    <Error100>{required ? " *" : ""}</Error100>
                </Label>
            )}

            {prefixAdornment !== undefined ? (
                <InputContainer>
                    <PrefixAdornment>{prefixAdornment}</PrefixAdornment>
                    <Input type={type} placeholder={placeholder} onChange={onInputChanged} value={value} readOnly={readOnly} />
                </InputContainer>
            ) : (
                <Input type={type} placeholder={placeholder} onChange={onInputChanged} value={value} readOnly={readOnly} />
            )}
            {errorMessage !== undefined ? <Error100>{errorMessage}</Error100> : ""}
        </Root>
    );
};
