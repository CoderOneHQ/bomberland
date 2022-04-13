import { IEntity } from "../../Types/Game.types";
import { IEntityStateEvent } from "../../Types";

export const updateEntityState = (entityStateEvent: IEntityStateEvent, entitites: Array<IEntity>): Array<IEntity> => {
    return entitites.map((entity) => {
        const [x, y] = entityStateEvent.coordinates;
        const updatedEntity = entityStateEvent.updated_entity;
        if (entity.x === x && entity.y === y) {
            return updatedEntity;
        }
        return entity;
    });
};
