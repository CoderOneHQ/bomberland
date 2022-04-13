package bomberland

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/websocket"
	"github.com/sirupsen/logrus"
	"sync"
)

type Move string

const (
	Up    Move = "up"
	Down  Move = "down"
	Left  Move = "left"
	Right Move = "right"
)

type TickHandler func(tickNumber float64, state map[string]interface{}) error

type GameState struct {
	connectionString string
	connection       *websocket.Conn
	state            map[string]interface{}
	tickHandler      TickHandler
}

func NewGameState(connectionString string, tickHandler TickHandler) *GameState {
	return &GameState{
		connectionString: connectionString,
		tickHandler:      tickHandler,
	}
}

func (gs *GameState) Connect() error {
	conn, _, err := websocket.DefaultDialer.Dial(gs.connectionString, nil)
	if err != nil {
		return err
	}
	gs.connection = conn
	return err
}

func (gs *GameState) Run() error {
	exit := sync.Mutex{}
	exit.Lock()
	var err error
	go func() {
		for {
			var data map[string]interface{}
			err = gs.connection.ReadJSON(&data)
			if err != nil {
				break
			}
			err = gs.onData(data)
			if err != nil {
				break
			}
		}
		exit.Unlock()
	}()
	exit.Lock()
	return err
}

func (gs *GameState) send(packet interface{}) error {
	return gs.connection.WriteJSON(packet)
}

func (gs *GameState) SendMove(move Move, unitID string) error {
	return gs.send(map[string]interface{}{
		"type":    "move",
		"move":    string(move),
		"unit_id": unitID,
	})
}

func (gs *GameState) SendBomb(unitID string) error {
	return gs.send(map[string]interface{}{
		"type":    "bomb",
		"unit_id": unitID,
	})
}

func (gs *GameState) SendDetonate(x, y float64, unitID string) error {
	return gs.send(map[string]interface{}{
		"type":        "detonate",
		"coordinates": []float64{x, y},
		"unit_id":     unitID,
	})
}

func (gs *GameState) onData(data map[string]interface{}) error {
	switch data["type"] {
	case "info":
		logrus.Info("info state")
		return nil
	case "game_state":
		return gs.onGameState(data["payload"].(map[string]interface{}))
	case "tick":
		return gs.onGameTick(data["payload"].(map[string]interface{}))
	case "endgame_state":
		payload := data["payload"].(map[string]interface{})
		return fmt.Errorf("game over, winner is [%v]", payload["winning_agent_id"])
	default:
		return fmt.Errorf("unknown state [%v]", data["type"])
	}
}

func (gs *GameState) onGameState(state map[string]interface{}) error {
	gs.state = state
	return nil
}

func (gs *GameState) onGameTick(tick map[string]interface{}) error {
	events := tick["events"].([]interface{})
	for _, iEvent := range events {
		event := iEvent.(map[string]interface{})
		var err error
		switch event["type"] {
		case "entity_spawned":
			err = gs.onEntitySpawned(event["data"])
		case "entity_expired":
			coordinates := event["data"].([]interface{})
			err = gs.onEntityExpired(coordinates[0].(float64), coordinates[1].(float64))
		case "unit_state":
			err = gs.onUnitState(event["data"].(map[string]interface{}))
		case "entity_state":
			coordinates := event["coordinates"].([]interface{})
			updatedEntity := event["updated_entity"].(map[string]interface{})
			err = gs.onEntityState(coordinates[0].(float64), coordinates[1].(float64), updatedEntity)
		case "unit":
			err = gs.onUnitAction(event["data"].(map[string]interface{}))
		default:
			err = fmt.Errorf("unknown event [%v]", event["type"])
		}
		if err != nil {
			return err
		}
	}
	marshalledState, err := json.Marshal(gs.state)
	if err != nil {
		return err
	}
	var state map[string]interface{}
	err = json.Unmarshal(marshalledState, &state)
	if err != nil {
		return err
	}
	if gs.tickHandler != nil {
		return gs.tickHandler(tick["tick"].(float64), state)
	}
	return nil
}

func (gs *GameState) onEntitySpawned(spawnedEntity interface{}) error {
	entities := gs.state["entities"].([]interface{})
	entities = append(entities, spawnedEntity)
	return nil
}

func (gs *GameState) onEntityExpired(x, y float64) error {
	var newEntities []interface{}
	for _, iEntity := range gs.state["entities"].([]interface{}) {
		entity := iEntity.(map[string]interface{})
		if entity["x"].(float64) == x && entity["y"].(float64) == y {
			continue
		}
		newEntities = append(newEntities, entity)
	}
	gs.state["entities"] = newEntities
	return nil
}

func (gs *GameState) onUnitState(unitState map[string]interface{}) error {
	unitID := unitState["unit_id"].(string)
	unitSates := gs.state["unit_state"].(map[string]interface{})
	unitSates[unitID] = unitState
	return nil
}

func (gs *GameState) onEntityState(x, y float64, updatedEntity map[string]interface{}) error {
	var newEntities []interface{}
	for _, iEntity := range gs.state["entities"].([]interface{}) {
		entity := iEntity.(map[string]interface{})
		if entity["x"].(float64) == x && entity["y"].(float64) == y {
			continue
		}
		newEntities = append(newEntities, entity)
	}
	newEntities = append(newEntities, updatedEntity)
	gs.state["entities"] = newEntities
	return nil
}

func (gs *GameState) onUnitAction(actionPacket map[string]interface{}) error {
	unitID := actionPacket["unit_id"].(string)
	unit := gs.state["unit_state"].(map[string]interface{})[unitID].(map[string]interface{})
	switch actionPacket["type"] {
	case "move":
		newCoordinates, err := gs.getNewCoordinates(unit["coordinates"].([]interface{}), actionPacket["move"].(string))
		if err != nil {
			return err
		}
		unit["coordinates"] = newCoordinates
		return nil
	case "bomb":
		return nil
	case "detonate":
		return nil
	default:
		return fmt.Errorf("unknown action [%v]", actionPacket["type"])
	}
}

func (gs *GameState) getNewCoordinates(coordinates []interface{}, moveAction string) ([]interface{}, error) {
	switch moveAction {
	case string(Up):
		return []interface{}{coordinates[0].(float64), coordinates[1].(float64) + 1}, nil
	case string(Down):
		return []interface{}{coordinates[0].(float64), coordinates[1].(float64) - 1}, nil
	case string(Right):
		return []interface{}{coordinates[0].(float64) + 1, coordinates[1].(float64)}, nil
	case string(Left):
		return []interface{}{coordinates[0].(float64) - 1, coordinates[1].(float64)}, nil
	default:
		return nil, fmt.Errorf("unknown move action [%v]", moveAction)
	}
}
