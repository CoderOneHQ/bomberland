import { AbstractEntity, IInitialEntityValues } from "./AbstractEntity";
import { EntityType } from "@coderone/bomberland-library";
import { Telemetry } from "../../Services/Telemetry";
import { CoderOneApi } from "../../Services/CoderOneApi/CoderOneApi";
import { Environment } from "../../Environment";
import { IConfig } from "../../Config/IConfig";

export class BlastEntity extends AbstractEntity {
    public constructor(
        config: IConfig,
        cellNumber: number,
        unitId: string | undefined,
        agentId: string | undefined,
        expires: number | undefined,
        currentTick: number,
        createdOverride?: number
    ) {
        const engineTelemetry = new CoderOneApi(Environment.Environment, config, true, Environment.Build);
        const telemetry = new Telemetry(engineTelemetry, config.IsTelemetryEnabled);
        const initialValues: IInitialEntityValues = {
            cellNumber,
            mapWidth: config.MapWidth,
            type: EntityType.Blast,
            created: createdOverride ?? currentTick,
            hp: undefined,
            unitId,
            agentId,
            expires,
            blastDiameter: undefined,
        };
        super(telemetry, initialValues);
    }
}
