import styled from "styled-components";
import { Palette } from "../../theme/Palette";

export const Root = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

export const Input = styled.input`
    border-radius: 4px;
    border: 1px solid transparent;
    background-color: ${Palette.Neutral10};
    color: ${(props) => (props.readOnly ? `${Palette.Neutral50}` : `${Palette.Neutral100}`)};
    padding: 8px 8px;
    font-family: inherit;
    outline-color: ${(props) => (props.readOnly ? `${Palette.Neutral20}` : `${Palette.Primary100}`)}!important;

    :focus {
        outline: none;
        border: 1px solid ${Palette.Primary100};
        box-shadow: ${Palette.Primary10} 0px 0px 0px 3px;
    }
`;

export const Error100 = styled.span`
    color: ${Palette.Error100};
    margin-top: 8px;
`;

export const Label = styled.span`
    font-weight: 600;
    margin-bottom: 4px;
`;

export const PrefixAdornment = styled.div`
    color: ${Palette.Neutral40};
    border-radius: 4px;
    border: 1px solid ${Palette.Neutral40};
    padding: 4px 16px;
    line-height: 24px;
`;

export const InputContainer = styled.div`
    display: grid;
    grid-template-columns: min-content auto;
    grid-column-gap: 4px;
`;
