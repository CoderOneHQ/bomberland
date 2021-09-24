package main

import (
	"bomberland/bomberland"
	"github.com/sirupsen/logrus"
	"log"
	"math/rand"
	"os"
)

var moveMap = map[int]bomberland.Move{
	0: bomberland.Up,
	1: bomberland.Down,
	2: bomberland.Left,
	3: bomberland.Right,
}

var gameState *bomberland.GameState

func main() {
	connectionString := os.Getenv("GAME_CONNECTION_STRING")
	if connectionString == "" {
		connectionString = "ws://127.0.0.1:3000/?role=agent&agentId=agentId&name=defaultName"
	}
	gameState = bomberland.NewGameState(connectionString, tickHandler)
	err := gameState.Connect()
	if err != nil {
		log.Fatal(err)
	}
	err = gameState.Run()
	if err != nil {
		log.Fatal(err)
	}
}

func tickHandler(tickNumber float64, state map[string]interface{}) (err error) {
	logrus.WithField("tick", tickNumber).Info("Start")
	defer logrus.WithField("tick", tickNumber).Info("Finish")
	myAgentID := state["connection"].(map[string]interface{})["client_id"].(string)
	myUnitIDs := state["agents"].(map[string]interface{})[myAgentID].(map[string]interface{})["unit_ids"].([]string)
	for _, unitID := range myUnitIDs {
		action := rand.Int31n(6)
		move, ok := moveMap[int(action)]
		if ok {
			err = gameState.SendMove(move, unitID)
			if err != nil {
				logrus.Error(err)
			}
			continue
		}
		if action == 4 {
			err = gameState.SendBomb(unitID)
			if err != nil {
				logrus.Error(err)
			}
			continue
		}
		x, y := getBombToDetonate(unitID, state)
		if x > 0 && y > 0 {
			err = gameState.SendDetonate(x, y, unitID)
			if err != nil {
				logrus.Error(err)
			}
			continue
		}
	}
	return
}

func getBombToDetonate(unitID string, state map[string]interface{}) (float64, float64) {
	for _, iEntity := range state["entities"].([]interface{}) {
		entity := iEntity.(map[string]interface{})
		if entity["owner_unit_id"] == unitID && entity["type"] == "b" {
			return entity["x"].(float64), entity["y"].(float64)
		}
	}
	return -1, -1
}
