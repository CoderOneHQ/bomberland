import * as React from "react";
import { Game } from "./Game/Game";
import { Setup } from "./Setup";
import { useTranslation } from "react-i18next";
import { SEO } from "../SEO/SEO";

const Bomberman: React.FC<React.PropsWithChildren<unknown>> = () => {
    const urlParams = new URLSearchParams(window?.location.search);
    const connectionString = urlParams.get("uri");
    const [t] = useTranslation();
    const description = t("gameClient");
    const title = t("gameClient");
    return (
        <>
            <SEO description={description} title={title} />
            {connectionString !== null ? <Game connectionString={connectionString} /> : <Setup />}
        </>
    );
};

export default Bomberman;
