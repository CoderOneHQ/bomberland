import asyncio
import websockets
import json


class GameState:
    def __init__(self, connection_string: str):
        self._connection_string = connection_string
        self._is_game_running = True
        self._state = None
        self._generate_agent_action_callback = None

    def set_game_tick_callback(self, generate_agent_action_callback):
        self._generate_agent_action_callback = generate_agent_action_callback

    async def connect(self):
        self.connection = await websockets.client.connect(self._connection_string)
        if self.connection.open:
            return self.connection

    async def send_message(self, message):
        await self.connection.send(message)

    async def _handle_messages(self, connection):

        while self._is_game_running is True:
            try:
                raw_data = await connection.recv()
                data = json.loads(raw_data)
                self._on_data(data)
            except websockets.exceptions.ConnectionClosed:
                print('Connection with server closed')
                break

    def _on_data(self, data):
        data_type = data.get("type")
        payload = data.get("payload")

        if data_type == "info":
            # no operation
            pass
        elif data_type == "game_state":
            self._on_game_state(payload)
        else:
            print(f"unknown packet \"{data_type}\": {data}")

    def _on_game_state(self, game_state):
        self._state = game_state

    def _on_game_tick(self, game_tick):
        print(game_tick)
