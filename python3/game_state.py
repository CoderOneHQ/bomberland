import asyncio
import websockets


class GameState:
    def __init__(self, connection_string: str):
        self.connection_string = connection_string
        print(self.connection_string)


# async def hello():
#     uri = "ws://127.0.0.1:3000/?role=agent&agentId=agentId&name=defaultName"
#     async with websockets.connect(uri) as websocket:
#         await websocket.send("Hello world!")
#         await websocket.recv()

# asyncio.get_event_loop().run_until_complete(hello())
