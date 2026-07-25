import { IEntity, EntityType } from "@coderone/bomberland-library";
import { IConfig } from "../../../../Config/IConfig";
import { GameTicker } from "../../../Game/GameTicker";
import { AbstractEntity } from "../../AbstractEntity";
import { AmmoEntity } from "../../AmmoEntity";
import { BlastEntity } from "../../BlastEntity";
import { BlastPowerupEntity } from "../../BlastPowerupEntity";
import { BombEntity } from "../../BombEntity";
import { createBlockEntity } from "../../createBlockEntity";
import { IWorldState } from "../World";
import { FreezePowerupEntity } from "../../FreezePowerupEntity";

const blockType = new Set([EntityType.MetalBlock, EntityType.OreBlock, EntityType.WoodBlock]);

export const reconstructEntity = (
    entity: IEntity,
    width: number,
    worldState: IWorldState,
    cellNumber: number,
    gameTicker: GameTicker,
    config: IConfig
): AbstractEntity => {
    const { type, unit_id, agent_id } = entity;
    const tick = gameTicker.CurrentTick;

    if (blockType.has(type)) {
        return createBlockEntity(config, cellNumber, width, type, unit_id, agent_id, tick, entity.created);
    } else if (type === EntityType.Ammo) {
        return new AmmoEntity(config, cellNumber, tick, entity.created);
    } else if (type === EntityType.FreezePowerup) {
        return new FreezePowerupEntity(config, cellNumber, width, tick, entity.created);
    } else if (type === EntityType.Blast) {
        return new BlastEntity(config, cellNumber, unit_id, agent_id, entity.expires, tick, entity.created);
    } else if (type === EntityType.BlastPowerup) {
        return new BlastPowerupEntity(config, cellNumber, width, tick, entity.created);
    } else if (type === EntityType.Bomb) {
        const unit = worldState.units.find((unit) => {
            return unit.agent_id === agent_id;
        });

        // Prefer the bomb's own serialised blast diameter (the radius it was thrown with);
        // fall back to the owning unit's current diameter only when the bomb didn't carry one.
        const blastDiameter = entity.blast_diameter ?? unit?.blast_diameter;

        if (blastDiameter !== undefined) {
            return new BombEntity(config, cellNumber, width, unit_id, agent_id, tick, blastDiameter, entity.created);
        }

        throw new Error(
            `Cannot reconstruct bomb at cell ${cellNumber}: no serialised blast_diameter and no owning unit for agent ${agent_id}`
        );
    } else {
        throw new Error(`Unhandled entity type ${type} when reconstructing entity`);
    }
};
