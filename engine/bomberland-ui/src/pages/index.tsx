import * as React from "react";
import { RouterLink } from "../components/RouterLink/RouterLink";
import { useBuild } from "../hooks/engine-api/useBuild";
import { BomberlandRoute } from "../utilities/BomberlandRoute";

const IndexPage: React.FC<React.PropsWithChildren<unknown>> = () => {
    const buildData = useBuild();
    return (
        <>
            <h1>Bomberland</h1>
            <ul>
                <li>
                    <RouterLink href={BomberlandRoute.DocumentationIndex}>Docs</RouterLink>
                </li>
                <li>
                    <RouterLink href={BomberlandRoute.Game}>Game client</RouterLink>
                </li>
            </ul>
            <h2>Engine build version</h2>
            <span>{buildData.data?.build}</span>
        </>
    );
};

export default IndexPage;
