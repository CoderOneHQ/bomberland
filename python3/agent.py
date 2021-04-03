from game_state import GameState
import asyncio

uri = "ws://127.0.0.1:3000/?role=agent&agentId=agentId&name=defaultName"


def main():
    client = GameState(uri)
    loop = asyncio.get_event_loop()
    connection = loop.run_until_complete(client.connect())
    tasks = [
        asyncio.ensure_future(client.heartbeat(connection)),
        asyncio.ensure_future(client.receiveMessage(connection)),
    ]

    loop.run_until_complete(asyncio.wait(tasks))


if __name__ == "__main__":
    main()
