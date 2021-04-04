from game_state import GameState
import asyncio
import random

uri = "ws://127.0.0.1:3000/?role=agent&agentId=agentId&name=defaultName"

actions = ["up", "down", "left", "right", "bomb"]


def generate_random_action():
    actions_length = len(actions)
    return actions[random.randint(0, actions_length - 1)]


async def on_game_tick(tick_number, game_state, send):
    random_action = generate_random_action()
    await send(random_action)


def main():
    client = GameState(uri)
    client.set_game_tick_callback(on_game_tick)
    loop = asyncio.get_event_loop()
    connection = loop.run_until_complete(client.connect())
    tasks = [
        asyncio.ensure_future(client._handle_messages(connection)),
    ]

    loop.run_until_complete(asyncio.wait(tasks))


if __name__ == "__main__":
    main()
