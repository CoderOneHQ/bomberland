import { graphql, useStaticQuery } from "gatsby";
import * as React from "react";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { telemetry } from "../../utilities/Telemetry/Telemetry";
import { TelemetryEvent } from "../../utilities/Telemetry/TelemetryEvent";

interface IProps {
    readonly title?: string;
    readonly description: string;
}

const maxOgTitleLength = 60;
const ellipsis = "...";

export const SEO: React.FC<IProps> = ({ title, description }) => {
    const helmetTitle = title === undefined ? "Coder One" : `${title} | Coder One`;
    const ogTitle =
        helmetTitle.length > maxOgTitleLength ? `${helmetTitle.substring(0, maxOgTitleLength - ellipsis.length)}${ellipsis}` : helmetTitle;
    if (typeof window !== "undefined") {
        useEffect(() => {
            telemetry.Log(TelemetryEvent.PageView, window?.location.href);
        }, [window?.location.href]);
    }
    return (
        <Helmet
            title={helmetTitle}
            defer={false}
            htmlAttributes={{
                lang: "en",
            }}
        >
            <base href="/" />
            <meta name="charset" content="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta http-equiv="X-UA-Compatible" content="ie=edge" />
            <meta http-equiv="Cache-control" content="no-cache, no-store, must-revalidate" />
            <meta http-equiv="Pragma" content="no-cache" />
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
            <link rel="manifest" href="/site.webmanifest" />
            <meta name="msapplication-TileColor" content="#da532c" />
            <meta name="theme-color" content="#ffffff" />
            <meta name="description" content={description} />
            <meta property="og:title" content={ogTitle} />
            <meta property="og:description" content={description} />
            <meta name="twitter:card" property="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" property="twitter:title" content={ogTitle} />
            <meta name="twitter:description" property="twitter:description" content={description} />
        </Helmet>
    );
};
