import { AbstractEntity, IInitialEntityValues } from "./AbstractEntity";
import { EntityType } from "@coderone/bomberland-library";
import { Telemetry } from "../../Services/Telemetry";
import { CoderOneApi } from "../../Services/CoderOneApi/CoderOneApi";
import { Environment } from "../../Environment";
import { IConfig } from "../../Config/IConfig";

export class BombEntity extends AbstractEntity {
    public get BlastDiameter(): number {
        return this.blastDiameter as number;
    }

    public constructor(
        config: IConfig,
        cellNumber: number,
        mapWidth: number,
        unitId: string | undefined,
        agentId: string | undefined,
        currentTick: number,
        blastDiameter: number,
        createdOverride?: number
    ) {
        const engineTelemetry = new CoderOneApi(Environment.Environment, config, true, Environment.Build);
        const telemetry = new Telemetry(engineTelemetry, config.IsTelemetryEnabled);
        const created = createdOverride ?? currentTick;
        const initialValues: IInitialEntityValues = {
            cellNumber,
            mapWidth,
            type: EntityType.Bomb,
            created: created,
            hp: 1,
            unitId,
            agentId,
            expires: created + config.BombDurationTicks,
            blastDiameter,
        };
        super(telemetry, initialValues);
    }
}
