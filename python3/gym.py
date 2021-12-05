import os
import asyncio
from typing import Dict
from forward_model import ForwardModel

mock_6x6_state: Dict = {"units": [{"coordinates": [0, 1], "hp":3, "inventory":{"bombs": 3}, "blast_diameter": 3, "unit_id": "c", "agent_id": "a", "invulnerability": 0}, {"coordinates": [5, 1], "hp":3, "inventory":{"bombs": 3}, "blast_diameter": 3, "unit_id": "d", "agent_id": "b", "invulnerability": 0}, {"coordinates": [3, 3], "hp":3, "inventory":{"bombs": 3}, "blast_diameter": 3, "unit_id": "e", "agent_id": "a", "invulnerability": 0}, {"coordinates": [2, 3], "hp":3, "inventory":{"bombs": 3}, "blast_diameter": 3, "unit_id": "f", "agent_id": "b", "invulnerability": 0}, {"coordinates": [2, 4], "hp":3, "inventory":{"bombs": 3}, "blast_diameter": 3, "unit_id": "g", "agent_id": "a", "invulnerability": 0}, {"coordinates": [3, 4], "hp":3, "inventory":{"bombs": 3}, "blast_diameter": 3, "unit_id": "h", "agent_id": "b", "invulnerability": 0}], "entities": [
    {"created": 0, "x": 0, "y": 3, "type": "m"}, {"created": 0, "x": 5, "y": 3, "type": "m"}, {"created": 0, "x": 4, "y": 3, "type": "m"}, {"created": 0, "x": 1, "y": 3, "type": "m"}, {"created": 0, "x": 3, "y": 5, "type": "m"}, {"created": 0, "x": 2, "y": 5, "type": "m"}, {"created": 0, "x": 5, "y": 4, "type": "m"}, {"created": 0, "x": 0, "y": 4, "type": "m"}, {"created": 0, "x": 1, "y": 1, "type": "w", "hp": 1}, {"created": 0, "x": 4, "y": 1, "type": "w", "hp": 1}, {"created": 0, "x": 3, "y": 0, "type": "w", "hp": 1}, {"created": 0, "x": 2, "y": 0, "type": "w", "hp": 1}, {"created": 0, "x": 5, "y": 5, "type": "w", "hp": 1}, {"created": 0, "x": 0, "y": 5, "type": "w", "hp": 1}, {"created": 0, "x": 4, "y": 0, "type": "w", "hp": 1}, {"created": 0, "x": 1, "y": 0, "type": "w", "hp": 1}, {"created": 0, "x": 5, "y": 0, "type": "w", "hp": 1}, {"created": 0, "x": 0, "y": 0, "type": "w", "hp": 1}]}


fwd_model_uri = os.environ.get(
    "FWD_MODEL_CONNECTION_STRING") or "ws://127.0.0.1:6969/?role=admin"


class Gym():
    def __init__(self):
        self._client_fwd = ForwardModel(fwd_model_uri)

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

    async def _on_next_game_state(self, state):
        print(state)
        pass
