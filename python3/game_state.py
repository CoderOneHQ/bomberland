import asyncio
import websockets

async def hello():
    uri = "ws://127.0.0.1:3000/?role=agent&agentId=agentId&name=defaultName"
    async with websockets.connect(uri) as websocket:
        await websocket.send("Hello world!")
        await websocket.recv()

asyncio.get_event_loop().run_until_complete(hello())