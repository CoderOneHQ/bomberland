import * as React from "react";
import { RouterLink } from "../components/RouterLink/RouterLink";
import { BomberlandRoute } from "../utilities/BomberlandRoute";

const IndexPage = () => {
    return (
        <>
            <h1>Bomberland</h1>
            <RouterLink href={BomberlandRoute.DocumentationIndex}>Docs</RouterLink>
            <RouterLink href={BomberlandRoute.Game}>Game client</RouterLink>
        </>
    );
};

export default IndexPage;
