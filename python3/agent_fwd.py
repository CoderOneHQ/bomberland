from typing import Union
from forward_model import ForwardModel
from game_state import GameState
import asyncio
import os
import random

fwd_model_uri = os.environ.get(
    "FWD_MODEL_CONNECTION_STRING") or "ws://127.0.0.1:6969/?role=admin"

uri = os.environ.get(
    "GAME_CONNECTION_STRING") or "ws://127.0.0.1:3000/?role=agent&agentId=agentId&name=defaultName"

actions = ["up", "down", "left", "right", "bomb", "detonate"]


class Agent():
    def __init__(self):
        self._client_fwd = ForwardModel(fwd_model_uri)
        self._client = GameState(uri)

        self._client.set_game_tick_callback(self._on_game_tick)
        self._client_fwd.set_next_state_callback(self._on_next_game_state)
        self.connect()

    def connect(self):
        loop = asyncio.get_event_loop()

        client_connection = loop.run_until_complete(self._client.connect())

        client_fwd_connection = loop.run_until_complete(
            self._client_fwd.connect())

        loop = asyncio.get_event_loop()
        loop.create_task(self._client._handle_messages(client_connection))
        loop.create_task(
            self._client_fwd._handle_messages(client_fwd_connection))
        loop.run_forever()

    def _get_bomb_to_detonate(self, game_state) -> Union[int, int] or None:
        agent_number = game_state.get("connection").get("agent_number")
        entities = self._client._state.get("entities")
        bombs = list(filter(lambda entity: entity.get(
            "owner") == agent_number and entity.get("type") == "b", entities))
        bomb = next(iter(bombs or []), None)
        if bomb != None:
            return [bomb.get("x"), bomb.get("y")]
        else:
            return None

    async def _on_game_tick(self, tick_number, game_state):
        await self._send_eval_next_state()
        random_action = self.generate_random_action()
        if random_action in ["up", "left", "right", "down"]:
            await self._client.send_move(random_action)
        elif random_action == "bomb":
            await self._client.send_bomb()
        elif random_action == "detonate":
            bomb_coordinates = self._get_bomb_to_detonate(game_state)
            if bomb_coordinates != None:
                x, y = bomb_coordinates
                await self._client.send_detonate(x, y)
        else:
            print(f"Unhandled action: {random_action}")

    async def _send_eval_next_state(self):
        actions = [
            {
                "action": {"move": "right", "type": "move"},
                "agent_number": 0,
            }, {
                "action": {"move": "left", "type": "move"},
                "agent_number": 1,
            }
        ]
        await self._client_fwd.send_next_state(1, self._client._state, actions)

    def generate_random_action(self):
        actions_length = len(actions)
        return actions[random.randint(0, actions_length - 1)]

    async def _on_next_game_state(self, state):
        # print(state)
        pass

    def generate_random_action(self):
        actions_length = len(actions)
        return actions[random.randint(0, actions_length - 1)]


def main():
    Agent()


if __name__ == "__main__":
    main()
