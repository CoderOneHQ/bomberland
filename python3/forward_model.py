import asyncio
import websockets
import json


class ForwardModel:
    def __init__(self, connection_string: str):
        self._connection_string = connection_string

    async def connect(self):
        self.connection = await websockets.client.connect(self._connection_string)
        if self.connection.open:
            return self.connection

    async def _handle_messages(self, connection: str):
        while True:
            try:
                raw_data = await connection.recv()
                data = json.loads(raw_data)
                await self._on_data(data)
            except websockets.exceptions.ConnectionClosed:
                print('Connection with server closed')
                break

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

    """
    sample moves payload:
    [{
        "move": "right",
        "agentNumber": 0,
    }, {
        "move": "left",
        "agentNumber": 1,
    }]

    REMARKS:
    `sequence_id` is used to for you match up an evaluated
    next_state call since payloads can come back in any order
    It should ideally be unique
    """
    async def send_next_state(self, sequence_id, game_state, moves):
        payload = {"type": "next", "moves": moves,
                   "state": game_state, "sequence_id": sequence_id}
        await self.connection.send(json.dumps(payload))
