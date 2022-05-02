import type { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
    siteMetadata: {
        title: `Bomberland Ui`,
    },
    plugins: [
        "gatsby-plugin-styled-components",
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `markdown-pages`,
                path: `${__dirname}/src/source-filesystem/markdown-pages`,
            },
        },
    ],
};

export default config;
