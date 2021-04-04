from game_state import GameState
import asyncio

uri = "ws://127.0.0.1:3000/?role=agent&agentId=agentId&name=defaultName"


def generate_agent_action(tick_number, game_state):
    print(tick_number)


def main():
    client = GameState(uri)
    client.set_game_tick_callback(generate_agent_action)
    loop = asyncio.get_event_loop()
    connection = loop.run_until_complete(client.connect())
    tasks = [
        asyncio.ensure_future(client._handle_messages(connection)),
    ]

    loop.run_until_complete(asyncio.wait(tasks))


if __name__ == "__main__":
    main()
