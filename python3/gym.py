import asyncio
import json
from typing import Callable, Dict, List

import websockets
from forward_model import ForwardModel


class GymEnv():
    def __init__(self, fwd_model: ForwardModel, channel: int, initial_state: Dict, send_next_state: Callable[[Dict, List[Dict],  int], Dict]):
        self._state = initial_state
        self._initial_state = initial_state
        self._fwd = fwd_model
        self._channel = channel
        self._send = send_next_state

    async def reset(self):
        self._state = self._initial_state
        print("Resetting")

    async def step(self, actions):
        state = await self._send(self._state, actions, self._channel)
        self._state = state.get("next_state")
        return [state.get("next_state"), state.get("is_complete"), state.get("tick_result").get("events")]


class Gym():
    def __init__(self, fwd_model_uri: str):
        self._client_fwd = ForwardModel(fwd_model_uri)
        self._channel_counter = 0
        self._channel_is_busy_status: Dict[int, bool] = {}
        self._channel_buffer: Dict[int, Dict] = {}
        self._client_fwd.set_next_state_callback(self._on_next_game_state)
        self._environments: Dict[str, GymEnv] = {}

    async def connect(self):
        loop = asyncio.get_event_loop()

        client_fwd_connection = await self._client_fwd.connect()

        loop = asyncio.get_event_loop()
        loop.create_task(
            self._client_fwd._handle_messages(client_fwd_connection))

    async def close(self):
        await self._client_fwd.close()

    async def _on_next_game_state(self, state):
        channel = state.get("sequence_id")
        self._channel_is_busy_status[channel] = False
        self._channel_buffer[channel] = state

    def make(self, name: str, initial_state: Dict) -> GymEnv:
        if self._environments.get(name) is not None:
            raise Exception(
                f"environment \"{name}\" has already been instantiated")
        self._environments[name] = GymEnv(
            self._client_fwd, self._channel_counter,  initial_state, self._send_next_state)
        self._channel_counter += 1
        return self._environments[name]

    async def _send_next_state(self, state, actions, channel: int):
        self._channel_is_busy_status[channel] = True
        await self._client_fwd.send_next_state(channel, state, actions)
        while self._channel_is_busy_status[channel] == True:
            # TODO figure out why packets are not received without some sleep
            await asyncio.sleep(0.0001)
        result = self._channel_buffer[channel]
        del self._channel_buffer[channel]
        return result
