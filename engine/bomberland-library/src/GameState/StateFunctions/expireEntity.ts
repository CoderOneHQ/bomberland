import { IEntity, IEntityExpiredEvent } from "../..";

export const expireEntity = (event: IEntityExpiredEvent, entities: Array<IEntity>): Array<IEntity> => {
    const [x, y] = event.data;
    return entities.filter((entity) => {
        const doCoordinatesMatch = x === entity.x && y === entity.y;
        return doCoordinatesMatch === false;
    });
};
