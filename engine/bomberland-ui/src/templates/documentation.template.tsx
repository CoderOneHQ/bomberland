import React from "react";
import { AuthenticatedFrame } from "../components/AuthenticatedFrame/AuthenticatedFrame";
import { DocumentationPageContent } from "../components/DocumentationPageContent/DocumentationPageContent";
import { Footer } from "../components/Footer/Footer";
import { graphql } from "gatsby";
import { NavigationHeader } from "../components/NavigationHeader/NavigationHeader";
import { Root } from "../page-styles/markdown.styles";
import { SEO } from "../components/SEO/SEO";
import { WithoutAuth } from "../components/Auth/WithoutAuth";

const Template = ({ data }) => {
    const { markdownRemark } = data;
    const { frontmatter, html, tableOfContents } = markdownRemark;
    const { title, description, order } = frontmatter;
    const Fallback = (
        <AuthenticatedFrame title={title}>
            <DocumentationPageContent html={html} title={title} order={order} tableOfContents={tableOfContents} />
        </AuthenticatedFrame>
    );
    return (
        <>
            <SEO title={title} description={description} />

            <WithoutAuth fallback={Fallback}>
                <NavigationHeader />
                <Root>
                    <DocumentationPageContent html={html} title={title} order={order} tableOfContents={tableOfContents} />
                </Root>
                <Footer />
            </WithoutAuth>
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
                date(formatString: "MMMM DD, YYYY")
                slug
                title
                description
                order
            }
        }
    }
`;
