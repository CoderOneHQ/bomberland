import * as React from "react";
import { Unit } from "./Unit";
import { IUnitState } from "@coderone/bomberland-library";
import { useCallback } from "react";

interface IProps {
    readonly unitState: {
        [unitId: string]: IUnitState;
    };
    readonly selectedUnitId: string | undefined;
    readonly currentTick: number;
    readonly selectableUnits: Array<string>;
    readonly setSelectedUnitId: (unitId: string | undefined) => void;
    readonly width: number;
    readonly height: number;
}

export const Units: React.FC<React.PropsWithChildren<IProps>> = ({
    unitState,
    currentTick,
    selectedUnitId,
    selectableUnits,
    setSelectedUnitId,
    width,
    height,
}) => {
    const unitData = Object.values(unitState);
    const allowedUnits = new Set(selectableUnits);
    const units = unitData.map((unit) => {
        const [x, y] = unit.coordinates;
        const { unit_id, agent_id, hp } = unit;
        const isSelected = unit_id === selectedUnitId;
        const isInvulnerable = unit.invulnerable >= currentTick;
        const isDead = unit.hp <= 0;
        const isStunned = unit.stunned >= currentTick;
        const onSetUnitId = useCallback(() => {
            setSelectedUnitId(unit_id);
        }, [unit_id, setSelectedUnitId]);
        const isSelectable = allowedUnits.has(unit_id);
        const onClick = isSelectable ? onSetUnitId : undefined;

        return (
            <Unit
                hp={hp}
                onClick={onClick}
                isSelected={isSelected}
                key={unit_id}
                x={x}
                y={y}
                width={width}
                height={height}
                agentId={agent_id}
                unitId={unit_id}
                isInvulnerable={isInvulnerable}
                isDead={isDead}
                isStunned={isStunned}
            />
        );
    });
    return <>{units}</>;
};
