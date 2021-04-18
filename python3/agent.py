from game_state import GameState
import asyncio
import random
import os

uri = os.environ.get(
    'GAME_CONNECTION_STRING') or "ws://127.0.0.1:3000/?role=agent&agentId=agentId&name=defaultName"

actions = ["up", "down", "left", "right", "bomb", "detonate"]


class Agent():
    def __init__(self):
        self._client = GameState(uri)

        self._client.set_game_tick_callback(self._on_game_tick)
        loop = asyncio.get_event_loop()
        connection = loop.run_until_complete(self._client.connect())
        tasks = [
            asyncio.ensure_future(self._client._handle_messages(connection)),
        ]
        loop.run_until_complete(asyncio.wait(tasks))

    def _get_bomb_to_detonate(self, game_state) -> [int, int] or None:
        agent_number = game_state.get("connection").get("agentNumber")
        entities = self._client._state.get("entities")
        bombs = list(filter(lambda entity: entity.get(
            "owner") == agent_number and entity.get("type") == "b", entities))
        bomb = next(iter(bombs or []), None)
        if bomb != None:
            return [bomb.get("x"), bomb.get("y")]
        else:
            return None

    async def _on_game_tick(self, tick_number, game_state):
        random_action = self.generate_random_action()
        if random_action in ["up", "left", "right", "down"]:
            await self._client.send_move(random_action)
        elif random_action == "bomb":
            await self._client.send_bomb()
        elif random_action == "detonate":
            bomb_coordiantes = self._get_bomb_to_detonate(game_state)
            if bomb_coordiantes != None:
                x, y = bomb_coordiantes
                await self._client.send_detonate(x, y)
        else:
            print(f"Unhandled action: {random_action}")

    def generate_random_action(self):
        actions_length = len(actions)
        return actions[random.randint(0, actions_length - 1)]


def main():
    Agent()


if __name__ == "__main__":
    main()
