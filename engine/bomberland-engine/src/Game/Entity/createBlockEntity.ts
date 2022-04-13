import { AbstractEntity } from "./AbstractEntity";
import { EntityType } from "@coderone/bomberland-library";
import { MetalBlockEntity } from "./MetalBlockEntity";
import { OreBlockEntity } from "./OreBlockEntity";
import { WoodBlockEntity } from "./WoodBlockEntity";
import { IConfig } from "../../Config/IConfig";

export const createBlockEntity = (
    config: IConfig,
    cellNumber: number,
    mapWidth: number,
    type: EntityType,
    unitId: string | undefined,
    agentId: string | undefined,
    currentTick: number,
    originalCreated?: number
): AbstractEntity => {
    switch (type) {
        case EntityType.MetalBlock:
            return new MetalBlockEntity(config, cellNumber, mapWidth, unitId, agentId, currentTick, originalCreated);
        case EntityType.WoodBlock:
            return new WoodBlockEntity(config, cellNumber, mapWidth, unitId, agentId, currentTick, originalCreated);
        case EntityType.OreBlock:
            return new OreBlockEntity(config, cellNumber, mapWidth, unitId, agentId, currentTick, originalCreated);
        default:
            throw Error(`Unknown entity: ${type}`);
    }
};
