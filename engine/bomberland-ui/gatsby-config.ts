import type { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
    siteMetadata: {
        title: `Bomberland Ui`,
    },
    plugins: [
        "gatsby-plugin-styled-components",
        {
            resolve: "gatsby-plugin-express",
            options: {
                output: "gatsby-express.json",
            },
        },
    ],
};

export default config;
