import * as React from "react";
import { Units } from "./Units/Units";
import { Board } from "./Board";
import { Entities } from "./Entities";
import { IEndGameState, IGameState } from "@coderone/bomberland-library";
import { MapContainer } from "./GameMap.styles";

interface IProps {
    readonly state: Omit<IGameState, "connection"> | undefined;
    readonly connection: IGameState["connection"] | undefined;
    readonly onBombDetonated?: (coordinates: [number, number]) => void;
    readonly endGameState?: IEndGameState;
    readonly selectedUnitId: string | undefined;
    readonly setSelectedUnitId: (unitId: string | undefined) => void;
}

const vwOffset = 750; // taken up by navbar + panels
const vhOffset = 136; // padding

export const GameMap: React.FC<React.PropsWithChildren<IProps>> = ({ connection, state, onBombDetonated, selectedUnitId, setSelectedUnitId }) => {
    if (state === undefined) {
        return null;
    }
    const width = state.world.width;
    const height = state.world.height;
    // max screen px taken up by the world
    const maxWidthPx = Math.max(document.documentElement.clientWidth, window.innerWidth) - vwOffset;
    const maxHeightPx = Math.max(document.documentElement.clientHeight, window.innerHeight) - vhOffset;
    // restrict to square
    const maxDimensionPx = Math.min(maxHeightPx, maxWidthPx);

    const currentAgent = connection?.agent_id || "";
    const selectableUnits = state.agents[currentAgent]?.unit_ids ?? [];

    return (
        <>
            <MapContainer maxWidth={maxDimensionPx} maxHeight={maxDimensionPx}>
                <Board width={width} height={height} />
                <Entities entities={state.entities} onBombDetonated={onBombDetonated} width={width} height={height} />
                <Units
                    setSelectedUnitId={setSelectedUnitId}
                    selectedUnitId={selectedUnitId}
                    unitState={state.unit_state}
                    currentTick={state.tick}
                    selectableUnits={selectableUnits}
                    width={width}
                    height={height}
                />
            </MapContainer>
        </>
    );
};
