import { EntityType } from "@coderone/bomberland-library";
import { IWorldState } from "../Game/Entity/World/World";

export const mock6x6GameState: IWorldState = {
    units: [
        { coordinates: [0, 1], hp: 2, inventory: { bombs: 3 }, blast_diameter: 3, unit_id: "c", agent_id: "a", invulnerability: 319 },
        { coordinates: [5, 1], hp: 3, inventory: { bombs: 3 }, blast_diameter: 3, unit_id: "d", agent_id: "b", invulnerability: 0 },
        { coordinates: [3, 3], hp: 3, inventory: { bombs: 3 }, blast_diameter: 3, unit_id: "e", agent_id: "a", invulnerability: 0 },
        { coordinates: [2, 3], hp: 3, inventory: { bombs: 3 }, blast_diameter: 3, unit_id: "f", agent_id: "b", invulnerability: 0 },
        { coordinates: [2, 4], hp: 3, inventory: { bombs: 3 }, blast_diameter: 3, unit_id: "g", agent_id: "a", invulnerability: 0 },
        { coordinates: [3, 4], hp: 3, inventory: { bombs: 3 }, blast_diameter: 3, unit_id: "h", agent_id: "b", invulnerability: 0 },
    ],
    entities: [
        { created: 0, x: 0, y: 3, type: EntityType.MetalBlock },
        { created: 0, x: 5, y: 3, type: EntityType.MetalBlock },
        { created: 0, x: 4, y: 3, type: EntityType.MetalBlock },
        { created: 0, x: 1, y: 3, type: EntityType.MetalBlock },
        { created: 0, x: 5, y: 4, type: EntityType.MetalBlock },
        { created: 0, x: 0, y: 4, type: EntityType.MetalBlock },
        { created: 0, x: 1, y: 1, type: EntityType.WoodBlock, hp: 1 },
        { created: 0, x: 4, y: 1, type: EntityType.WoodBlock, hp: 1 },
        { created: 0, x: 5, y: 5, type: EntityType.WoodBlock, hp: 1 },
        { created: 0, x: 1, y: 0, type: EntityType.WoodBlock, hp: 1 },
        { created: 0, x: 0, y: 0, type: EntityType.WoodBlock, hp: 1 },
        { created: 300, x: 12, y: 0, type: EntityType.Blast },
        { created: 302, x: 5, y: 0, type: EntityType.Blast },
        { created: 304, x: 13, y: 0, type: EntityType.Blast },
        { created: 306, x: 4, y: 0, type: EntityType.Blast },
        { created: 308, x: 14, y: 0, type: EntityType.Blast },
        { created: 310, x: 3, y: 0, type: EntityType.Blast },
        { created: 312, x: 6, y: 0, type: EntityType.Blast },
        { created: 314, x: 2, y: 0, type: EntityType.Blast },
        { created: 316, x: 4, y: 2, type: EntityType.Blast },
    ],
};
