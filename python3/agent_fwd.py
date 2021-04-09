from game_state import GameState
from forward_model import ForwardModel
import asyncio
import random
import os

fwd_model_uri = os.environ.get(
    'FWD_MODEL_CONNECTION_STRING') or "ws://127.0.0.1:6969/?role=admin"

uri = os.environ.get(
    'GAME_CONNECTION_STRING') or "ws://127.0.0.1:3000/?role=agent&agentId=agentId&name=defaultName"

actions = ["up", "down", "left", "right", "bomb"]


class Agent():
    def __init__(self):
        client_fwd = ForwardModel(fwd_model_uri)
        client = GameState(uri)
        client.set_game_tick_callback(self.on_game_tick)
        loop = asyncio.get_event_loop()
        connection = loop.run_until_complete(client.connect())
        tasks = [
            asyncio.ensure_future(client._handle_messages(connection)),
        ]

        loop.run_until_complete(asyncio.wait(tasks))

    async def on_game_tick(self, tick_number, game_state, send):
        random_action = self.generate_random_action()
        await send(random_action)

    def generate_random_action(self):
        actions_length = len(actions)
        return actions[random.randint(0, actions_length - 1)]


def main():
    Agent()


if __name__ == "__main__":
    main()
