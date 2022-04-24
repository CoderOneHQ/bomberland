import * as React from "react";
import { ChoiceGroup, IChoiceGroupOption } from "@fluentui/react";
import { GameRole } from "@coderone/bomberland-library";
import { Root, SetupFormWrapper, HelpTooltipWrapper } from "./Setup.styles";
import { ContentCard } from "../ContentCard/ContentCard";
import { StateButton } from "../StateButton/StateButton";
import { TextInput } from "../TextInput/TextInput";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { CopyToClipboardField } from "../CopyToClipboardField/CopyToClipboardField";
import { navigate } from "gatsby";
import { HelpTooltip } from "../HelpTooltip/HelpTooltip";
import { CoderOneRoute } from "../../CoderOneRoute";

const getConnectionString = (role: GameRole, host: string, port: string, name: string, agentId: string) => {
    if (role === GameRole.Agent) {
        return `ws://${host}:${port}/?role=${role}&agentId=${agentId}&name=${name}`;
    }
    return `ws://${host}:${port}/?role=${role}`;
};

const defaultHost = "127.0.0.1";
const defaultPort = "3000";
const defaultName = "defaultName";
const defaultAgentId = "agentA";

export const Setup: React.FC = () => {
    const [t] = useTranslation();
    const [role, setRole] = useState<GameRole>(GameRole.Agent);
    const [host, setHost] = useState<string>(defaultHost);
    const [port, setPort] = useState<string>(defaultPort);
    const [name, setName] = useState<string>(defaultName);
    const [agentId, setAgentId] = useState<string>(defaultAgentId);

    const connectionString = useMemo(() => {
        return getConnectionString(role, host, port, name, agentId);
    }, [name, role, host, port, agentId]);
    const onConnectClicked = useCallback(() => {
        navigate(CoderOneRoute.GameInstanceRoute(connectionString));
    }, [connectionString, navigate]);
    const onHostChanged = useCallback(
        (_ev, newValue?: string | undefined) => {
            setHost(newValue ?? "");
        },
        [setHost]
    );

    const onPortChanged = useCallback(
        (_ev, newValue?: string | undefined) => {
            setPort(newValue ?? "");
        },
        [setPort]
    );

    const onNameChanged = useCallback(
        (_ev, newValue?: string | undefined) => {
            setName(newValue ?? "");
        },
        [setName]
    );

    const onRoleChanged = useCallback(
        (_ev, option: IChoiceGroupOption | undefined) => {
            if (option?.key !== undefined) {
                setRole(option?.key as GameRole);
            }
        },
        [setRole]
    );

    const roleOptions = useMemo(() => {
        return [
            { key: GameRole.Admin, text: t("administrator") },
            { key: GameRole.Agent, text: t("agent") },
            { key: GameRole.Spectator, text: t("spectator") },
        ];
    }, [t]);

    const isAgentIdAndNameEnabled = useMemo(() => role === GameRole.Agent, [role]);

    const onAgentIdChanged = useCallback(
        (_ev, newValue?: string | undefined) => {
            setAgentId(newValue ?? "");
        },
        [setAgentId]
    );

    return (
        <Root>
            <ContentCard>
                <SetupFormWrapper>
                    <ChoiceGroup defaultSelectedKey={role} options={roleOptions} label="Role" required={true} onChange={onRoleChanged} />
                    <TextInput placeholder={t("host")} value={host} onChange={onHostChanged} label={t("host")} required={true} />
                    <TextInput placeholder={t("port")} value={port} onChange={onPortChanged} label={t("port")} required={true} />
                    {isAgentIdAndNameEnabled && (
                        <>
                            <TextInput placeholder={t("agentId")} value={agentId} onChange={onAgentIdChanged} label={t("agentId")} />
                            <TextInput placeholder={t("name")} value={name} onChange={onNameChanged} label={t("name")} />
                        </>
                    )}
                    <CopyToClipboardField value={connectionString} label={t("connectionURL")} />
                </SetupFormWrapper>
                <StateButton onClick={onConnectClicked}>{t("connect")}</StateButton>
            </ContentCard>
        </Root>
    );
};
