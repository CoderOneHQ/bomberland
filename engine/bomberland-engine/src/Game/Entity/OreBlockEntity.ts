import { AbstractEntity, IInitialEntityValues } from "./AbstractEntity";
import { EntityType } from "@coderone/game-library";
import { Telemetry } from "../../Services/Telemetry";
import { CoderOneApi } from "../../Services/CoderOneApi/CoderOneApi";
import { Environment } from "../../Environment";
import { IConfig } from "../../Config/IConfig";

const oreBlockInitialHealth = 3;

export class OreBlockEntity extends AbstractEntity {
    public constructor(
        config: IConfig,
        cellNumber: number,
        mapWidth: number,
        unitId: string | undefined,
        agentId: string | undefined,
        currentTick: number,
        createdOverride?: number
    ) {
        const engineTelemetry = new CoderOneApi(Environment.Environment, config, true, Environment.Build);
        const telemetry = new Telemetry(engineTelemetry, config.IsTelemetryEnabled);
        const initialValues: IInitialEntityValues = {
            cellNumber,
            mapWidth,
            type: EntityType.OreBlock,
            created: createdOverride ?? currentTick,
            hp: oreBlockInitialHealth,
            unitId,
            agentId,
            expires: undefined,
            blastDiameter: undefined,
        };
        super(telemetry, initialValues);
    }
}
