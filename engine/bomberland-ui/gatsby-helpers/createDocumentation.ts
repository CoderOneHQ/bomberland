const path = require(`path`);

export const createDocumentation = async ({ graphql, actions }) => {
    const { createPage } = actions;
    const template = path.resolve(`src/templates/documentation.template.tsx`);

    const result = await graphql(`
        query {
            allMarkdownRemark(
                sort: { order: ASC, fields: [frontmatter___order] }
                filter: { fileAbsolutePath: { regex: "/(src/source-filesystem/docs)/" } }
            ) {
                edges {
                    node {
                        id
                        frontmatter {
                            slug
                        }
                    }
                }
            }
        }
    `);

    result.data.allMarkdownRemark.edges.forEach((edge) => {
        createPage({
            path: `${edge.node.frontmatter.slug}`,
            component: template,
            context: {
                id: edge.node.id,
            },
        });
    });
};
