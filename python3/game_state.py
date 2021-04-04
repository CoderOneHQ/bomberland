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
        elif data_type == "tick":
            self._on_game_tick(payload)
        else:
            print(f"unknown packet \"{data_type}\": {data}")

    def _on_game_state(self, game_state):
        self._state = game_state

    def _on_game_tick(self, game_tick):
        events = game_tick.get("events")
        for event in events:
            event_type = event.get("type")
            if event_type == "entity_spawned":
                self._on_entity_spawned(event)
            elif event_type == "entity_expired":
                self._on_entity_expired(event)
            else:
                print(f"unknown event type {event_type}: {event}")

    def _on_entity_spawned(self, spawn_event):
        spawn_payload = spawn_event.get("data")
        self._state["entities"].append(spawn_payload)

    def _on_entity_expired(self, spawn_event):
        expire_payload = spawn_event.get("data")

        def filter_entity_fn(entity):
            [x, y] = expire_payload
            entity_x = entity.get("x")
            entity_y = entity.get("y")
            should_remove = entity_x == x and entity_y == y
            return should_remove == False

        self._state["entities"] = list(filter(
            filter_entity_fn, self._state["entities"]))
