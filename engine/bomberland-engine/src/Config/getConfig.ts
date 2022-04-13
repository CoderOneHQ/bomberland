import { CoderOneApi } from "../Services/CoderOneApi/CoderOneApi";
import { Telemetry } from "../Services/Telemetry";
import { validatePacket } from "../validatePacket";
import { IHashMapObject } from "../ValidationTypes";
import { IConfig } from "./IConfig";

const getFlagFromEnv = (shouldLog: boolean, key: string, fallback: boolean): boolean => {
    const value = process.env[key] !== undefined ? process.env[key] === "1" : fallback;
    if (shouldLog) {
        console.log(`${key}=${value ? 1 : 0} (default: ${fallback ? 1 : 0})`);
    }
    return value;
};
const getOptionalIntFromEnv = (shouldLog: boolean, key: string): number | null => {
    const raw = process.env[key];
    const value = raw !== undefined ? parseInt(raw) : null;
    if (shouldLog) {
        console.log(`${key}=${value} (default: null)`);
    }
    return value;
};
const getIntFromEnv = (shouldLog: boolean, key: string, fallback: number, isFallbackRandom: boolean = false): number => {
    const raw = process.env[key];
    const value = raw !== undefined ? parseInt(raw) : fallback;
    if (shouldLog) {
        console.log(`${key}=${value} (default: ${isFallbackRandom ? "Random" : fallback})`);
    }
    return value;
};
const getFloatFromEnv = (shouldLog: boolean, key: string, fallback: number): number => {
    const raw = process.env[key];
    const value = raw !== undefined ? parseFloat(raw) : fallback;
    if (shouldLog) {
        console.log(`${key}=${value} (default: ${fallback})`);
    }
    return value;
};

const parse = (rawString: string): IHashMapObject | undefined => {
    const engineTelemetry = new CoderOneApi("", getConfig(), false, "");
    try {
        const json = JSON.parse(rawString);
        if (validatePacket(new Telemetry(engineTelemetry, true), json, "#/definitions/IHashMapObject")) {
            return json;
        } else {
            return undefined;
        }
    } catch (e) {
        return undefined;
    }
};

const getSecretMapFromEnv = (shouldLog: boolean, key: string, fallback: IHashMapObject) => {
    const raw = process.env[key];
    const value = raw !== undefined ? parse(raw) ?? fallback : fallback;
    const map = new Map<string, string>();
    Object.keys(value).forEach((k) => {
        map.set(k, value[k]);
    });
    if (shouldLog) {
        console.log(`${key}=${value} (default: ${JSON.stringify(fallback)})`);
    }
    return map;
};

export const getConfig = (override?: Partial<IConfig>, shouldLogEnv: boolean = false): IConfig => {
    return {
        AdminRoleEnabled: getFlagFromEnv(shouldLogEnv, "ADMIN_ROLE_ENABLED", true),
        AgentSecretIdMap: getSecretMapFromEnv(shouldLogEnv, "AGENT_SECRET_ID_MAP", { agentA: "a", agentB: "b" }),
        AmmoDurationTicks: getIntFromEnv(shouldLogEnv, "AMMO_DURATION_TICKS", 40),
        AmmoSpawnWeighting: getFloatFromEnv(shouldLogEnv, "AMMO_SPAWN_WEIGHTING", 0.9),
        BlastDurationTicks: getIntFromEnv(shouldLogEnv, "BLAST_DURATION_TICKS", 10),
        BlastPowerupDurationTicks: getIntFromEnv(shouldLogEnv, "BLAST_POWERUP_DURATION_TICKS", 40),
        BlastPowerupSpawnWeighting: getFloatFromEnv(shouldLogEnv, "BLAST_POWERUP_SPAWN_WEIGHTING", 0.1),
        BombArmedTicks: getIntFromEnv(shouldLogEnv, "BOMB_ARMED_TICKS", 5),
        BombDurationTicks: getIntFromEnv(shouldLogEnv, "BOMB_DURATION_TICKS", 40),
        EntitySpawnProbabilityPerTick: getFloatFromEnv(shouldLogEnv, "ENTITY_SPAWN_PROBABILITY_PER_TICK", 0.025),
        FireSpawnIntervalTicks: getFloatFromEnv(shouldLogEnv, "FIRE_SPAWN_INTERVAL_TICKS", 2),
        GameDurationTicks: getIntFromEnv(shouldLogEnv, "GAME_DURATION_TICKS", 300),
        GameStartDelayMs: getIntFromEnv(shouldLogEnv, "GAME_START_DELAY_MS", 2000),
        HookAuthToken: process.env.HOOK_AUTH_TOKEN,
        InitialAmmunition: getIntFromEnv(shouldLogEnv, "INITIAL_AMMUNITION", 3),
        InitialBlastDiameter: getIntFromEnv(shouldLogEnv, "INITIAL_BLAST_DIAMETER", 3),
        InitialHP: getIntFromEnv(shouldLogEnv, "INITIAL_HP", 3),
        InvunerabilityTicks: getIntFromEnv(shouldLogEnv, "INVULNERABILITY_TICKS", 5),
        IsSymmetricalMapEnabled: getFlagFromEnv(shouldLogEnv, "SYMMETRICAL_MAP_ENABLED", true),
        IsTelemetryEnabled: getFlagFromEnv(shouldLogEnv, "TELEMETRY_ENABLED", true),
        IsTrainingModeEnabled: getFlagFromEnv(shouldLogEnv, "TRAINING_MODE_ENABLED", false),
        MapHeight: getIntFromEnv(shouldLogEnv, "MAP_HEIGHT", 15),
        MapWidth: getIntFromEnv(shouldLogEnv, "MAP_WIDTH", 15),
        OreBlockFrequency: getFloatFromEnv(shouldLogEnv, "ORE_BLOCK_FREQUENCY", 0.0617283950617284),
        Port: getFloatFromEnv(shouldLogEnv, "PORT", 3000),
        PrngSeed: getIntFromEnv(shouldLogEnv, "PRNG_SEED", Math.floor(Math.random() * Math.pow(10, 6)), true),
        ReplayWebhook: process.env.REPLAY_WEBHOOK,
        SaveReplayEnabled: getFlagFromEnv(shouldLogEnv, "SAVE_REPLAY_ENABLED", true),
        ShutdownOnGameEndEnabled: getFlagFromEnv(shouldLogEnv, "SHUTDOWN_ON_GAME_END_ENABLED", false),
        SteelBlockFrequency: getFloatFromEnv(shouldLogEnv, "STEEL_BLOCK_FREQUENCY", 0.2222222222222222),
        TickrateHz: getIntFromEnv(shouldLogEnv, "TICK_RATE_HZ", 10),
        TotalAgents: getIntFromEnv(shouldLogEnv, "TOTAL_AGENTS", 2),
        TournamentAgentConnectionGracePeriodMs: getOptionalIntFromEnv(shouldLogEnv, "TOURNAMENT_AGENT_CONNECTION_GRACE_PERIOD_MS"),
        UnitsPerAgent: getIntFromEnv(shouldLogEnv, "UNITS_PER_AGENT", 3),
        WoodBlockFrequency: getFloatFromEnv(shouldLogEnv, "WOOD_BLOCK_FREQUENCY", 0.2469135802469136),
        WorldSeed: getIntFromEnv(shouldLogEnv, "WORLD_SEED", Math.floor(Math.random() * Math.pow(10, 6)), true),
        ...override,
    };
};
