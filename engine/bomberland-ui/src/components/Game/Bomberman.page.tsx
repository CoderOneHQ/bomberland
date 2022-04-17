import * as React from "react";
import { AuthenticatedFrame } from "../../../AuthenticatedFrame/AuthenticatedFrame";
import { Game } from "./Game/Game";
import { SEO } from "../../../SEO/SEO";
import { Setup } from "./Setup";
import { useTranslation } from "react-i18next";
import { WithAuth } from "../../../Auth/WithAuth";

const Bomberman: React.FC = () => {
    const urlParams = new URLSearchParams(window?.location.search);
    const connectionString = urlParams.get("uri");
    const [t] = useTranslation();
    const description = t("gameClient");
    const title = t("gameClient");
    return (
        <WithAuth>
            <AuthenticatedFrame title={t("gameClient")}>
                <SEO description={description} title={title} />
                {connectionString !== null ? <Game connectionString={connectionString} /> : <Setup />}
            </AuthenticatedFrame>
        </WithAuth>
    );
};

export default Bomberman;
