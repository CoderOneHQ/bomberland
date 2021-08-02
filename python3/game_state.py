import asyncio
import websockets
import json

_move_set = set(("up", "down", "left", "right"))


class GameState:
    def __init__(self, connection_string: str):
        self._connection_string = connection_string
        self._state = None
        self._tick_callback = None

    def set_game_tick_callback(self, generate_agent_action_callback):
        self._tick_callback = generate_agent_action_callback

    async def connect(self):
        self.connection = await websockets.client.connect(self._connection_string)
        if self.connection.open:
            return self.connection

    async def _send(self, packet):
        await self.connection.send(json.dumps(packet))

    async def send_move(self, move: str, unit_id: str):
        if move in _move_set:
            packet = {"type": "move", "move": move, "unit_id": unit_id}
            await self._send(packet)

    async def send_bomb(self, unit_id: str):
        packet = {"type": "bomb", "unit_id": unit_id}
        await self._send(packet)

    async def send_detonate(self, x, y, unit_id: str):
        packet = {"type": "detonate", "coordinates": [x, y], "unit_id": unit_id}
        await self._send(packet)

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
        elif data_type == "game_state":
            payload = data.get("payload")
            self._on_game_state(payload)
        elif data_type == "tick":
            payload = data.get("payload")
            await self._on_game_tick(payload)
        elif data_type == "endgame_state":
            payload = data.get("payload")
            winning_agent_id = payload.get("winning_agent_id")
            print(f"Game over. Winner: Agent {winning_agent_id}")
        else:
            print(f"unknown packet \"{data_type}\": {data}")

    def _on_game_state(self, game_state):
        self._state = game_state

    async def _on_game_tick(self, game_tick):
        events = game_tick.get("events")
        for event in events:
            event_type = event.get("type")
            if event_type == "entity_spawned":
                self._on_entity_spawned(event)
            elif event_type == "entity_expired":
                self._on_entity_expired(event)
            elif event_type == "unit_state":
                payload = event.get("data")
                self._on_unit_state(payload)
            elif event_type == "entity_state":
                x, y = event.get("coordinates")
                updated_entity = event.get("updated_entity")
                self._on_entity_state(x, y, updated_entity)
            elif event_type == "unit":
                unit_action = event.get("data")
                self._on_unit_action(unit_action)
            else:
                print(f"unknown event type {event_type}: {event}")
        if self._tick_callback is not None:
            tick_number = game_tick.get("tick")
            await self._tick_callback(tick_number, self._state)

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

    def _on_unit_state(self, unit_state):
        unit_id = unit_state.get("unit_id")
        self._state["unit_state"][unit_id] = unit_state

    def _on_entity_state(self, x, y, updated_entity):
        for entity in self._state.get("entities"):
            if entity.get("x") == x and entity.get("y") == y:
                self._state["entities"].remove(entity)
        self._state["entities"].append(updated_entity)

    def _on_unit_action(self, action_packet):
        unit_id = action_packet["unit_id"]
        unit = self._state["unit_state"][unit_id]
        coordinates = unit.get("coordinates")
        action_type = action_packet.get("type")
        if action_type == "move":
            move = action_packet.get("move")
            if move in _move_set:
                new_coordinates = self._get_new_unit_coordinates(
                    coordinates, move)
                self._state["unit_state"][unit_id]["coordinates"] = new_coordinates
        elif action_type == "bomb":
            # no - op since this is redundant info
            pass
        elif action_type == "detonate":
            # no - op since this is redundant info
            pass
        else:
            print(f"Unhandled agent action recieved: {action_type}")

    def _get_new_unit_coordinates(self, coordinates, move_action) -> [int, int]:
        [x, y] = coordinates
        if move_action == "up":
            return [x, y+1]
        elif move_action == "down":
            return [x, y-1]
        elif move_action == "right":
            return [x+1, y]
        elif move_action == "left":
            return [x-1, y]
