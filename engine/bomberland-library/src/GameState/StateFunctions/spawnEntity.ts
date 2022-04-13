import { IEntity } from "../..";

export const spawnEntity = (entity: IEntity, entities: Array<IEntity>): Array<IEntity> => {
    entities.push(entity);
    return entities;
};
