package bomberland

import (
	"encoding/json"
	"github.com/stretchr/testify/assert"
	"github.com/xeipuuv/gojsonschema"
	"path/filepath"
	"testing"
)

func TestJSONSchema(t *testing.T) {
	abs, err := filepath.Abs("../validation.schema.json")
	assert.NoError(t, err)
	schemaLoader := gojsonschema.NewReferenceLoader("file://" + abs)
	tests := []struct {
		name    string
		payload interface{}
	}{
		{
			name:    "MockStatePacket",
			payload: getMockStatePacket(t),
		},
		{
			name:    "MockTickSpawnPacket",
			payload: getMockTickSpawnPacket(t),
		},
		{
			name:    "MockTickUnitActionPacket",
			payload: getMockTickUnitActionPacket(t),
		},
		{
			name:    "MockTickUnitStatePacket",
			payload: getMockTickUnitStatePacket(t),
		},
	}
	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			documentLoader := gojsonschema.NewGoLoader(test.payload)
			result, err := gojsonschema.Validate(schemaLoader, documentLoader)
			assert.NoError(t, err)
			assert.True(t, result.Valid())
		})
	}
}

func TestGameState(t *testing.T) {
	tests := []struct {
		name          string
		operation     func(*GameState)
		expectedState func() interface{}
	}{
		{
			name:      "NoOp",
			operation: func(*GameState) {},
			expectedState: func() interface{} {
				return map[string]interface{}(nil)
			},
		},
		{
			name: "OnGameStatePayload",
			operation: func(gs *GameState) {
				err := gs.onData(getMockStatePacket(t))
				assert.NoError(t, err)
			},
			expectedState: func() interface{} {
				return copyObject(t, getMockState(t))
			},
		},
		{
			name: "OnGameEntitySpawnPacket",
			operation: func(gs *GameState) {
				err := gs.onData(copyObject(t, getMockStatePacket(t)).(map[string]interface{}))
				assert.NoError(t, err)
				err = gs.onData(copyObject(t, getMockTickSpawnPacket(t)).(map[string]interface{}))
				assert.NoError(t, err)
			},
			expectedState: func() interface{} {
				var newEntity interface{}
				err := json.Unmarshal([]byte(`{"created": 22, "x": 7, "y": 3, "type": "a", "expires": 62, "hp": 1}`), &newEntity)
				assert.NoError(t, err)
				expected := copyObject(t, getMockState(t)).(map[string]interface{})
				entities := expected["entities"].([]interface{})
				entities = append(entities, newEntity)
				return expected
			},
		},
		{
			name: "OnGameEntityExpiredPacket",
			operation: func(gs *GameState) {
				err := gs.onData(getMockStatePacket(t))
				assert.NoError(t, err)
				err = gs.onData(getMockTickSpawnPacket(t))
				assert.NoError(t, err)
				err = gs.onData(getMockTickExpiredPacket(t))
				assert.NoError(t, err)
			},
			expectedState: func() interface{} {
				return copyObject(t, getMockState(t))
			},
		},
		{
			name: "OnUnitStatePacket",
			operation: func(gs *GameState) {
				err := gs.onData(getMockStatePacket(t))
				assert.NoError(t, err)
				err = gs.onData(getMockTickUnitStatePacket(t))
				assert.NoError(t, err)
			},
			expectedState: func() interface{} {
				expected := copyObject(t, getMockState(t)).(map[string]interface{})
				unitState := expected["unit_state"].(map[string]interface{})
				unitState["c"] = getMockUnitStatePayload(t)
				return expected
			},
		},
		{
			name: "OnUnitMovePacket",
			operation: func(gs *GameState) {
				err := gs.onData(getMockStatePacket(t))
				assert.NoError(t, err)
				err = gs.onData(getMockTickUnitActionPacket(t))
				assert.NoError(t, err)
			},
			expectedState: func() interface{} {
				expected := copyObject(t, getMockState(t)).(map[string]interface{})
				unitState := expected["unit_state"].(map[string]interface{})
				c := unitState["c"].(map[string]interface{})
				c["coordinates"] = []interface{}{4.0, 10.0}
				return expected
			},
		},
	}
	for _, test := range tests {
		gameState := &GameState{}
		t.Run(test.name, func(t *testing.T) {
			test.operation(gameState)
			assert.Equal(t, test.expectedState(), gameState.state)
		})
	}
}

func copyObject(t *testing.T, source interface{}) interface{} {
	sourceBytes, err := json.Marshal(source)
	assert.NoError(t, err)
	var target interface{}
	err = json.Unmarshal(sourceBytes, &target)
	assert.NoError(t, err)
	return target
}

