import asyncio
import websockets


class GameState:

    def __init__(self, connection_string: str):
        self.connection_string = connection_string
        self.is_game_running = True

    async def connect(self):
        self.connection = await websockets.client.connect(self.connection_string)
        if self.connection.open:
            return self.connection

    async def sendMessage(self, message):
        await self.connection.send(message)

    async def receiveMessage(self, connection):

        while self.is_game_running is True:
            try:
                message = await connection.recv()
                print(str(message))
            except websockets.exceptions.ConnectionClosed:
                print('Connection with server closed')
                break

    async def heartbeat(self, connection):
        while True:
            try:
                await connection.send('ping')
                await asyncio.sleep(5)
            except websockets.exceptions.ConnectionClosed:
                print('Connection with server closed')
                break
