from game_state import GameState
import asyncio
import random
import os

from mybot import MyBot

uri = os.environ.get(
    'GAME_CONNECTION_STRING') or "ws://127.0.0.1:3000/?role=agent&agentId=agentId&name=defaultName"

actions = ["up", "down", "left", "right", "bomb", "detonate"]


class Agent():
    def __init__(self):
        self._client = GameState(uri)
        self.my_bot = MyBot(self._client)

        self._client.set_game_tick_callback(self._on_game_tick)
        loop = asyncio.get_event_loop()
        connection = loop.run_until_complete(self._client.connect())
        tasks = [
            asyncio.ensure_future(self._client._handle_messages(connection)),
        ]
        loop.run_until_complete(asyncio.wait(tasks))

    def _get_bomb_to_detonate(self, game_state) -> [int, int] or None:
        agent_number = game_state.get("connection").get("agent_number")
        entities = self._client._state.get("entities")
        bombs = list(filter(lambda entity: entity.get(
            "owner") == agent_number and entity.get("type") == "b", entities))
        bomb = next(iter(bombs or []), None)
        if bomb != None:
            return [bomb.get("x"), bomb.get("y")]
        else:
            return None

    async def _on_game_tick(self, tick_number, game_state):
        # chosen_action = self.generate_random_action()
        bomb_coordinates = None
        chosen_action = self.my_bot.choose_action(tick_number, game_state)

        # parse choose_action output
        if type(chosen_action) is tuple:
            chosen_action, bomb_coordinates = chosen_action
            if bomb_coordinates is not None:
                bomb_coordinates = (int(bomb_coordinates[0]), int(bomb_coordinates[1])) # ensure it is a tuple

        print(f"REVIEW: Queued {chosen_action} at Tick #{tick_number}")
        # send action to client
        if chosen_action in ["up", "left", "right", "down"]:
            await self._client.send_move(chosen_action)
        elif chosen_action == "bomb":
            await self._client.send_bomb()
        elif chosen_action == "detonate":
            if bomb_coordinates == None:
                bomb_coordinates = self._get_bomb_to_detonate(game_state)
            if bomb_coordinates != None:
                x, y = bomb_coordinates
                await self._client.send_detonate(x, y)
        elif chosen_action is None:
            print(f"Nothing to do")
        else:
            print(f"Unhandled action: {chosen_action}")

    def generate_random_action(self):
        actions_length = len(actions)
        return actions[random.randint(0, actions_length - 1)]


def main():
    Agent()


if __name__ == "__main__":
    main()
