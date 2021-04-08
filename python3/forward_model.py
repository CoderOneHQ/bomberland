import asyncio
import websockets
import json


_agent_move_set = set(("up", "down", "left", "right"))


class ForwardModel:
    def __init__(self, connection_string: str):
        self._connection_string = connection_string

    async def connect(self):
        self.connection = await websockets.client.connect(self._connection_string)
        if self.connection.open:
            return self.connection

    async def _on_data(self, data):
        data_type = data.get("type")

        if data_type == "info":
            # no operation
            pass
        elif data_type == "next_game_state":
            payload = data.get("payload")
            self._on_game_state(payload)
        else:
            print(f"unknown packet \"{data_type}\": {data}")

    def _on_game_state(self, game_state):
        self._state = game_state
