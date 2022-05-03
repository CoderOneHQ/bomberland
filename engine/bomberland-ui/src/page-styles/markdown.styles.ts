import styled from "styled-components";
import { Palette } from "../theme/Palette";
import { Viewport } from "../utilities/Viewport";
require("prismjs/themes/prism.css");

export const Root = styled.div`
    max-width: 100%;
    padding-bottom: 64px;
    box-sizing: border-box;
    background-color: ${Palette.Neutral0};
    padding-left: 8px;
    padding-right: 8px;
`;

export const Wrapper = styled.div`
    @media screen and (max-width: ${Viewport.Large}px) {
        max-width: 800px;
    }

    max-width: 950px;
    margin: 0px auto;
    padding-top: 64px;
`;

export const ContentRoot = styled.div`
    max-width: 750px;
    padding-top: 64px;

    @media screen and (max-width: ${Viewport.Large}px) {
        margin: 0px auto;
        max-width: 100%;
    }
`;

export const Section = styled.section`
    font-size: 16px;
    line-height: 1.4;
    color: ${Palette.Neutral90};

    &.markdown-body strong {
        font-weight: 700;
        color: inherit;
    }

    &.markdown-body em {
        font-style: italic;
    }

    &.markdown-body a {
        color: ${Palette.Primary100};
        text-decoration: underline;
        font-weight: 500;

        :hover {
            color: ${Palette.Primary110};
        }
    }

    &.markdown-body h1,
    &.markdown-body h2,
    &.markdown-body h3,
    &.markdown-body h4,
    &.markdown-body h5,
    &.markdown-body h6 {
        padding-top: 104px;
        margin-top: -88px;
        margin-bottom: 16px;
        font-weight: 700;
        line-height: 1.25;
        color: ${Palette.Neutral100};
    }

    &.markdown-body h1 {
        font-size: 32px;
        border-bottom: 1px solid ${Palette.Neutral20};
    }

    &.markdown-body h2 {
        font-size: 24px;
        border-bottom: 1px solid ${Palette.Neutral20};
    }

    &.markdown-body h3 {
        font-size: 18px;
    }

    &.markdown-body h1 a,
    &.markdown-body h2 a,
    &.markdown-body h3 a {
        color: ${Palette.Primary100};
        text-decoration: underline;
        font-weight: inherit;

        :hover {
            color: ${Palette.Primary110};
        }
    }

    &.markdown-body p {
        margin: 16px 0px;
    }

    &.markdown-body img {
        border-style: none;
        max-width: 100%;
        height: auto;
        display: block;
        margin-left: auto;
        margin-right: auto;
    }

    &.markdown-body ul {
        list-style: disc;
        padding-left: 2em;
        margin-top: 16px;
        margin-bottom: 16px;
    }

    &.markdown-body ol {
        list-style: decimal;
        padding-left: 2em;
        margin-top: 16px;
        margin-bottom: 16px;
    }

    &.markdown-body ol ol,
    &.markdown-body ul ol {
        list-style-type: lower-roman;
    }

    &.markdown-body ol ol ol,
    &.markdown-body ol ul ol,
    &.markdown-body ul ol ol,
    &.markdown-body ul ul ol {
        list-style-type: lower-alpha;
    }

    &.markdown-body blockquote {
        margin-top: 32px;
        margin-bottom: 32px;
        padding: 2px 16px;
        color: ${Palette.Neutral90};
        border-left: 0.25em solid ${Palette.Neutral90};
        background-color: ${Palette.Neutral10};
    }
    &.markdown-body code,
    &.markdown-body kbd,
    &.markdown-body pre {
        font-family: monospace, monospace;
        font-size: 1em;
    }

    &.markdown-body code,
    &.markdown-body pre {
        font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace;
        font-size: 12px;
    }
    &.markdown-body pre {
        margin-top: 0;
        margin-bottom: 0;
    }
    &.markdown-body code {
        padding: 0.2em 0.4em;
        margin: 0;
        font-size: 85%;
        background-color: rgba(27, 31, 35, 0.05);
        border-radius: 3px;
    }
    &.markdown-body pre {
        word-wrap: normal;
    }
    &.markdown-body pre > code {
        padding: 0;
        margin: 0;
        font-size: 100%;
        word-break: normal;
        white-space: pre;
        background: transparent;
        border: 0;
    }
    &.markdown-body .highlight {
        margin-bottom: 16px;
    }
    &.markdown-body .highlight pre {
        margin-bottom: 0;
        word-break: normal;
    }
    &.markdown-body .highlight pre,
    &.markdown-body pre {
        padding: 16px;
        overflow: auto;
        font-size: 85%;
        line-height: 1.45;
        background-color: #f6f8fa;
        border-radius: 3px;
    }
    &.markdown-body pre code {
        display: inline;
        max-width: auto;
        padding: 0;
        margin: 0;
        overflow: visible;
        line-height: inherit;
        word-wrap: normal;
        background-color: initial;
        border: 0;
    }
    &.markdown-body hr {
        border-top: 1px solid ${Palette.Neutral60};
        margin-top: 32px;
    }
    &.markdown-body table {
        padding: 16px 0;
        display: block;
        width: 100%;
        overflow: auto;
    }
    &.markdown-body table th {
        font-weight: 600;
        background-color: ${Palette.Neutral10};
    }
    &.markdown-body table td,
    &.markdown-body table th {
        padding: 6px 13px;
        border: 1px solid #dfe2e5;
    }
    &.markdown-body table tr {
        background-color: #fff;
        border-top: 1px solid #c6cbd1;
    }
    &.markdown-body table tr:nth-child(2n) {
        background-color: #f6f8fa;
    }
`;

export const Headline = styled.h1`
    font-size: 48px;
    font-weight: 700;
    padding-bottom: 8px;
`;

export const Header = styled.section`
    font-size: 16px;
`;

export const InformationHeader = styled.section`
    font-size: 16px;
    padding-bottom: 64px;
`;

export const Grid = styled.div`
    @media screen and (max-width: ${Viewport.Large}px) {
        display: flex;
        flex-direction: column;
    }

    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 16px;
    row-gap: 16px;
`;

export const Breadcrumb = styled.blockquote`
    padding: 16px 0;
    color: #6a737d;
    margin-top: -32px;
`;

export const Subtitle = styled.p`
    font-weight: 500;
    margin-top: 16px;
    margin-bottom: 16px;
    font-weight: 700;
    font-size: 14px;
    color: ${Palette.Neutral60};
`;

export const H1 = styled.h1`
    font-weight: 700;
    font-size: 48px;
    line-height: 1.25;

    @media screen and (max-width: ${Viewport.Large}px) {
        font-size: 36px;
    }
`;

export const ContentsHeading = styled.p`
    font-weight: 700;
    line-height: 1.25;
    color: ${Palette.Neutral90};
    font-size: 14px;
    margin-top: 16px;
    margin-bottom: 8px;
`;

export const StickyContainer = styled.div`
    position: sticky;
    overflow: auto;
    top: 128px;
    left: 0px;
    max-height: 80vh;
    padding-left: 32px;

    @media screen and (max-width: ${Viewport.Large}px) {
        display: none;
    }
`;

export const PageContainer = styled.div`
    margin: 0 auto;
    max-width: 90%;
    display: grid;
    grid-template-columns: 1fr auto 1fr;

    @media screen and (max-width: ${Viewport.Large}px) {
        display: flex;
        max-width: 100%;
        box-sizing: border-box;
    }
`;
