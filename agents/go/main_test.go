package main

import (
	"encoding/json"
	"testing"
)

// stateWithEntities builds a minimal tick state whose entities list matches the
// current engine wire shape (bombs identified by "unit_id", type "b").
func stateWithEntities(t *testing.T, entitiesJSON string) map[string]interface{} {
	t.Helper()
	var entities []interface{}
	if err := json.Unmarshal([]byte(entitiesJSON), &entities); err != nil {
		t.Fatalf("failed to build entities: %v", err)
	}
	return map[string]interface{}{"entities": entities}
}

func TestGetBombToDetonate_FindsOwnBombByUnitID(t *testing.T) {
	// A bomb placed by unit "c" plus an opponent's bomb and a non-bomb entity.
	state := stateWithEntities(t, `[
		{"type": "w", "x": 1, "y": 1, "created": 0, "hp": 1},
		{"type": "b", "x": 5, "y": 6, "unit_id": "d", "agent_id": "b", "created": 0},
		{"type": "b", "x": 3, "y": 4, "unit_id": "c", "agent_id": "a", "created": 0}
	]`)

	x, y := getBombToDetonate("c", state)
	if x != 3 || y != 4 {
		t.Fatalf("expected bomb for unit c at (3,4), got (%v,%v)", x, y)
	}
}

func TestGetBombToDetonate_ReturnsSentinelWhenNoOwnedBomb(t *testing.T) {
	state := stateWithEntities(t, `[
		{"type": "b", "x": 5, "y": 6, "unit_id": "d", "agent_id": "b", "created": 0}
	]`)

	x, y := getBombToDetonate("c", state)
	if x != -1 || y != -1 {
		t.Fatalf("expected sentinel (-1,-1) when unit owns no bomb, got (%v,%v)", x, y)
	}
}

func TestGetBombToDetonate_FindsBombOnBoardEdge(t *testing.T) {
	// A bomb at the origin must still be detonatable (regression for the old x>0 && y>0 guard).
	state := stateWithEntities(t, `[
		{"type": "b", "x": 0, "y": 0, "unit_id": "c", "agent_id": "a", "created": 0}
	]`)

	x, y := getBombToDetonate("c", state)
	if x != 0 || y != 0 {
		t.Fatalf("expected edge bomb at (0,0), got (%v,%v)", x, y)
	}
}
