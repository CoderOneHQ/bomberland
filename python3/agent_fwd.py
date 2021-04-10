from game_state import GameState
from forward_model import ForwardModel
import asyncio
import random
import os

max_fwd_model_retries = 10

fwd_model_uri = os.environ.get(
    "FWD_MODEL_CONNECTION_STRING") or "ws://127.0.0.1:6969/?role=admin"

uri = os.environ.get(
    "GAME_CONNECTION_STRING") or "ws://127.0.0.1:3000/?role=agent&agentId=agentId&name=defaultName"

actions = ["up", "down", "left", "right", "bomb"]


class Agent():
    def __init__(self):
        self._client_fwd = ForwardModel(fwd_model_uri)
        self._client = GameState(uri)

        self._client.set_game_tick_callback(self.on_game_tick)
        self.connect()

    def connect(self):
        loop = asyncio.get_event_loop()

        client_connection = loop.run_until_complete(self._client.connect())
        client_fwd_connection = None

        for i in range(0, max_fwd_model_retries):
            try:
                client_fwd_connection = loop.run_until_complete(
                    self._client_fwd.connect())
            except ConnectionRefusedError:
                print(f"Waiting for forward model game server {i}")
                time.sleep(1)
                continue

        loop = asyncio.get_event_loop()
        loop.create_task(self._client._handle_messages(client_connection))
        loop.create_task(
            self._client_fwd._handle_messages(client_fwd_connection))
        loop.run_forever()

    async def on_game_tick(self, tick_number, game_state):
        random_action = self.generate_random_action()
        game_state = self._client._state
        await self._client_fwd.send_next_state(tick_number, game_state, [])
        await self._client._send(random_action)

    def generate_random_action(self):
        actions_length = len(actions)
        return actions[random.randint(0, actions_length - 1)]


def main():
    Agent()


if __name__ == "__main__":
    main()
