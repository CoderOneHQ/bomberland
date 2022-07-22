import * as React from "react";
import { AdminPacket, IGameState, PacketType, RequestGameReset, RequestTickPacket } from "@coderone/bomberland-library";
import { StateButton } from "../../../StateButton/StateButton";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { TextInput } from "../../../TextInput/TextInput";

interface IProps {
    readonly gameState: Omit<IGameState, "connection"> | undefined;
    readonly isEnabled: boolean;
    readonly sendAdminPacket: (adminPacket: AdminPacket) => void;
}

export const AdminControls: React.FC<React.PropsWithChildren<IProps>> = ({ isEnabled, sendAdminPacket }) => {
    const [t] = useTranslation();
    const [prngSeed, setPrngSeed] = useState<string | undefined>(undefined);
    const [worldSeed, setWorldSeed] = useState<string | undefined>(undefined);
    const onTickClicked = useCallback(() => {
        const payload: RequestTickPacket = { type: PacketType.RequestTick };
        sendAdminPacket(payload);
    }, [sendAdminPacket]);

    const onResetClicked = useCallback(() => {
        const payload: RequestGameReset = {
            type: PacketType.RequestGameReset,
            ...(worldSeed !== undefined && { world_seed: parseInt(worldSeed) }),
            ...(prngSeed !== undefined && { prng_seed: parseInt(prngSeed) }),
        };
        sendAdminPacket(payload);
    }, [sendAdminPacket, worldSeed, prngSeed]);

    if (isEnabled === false) {
        return null;
    }

    const onPrngSeedChanged = useCallback(
        (_: any, value: any) => {
            setPrngSeed(value ?? undefined);
        },
        [setPrngSeed]
    );

    const onWorldSeedChanged = useCallback(
        (_: any, value: any) => {
            setWorldSeed(value ?? undefined);
        },
        [setWorldSeed]
    );
    return (
        <>
            <StateButton onClick={onTickClicked}>{t("tick")}</StateButton>
            <TextInput label="world seed" value={worldSeed} onChange={onWorldSeedChanged} type="number" />
            <TextInput label="prng seed" value={prngSeed} onChange={onPrngSeedChanged} type="number" />
            <StateButton onClick={onResetClicked}>{t("resetGame")}</StateButton>
        </>
    );
};