func createMockTickPacket(t *testing.T, tickNumber int, events interface{}) map[string]interface{} {
	return map[string]interface{}{
		"type": "tick",
		"payload": map[string]interface{}{
			"tick":   tickNumber,
			"events": copyObject(t, events),
		},
	}
}

func getMockState(t *testing.T) interface{} {
	var mockState interface{}
	err := json.Unmarshal([]byte(`
{"agents": {"a": {"agent_id": "a", "unit_ids": ["c", "e", "g"]}, "b": {"agent_id": "b", "unit_ids": ["d", "f", "h"]}}, "unit_state": {"c": {"coordinates": [3, 10], "hp": 3, "inventory": {"bombs": 3}, "blast_diameter": 3, "unit_id": "c", "agent_id": "a", "invulnerability": 0}, "d": {"coordinates": [11, 10], "hp": 3, "inventory": {"bombs": 3}, "blast_diameter": 3, "unit_id": "d", "agent_id": "b", "invulnerability": 0}, "e": {"coordinates": [1, 9], "hp": 3, "inventory": {"bombs": 3}, "blast_diameter": 3, "unit_id": "e", "agent_id": "a", "invulnerability": 0}, "f": {"coordinates": [13, 9], "hp": 3, "inventory": {"bombs": 3}, "blast_diameter": 3, "unit_id": "f", "agent_id": "b", "invulnerability": 0}, "g": {"coordinates": [12, 7], "hp": 3, "inventory": {"bombs": 3}, "blast_diameter": 3, "unit_id": "g", "agent_id": "a", "invulnerability": 0}, "h": {"coordinates": [2, 7], "hp": 3, "inventory": {"bombs": 3}, "blast_diameter": 3, "unit_id": "h", "agent_id": "b", "invulnerability": 0}}, "entities": [{"created": 0, "x": 11, "y": 7, "type": "m"}, {"created": 0, "x": 3, "y": 7, "type": "m"}, {"created": 0, "x": 10, "y": 11, "type": "m"}, {"created": 0, "x": 4, "y": 11, "type": "m"}, {"created": 0, "x": 11, "y": 2, "type": "m"}, {"created": 0, "x": 3, "y": 2, "type": "m"}, {"created": 0, "x": 4, "y": 8, "type": "m"}, {"created": 0, "x": 10, "y": 8, "type": "m"}, {"created": 0, "x": 14, "y": 14, "type": "m"}, {"created": 0, "x": 0, "y": 14, "type": "m"}, {"created": 0, "x": 13, "y": 13, "type": "m"}, {"created": 0, "x": 1, "y": 13, "type": "m"}, {"created": 0, "x": 14, "y": 0, "type": "m"}, {"created": 0, "x": 0, "y": 0, "type": "m"}, {"created": 0, "x": 2, "y": 3, "type": "m"}, {"created": 0, "x": 12, "y": 3, "type": "m"}, {"created": 0, "x": 3, "y": 14, "type": "m"}, {"created": 0, "x": 11, "y": 14, "type": "m"}, {"created": 0, "x": 0, "y": 1, "type": "m"}, {"created": 0, "x": 14, "y": 1, "type": "m"}, {"created": 0, "x": 5, "y": 2, "type": "m"}, 
    {"created": 0, "x": 9, "y": 2, "type": "m"}, {"created": 0, "x": 9, "y": 6, "type": "m"}, {"created": 0, "x": 5, "y": 6, "type": "m"}, {"created": 0, "x": 11, "y": 13, "type": "m"}, {"created": 0, "x": 
    3, "y": 13, "type": "m"}, {"created": 0, "x": 2, "y": 10, "type": "m"}, {"created": 0, "x": 12, "y": 10, "type": "m"}, {"created": 0, "x": 2, "y": 13, "type": "m"}, {"created": 0, "x": 12, "y": 13, "type": "m"}, {"created": 0, "x": 12, "y": 6, "type": "m"}, {"created": 0, "x": 2, "y": 6, "type": "m"}, {"created": 0, "x": 1, "y": 10, "type": "m"}, {"created": 0, "x": 13, "y": 10, "type": "m"}, {"created": 0, "x": 1, "y": 6, "type": "m"}, {"created": 0, "x": 13, "y": 6, "type": "m"}, {"created": 0, "x": 9, "y": 12, "type": "m"}, {"created": 0, "x": 5, "y": 12, "type": "m"}, {"created": 0, "x": 1, "y": 0, "type": "m"}, {"created": 0, "x": 13, "y": 0, "type": "m"}, {"created": 0, "x": 14, "y": 2, "type": "m"}, {"created": 0, "x": 0, "y": 2, "type": "m"}, {"created": 0, "x": 10, "y": 1, "type": "m"}, {"created": 0, "x": 4, "y": 1, "type": "m"}, {"created": 0, "x": 11, "y": 8, "type": "m"}, {"created": 0, "x": 3, "y": 8, "type": "m"}, {"created": 0, "x": 0, "y": 6, "type": "m"}, {"created": 0, "x": 14, "y": 6, "type": "m"}, {"created": 0, "x": 12, "y": 5, "type": "m"}, {"created": 0, "x": 2, "y": 5, "type": "m"}, {"created": 0, "x": 1, "y": 3, "type": "w", "hp": 1}, {"created": 0, "x": 13, "y": 3, "type": "w", "hp": 1}, {"created": 0, "x": 1, "y": 8, "type": "w", "hp": 1}, {"created": 0, "x": 13, "y": 8, "type": "w", "hp": 1}, {"created": 0, "x": 0, "y": 8, "type": "w", "hp": 1}, {"created": 0, "x": 14, "y": 8, "type": "w", "hp": 1}, {"created": 0, "x": 6, "y": 3, "type": "w", "hp": 1}, {"created": 0, "x": 8, "y": 3, "type": "w", "hp": 1}, {"created": 0, "x": 6, "y": 1, "type": "w", "hp": 1}, {"created": 0, "x": 8, "y": 1, "type": "w", "hp": 1}, {"created": 0, "x": 9, "y": 1, "type": "w", "hp": 1}, {"created": 0, "x": 5, "y": 1, "type": "w", "hp": 1}, {"created": 0, "x": 13, "y": 14, "type": "w", "hp": 1}, {"created": 0, "x": 1, "y": 14, "type": "w", "hp": 1}, {"created": 0, "x": 5, "y": 9, "type": "w", "hp": 1}, {"created": 0, "x": 9, "y": 9, "type": "w", "hp": 1}, {"created": 0, "x": 3, "y": 1, "type": "w", "hp": 1}, {"created": 0, "x": 11, "y": 1, "type": "w", "hp": 1}, {"created": 0, "x": 13, "y": 11, "type": "w", "hp": 1}, {"created": 0, "x": 1, "y": 11, "type": "w", "hp": 1}, {"created": 0, "x": 8, "y": 12, "type": "w", "hp": 1}, {"created": 0, "x": 6, "y": 12, "type": "w", "hp": 1}, {"created": 0, "x": 14, "y": 3, "type": "w", "hp": 1}, {"created": 0, "x": 0, "y": 3, "type": "w", 
    "hp": 1}, {"created": 0, "x": 10, "y": 13, "type": "w", "hp": 1}, {"created": 0, "x": 4, "y": 13, "type": "w", "hp": 1}, {"created": 0, "x": 14, "y": 13, "type": "w", "hp": 1}, {"created": 0, "x": 0, "y": 13, "type": "w", "hp": 1}, {"created": 0, "x": 10, "y": 14, "type": "w", "hp": 1}, {"created": 0, "x": 4, "y": 14, "type": "w", "hp": 1}, {"created": 0, "x": 5, "y": 3, "type": "w", "hp": 1}, {"created": 0, "x": 9, "y": 3, "type": "w", "hp": 1}, {"created": 0, "x": 2, "y": 11, "type": "w", "hp": 1}, {"created": 0, "x": 12, "y": 11, "type": "w", "hp": 1}, {"created": 0, "x": 10, "y": 2, "type": "w", "hp": 1}, {"created": 0, "x": 4, "y": 2, "type": "w", "hp": 1}, {"created": 0, "x": 9, "y": 0, "type": "w", "hp": 1}, {"created": 0, "x": 5, "y": 0, "type": "w", "hp": 1}, {"created": 0, "x": 1, "y": 4, "type": "w", "hp": 1}, {"created": 0, "x": 13, "y": 4, "type": "w", "hp": 1}, {"created": 0, "x": 1, "y": 2, "type": "w", "hp": 1}, {"created": 0, "x": 13, "y": 2, "type": "w", "hp": 1}, {"created": 0, "x": 8, "y": 5, "type": "w", "hp": 1}, {"created": 0, "x": 6, "y": 5, "type": "w", "hp": 1}, {"created": 0, "x": 6, "y": 2, "type": "w", "hp": 1}, {"created": 0, "x": 8, "y": 2, "type": "w", "hp": 1}, {"created": 0, "x": 0, "y": 4, "type": "w", "hp": 1}, {"created": 0, "x": 14, "y": 4, "type": "w", "hp": 1}, {"created": 0, "x": 13, "y": 1, "type": "w", "hp": 1}, {"created": 0, "x": 1, "y": 1, "type": "w", "hp": 1}, {"created": 0, "x": 5, "y": 14, "type": "w", "hp": 1}, {"created": 0, "x": 9, "y": 14, "type": "w", "hp": 1}, {"created": 0, "x": 14, "y": 11, "type": "w", "hp": 1}, {"created": 0, "x": 0, "y": 11, "type": "w", "hp": 1}, {"created": 0, "x": 5, "y": 5, "type": "w", "hp": 1}, {"created": 0, "x": 9, "y": 5, "type": "w", "hp": 1}, {"created": 0, "x": 10, "y": 4, "type": "o", "hp": 3}, {"created": 0, "x": 4, "y": 4, "type": "o", "hp": 3}, {"created": 0, "x": 9, "y": 11, "type": "o", "hp": 3}, {"created": 0, "x": 5, "y": 11, "type": "o", "hp": 3}, {"created": 0, "x": 4, "y": 12, "type": "o", "hp": 3}, {"created": 0, "x": 10, "y": 12, "type": "o", "hp": 3}, {"created": 0, "x": 2, "y": 1, "type": "o", "hp": 3}, {"created": 0, "x": 12, "y": 1, "type": "o", "hp": 3}, {"created": 0, "x": 10, "y": 6, "type": "o", "hp": 3}, {"created": 0, "x": 4, "y": 6, "type": "o", "hp": 3}, {"created": 0, "x": 11, "y": 3, "type": "o", "hp": 3}, {"created": 0, "x": 3, "y": 3, "type": "o", "hp": 3}, {"created": 0, "x": 2, "y": 4, "type": "o", "hp": 3}, {"created": 0, "x": 12, "y": 4, "type": "o", "hp": 3}], "world": {"width": 15, "height": 15}, "tick": 0, "config": {"tick_rate_hz": 10, "game_duration_ticks": 1, "fire_spawn_interval_ticks": 5}, "connection": {"id": 2, "role": "agent", "agent_id": "b"}}
`), &mockState)
	assert.NoError(t, err)
	return mockState
}

