import { createDocumentation } from "./createDocumentation";
import { GatsbyCreatePages } from "./types";

export const createPages: GatsbyCreatePages = async ({ graphql, actions }) => {
    await createDocumentation({ graphql, actions });
};
