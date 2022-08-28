import * as React from "react";
import { useTranslation } from "react-i18next";
import { ReplaysContent } from "./ReplaysContent";
import { SEO } from "../components/SEO/SEO";
import { SSRGuard } from "../components/SSRGuard/SSRGuard";
import { SoundContextProvider } from "../components/Game/Game/SoundContext";

export const Replays: React.FC<React.PropsWithChildren<unknown>> = () => {
    const [t] = useTranslation();
    const title = t("gameReplay");
    const description = t("gameReplay");

    return (
        <SoundContextProvider>
            <SEO description={description} title={title} />
            <SSRGuard>
                <ReplaysContent />
            </SSRGuard>
        </SoundContextProvider>
    );
};
