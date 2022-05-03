import React from "react";
import { DocumentationPageContent } from "../components/DocumentationPageContent/DocumentationPageContent";
import { graphql } from "gatsby";
import { Root } from "../page-styles/markdown.styles";
import { SEO } from "../components/SEO/SEO";

const Template = ({ data }) => {
    const { markdownRemark } = data;
    const { frontmatter, html, tableOfContents } = markdownRemark;
    const { title, description, order } = frontmatter;

    return (
        <>
            <SEO title={title} description={description} />

            <Root>
                <DocumentationPageContent html={html} title={title} order={order} tableOfContents={tableOfContents} />
            </Root>
        </>
    );
};
export default Template;

export const pageQuery = graphql`
    query ($id: String!) {
        markdownRemark(id: { eq: $id }) {
            html
            tableOfContents(absolute: true, pathToSlugField: "frontmatter.slug")
            frontmatter {
                slug
                title
                description
                order
            }
        }
    }
`;
