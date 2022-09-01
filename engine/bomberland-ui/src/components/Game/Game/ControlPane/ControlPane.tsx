import * as React from "react";
import { useTranslation } from "react-i18next";
import { AdminPacket, GameRole, IEndGameState, IGameState } from "@coderone/bomberland-library";
import { useMemo } from "react";
import { Root } from "./ControlPane.styles";
import { SoundControl } from "../SoundControl/SoundControl";
import { AdminControls } from "../AdminControls/AdminControls";
import { ContentCard } from "../../../ContentCard/ContentCard";
import { H2 } from "../../../H2/H2";
import { DownloadFileButton } from "../../../DownloadFileButton/DownloadFileButton";

interface IProps {
    readonly state: Omit<IGameState, "connection"> | undefined;
    readonly connection: IGameState["connection"] | undefined;
    readonly endGameState?: IEndGameState;
    readonly selectedUnitId: string | undefined;
    readonly sendAdminPacket: (adminPacket: AdminPacket) => void;
}

export const ControlPane: React.FC<React.PropsWithChildren<IProps>> = ({ connection, state, endGameState, sendAdminPacket }) => {
    if (state === undefined) {
        return null;
    }
    const [t] = useTranslation();
    const adminControlsEnabled = connection?.role === GameRole.Admin;

    return (
        <Root>
            <ContentCard>
                <H2>{t("controls")}</H2>
                <AdminControls isEnabled={adminControlsEnabled} sendAdminPacket={sendAdminPacket} gameState={state} />
                <SoundControl />
            </ContentCard>
        </Root>
    );
};
