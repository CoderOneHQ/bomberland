import * as React from "react";
import { Entity } from "./Entity/Entity";
import { IEntity } from "@coderone/bomberland-library";

interface IProps {
    readonly entities: Array<IEntity>;
    readonly onBombDetonated?: (coordinates: [number, number]) => void;
    readonly width: number;
    readonly height: number;
}

export const Entities: React.FC<IProps> = ({ entities, onBombDetonated, width, height }) => {
    return (
        <>
            {entities.map((entity) => {
                const { type, x, y, agent_id } = entity;

                return (
                    <Entity
                        key={`${x},${y}`}
                        type={type}
                        x={x}
                        y={y}
                        width={width}
                        height={height}
                        agent_id={agent_id}
                        onBombDetonated={onBombDetonated}
                        expires={entity.expires}
                    />
                );
            })}
        </>
    );
};
