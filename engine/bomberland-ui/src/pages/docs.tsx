import React from "react";
import { graphql } from "gatsby";
import { Root } from "../page-styles/markdown.styles";
import { SEO } from "../components/SEO/SEO";
import { useTranslation } from "react-i18next";
import { DocumentationPagePreview } from "../components/DocumentationPagePreview/DocumentationPagePreview";
import { DocumentationContent } from "../components/DocumentationContent/DocumentationContent";

const Docs = ({
    data: {
        allMarkdownRemark: { edges },
    },
}) => {
    const [t] = useTranslation();
    const title = t("documentation");
    const description = t("coderoneDocumentation");

    const posts = edges.map((edge) => {
        return <DocumentationPagePreview key={edge.node.id} {...edge.node}></DocumentationPagePreview>;
    });
    return (
        <>
            <SEO title={title} description={description} />
            <Root>
                <DocumentationContent posts={posts} />
            </Root>
        </>
    );
};
export default Docs;

export const pageQuery = graphql`
    query {
        allMarkdownRemark(
            sort: { order: ASC, fields: [frontmatter___order] }
            filter: { fileAbsolutePath: { regex: "/(src/source-filesystem/docs)/" } }
        ) {
            edges {
                node {
                    id
                    timeToRead
                    frontmatter {
                        slug
                        title
                        description
                        order
                    }
                }
            }
        }
    }
`;
