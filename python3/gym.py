import asyncio
import json
from typing import Dict
from forward_model import ForwardModel

mock_6x6_state: Dict = {"units": [{"coordinates": [0, 1], "hp":3, "inventory":{"bombs": 3}, "blast_diameter": 3, "unit_id": "c", "agent_id": "a", "invulnerability": 0}, {"coordinates": [5, 1], "hp":3, "inventory":{"bombs": 3}, "blast_diameter": 3, "unit_id": "d", "agent_id": "b", "invulnerability": 0}, {"coordinates": [3, 3], "hp":3, "inventory":{"bombs": 3}, "blast_diameter": 3, "unit_id": "e", "agent_id": "a", "invulnerability": 0}, {"coordinates": [2, 3], "hp":3, "inventory":{"bombs": 3}, "blast_diameter": 3, "unit_id": "f", "agent_id": "b", "invulnerability": 0}, {"coordinates": [2, 4], "hp":3, "inventory":{"bombs": 3}, "blast_diameter": 3, "unit_id": "g", "agent_id": "a", "invulnerability": 0}, {"coordinates": [3, 4], "hp":3, "inventory":{"bombs": 3}, "blast_diameter": 3, "unit_id": "h", "agent_id": "b", "invulnerability": 0}], "entities": [
    {"created": 0, "x": 0, "y": 3, "type": "m"}, {"created": 0, "x": 5, "y": 3, "type": "m"}, {"created": 0, "x": 4, "y": 3, "type": "m"}, {"created": 0, "x": 1, "y": 3, "type": "m"}, {"created": 0, "x": 3, "y": 5, "type": "m"}, {"created": 0, "x": 2, "y": 5, "type": "m"}, {"created": 0, "x": 5, "y": 4, "type": "m"}, {"created": 0, "x": 0, "y": 4, "type": "m"}, {"created": 0, "x": 1, "y": 1, "type": "w", "hp": 1}, {"created": 0, "x": 4, "y": 1, "type": "w", "hp": 1}, {"created": 0, "x": 3, "y": 0, "type": "w", "hp": 1}, {"created": 0, "x": 2, "y": 0, "type": "w", "hp": 1}, {"created": 0, "x": 5, "y": 5, "type": "w", "hp": 1}, {"created": 0, "x": 0, "y": 5, "type": "w", "hp": 1}, {"created": 0, "x": 4, "y": 0, "type": "w", "hp": 1}, {"created": 0, "x": 1, "y": 0, "type": "w", "hp": 1}, {"created": 0, "x": 5, "y": 0, "type": "w", "hp": 1}, {"created": 0, "x": 0, "y": 0, "type": "w", "hp": 1}]}


class GymEnv:
    def __init__(self, fwd_model: ForwardModel, initial_state: Dict):
        self._state = initial_state
        self._fwd = fwd_model
        self._fwd.set_next_state_callback(self._on_next_game_state)
        self._sequenceId = 0

    async def reset(self) -> None:
        # print("resetting")
        return

    async def step(self, actions):
        print("stepping with actions:{}".format(
            json.dumps(actions, separators=(',', ':'))))
        await self._fwd.send_next_state(
            self._next_sequence_id(), self._state, actions)
        return [1, 2, 3, 4]

    async def close(self) -> None:
        print("closing")
        await self._fwd.close()

    def _next_sequence_id(self) -> int:
        self._sequenceId += 1
        return self._sequenceId

    async def _on_next_game_state(self, state):
        print("mex")


class Gym:
    def __init__(self, fwd_model_connection_string: str):
        self._client_fwd = ForwardModel(fwd_model_connection_string)
        self._environments = {}

    async def connect_forward_model(self):
        client_fwd_connection = await self._client_fwd.connect()
        loop = asyncio.get_event_loop()
        loop.create_task(
            self._client_fwd._handle_messages(client_fwd_connection))

    def make(self, name: str, initial_state: Dict) -> GymEnv:
        if self._environments.get(name) is not None:
            raise Exception(
                "Environment {} has already been instantiated".format(name))
        return GymEnv(self._client_fwd, initial_state)