func getMockStatePacket(t *testing.T) map[string]interface{} {
	return map[string]interface{}{
		"type":    "game_state",
		"payload": copyObject(t, getMockState(t)),
	}
}

func getMockTickSpawnPacket(t *testing.T) map[string]interface{} {
	var mockTickSpawnPacket interface{}
	err := json.Unmarshal([]byte(`
[{"type": "entity_spawned", "data": {"created": 22, "x": 7, "y": 3, "type": "a", "expires": 62, "hp": 1}}]
`), &mockTickSpawnPacket)
	assert.NoError(t, err)
	return createMockTickPacket(t, 22, mockTickSpawnPacket)
}

func getMockTickExpiredPacket(t *testing.T) map[string]interface{} {
	var mockTickExpiredPacket interface{}
	err := json.Unmarshal([]byte(`
[{"type": "entity_expired", "data": [7, 3]}]
`), &mockTickExpiredPacket)
	assert.NoError(t, err)
	return createMockTickPacket(t, 62, mockTickExpiredPacket)
}

func getMockUnitStatePayload(t *testing.T) interface{} {
	var mockUnitStatePayload interface{}
	err := json.Unmarshal([]byte(`
{"coordinates": [3, 10], "hp": 3, "inventory": {"bombs": 2}, "blast_diameter": 3, "unit_id": "c", "agent_id": "a", "invulnerability": 0}
`), &mockUnitStatePayload)
	assert.NoError(t, err)
	return mockUnitStatePayload
}

func getMockTickUnitStatePacket(t *testing.T) map[string]interface{} {
	return createMockTickPacket(t, 50, []interface{}{map[string]interface{}{
		"type": "unit_state",
		"data": getMockUnitStatePayload(t),
	}})
}

func getMockTickUnitActionPacket(t *testing.T) map[string]interface{} {
	var mockTickUnitActionPacket interface{}
	err := json.Unmarshal([]byte(`
{"type": "unit", "agent_id": "a", "data": {"type": "move", "move": "right", "unit_id": "c"}}
`), &mockTickUnitActionPacket)
	assert.NoError(t, err)
	return createMockTickPacket(t, 5, []interface{}{mockTickUnitActionPacket})
}
