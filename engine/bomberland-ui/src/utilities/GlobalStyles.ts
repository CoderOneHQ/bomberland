import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";
import { Palette } from "../theme/Palette";
import { Font } from "./Font";

export const GlobalStyle = createGlobalStyle`
${reset}
html{
    height:100%; 
    position:relative;
}
body {
    font-family: ${Font.Inter};
    background: ${Palette.Neutral10};
    color: ${Palette.Neutral100};
    font-size: 14px;
    height: 100%;
    line-height: 1.4;
}
p + p {
    margin-top: 16px;
}
`;
