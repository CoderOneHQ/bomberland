import { AbstractEntity, IInitialEntityValues } from "./AbstractEntity";
import { EntityType } from "@coderone/bomberland-library";
import { Telemetry } from "../../Services/Telemetry";
import { CoderOneApi } from "../../Services/CoderOneApi/CoderOneApi";
import { Environment } from "../../Environment";
import { IConfig } from "../../Config/IConfig";

export class FreezePowerupEntity extends AbstractEntity {
    public constructor(config: IConfig, cellNumber: number, mapWidth: number, currentTick: number) {
        const engineTelemetry = new CoderOneApi(Environment.Environment, config, true, Environment.Build);
        const telemetry = new Telemetry(engineTelemetry, config.IsTelemetryEnabled);
        const initialValues: IInitialEntityValues = {
            cellNumber,
            mapWidth,
            type: EntityType.FreezePowerup,
            created: currentTick,
            hp: 1,
            unitId: undefined,
            agentId: undefined,
            expires: currentTick + config.BlastPowerupDurationTicks,
            blastDiameter: undefined,
        };
        super(telemetry, initialValues);
    }
}
