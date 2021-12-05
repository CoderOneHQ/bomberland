import asyncio
from typing import Dict
from forward_model import ForwardModel


class GymEnv():
    def __init__(self, fwd_model: ForwardModel):
        self._fwd = fwd_model


class Gym():
    def __init__(self, fwd_model_uri: str):
        self._client_fwd = ForwardModel(fwd_model_uri)

        self._client_fwd.set_next_state_callback(self._on_next_game_state)
        self.connect()
        self._environments: Dict[str, GymEnv] = {}

    def connect(self):
        loop = asyncio.get_event_loop()

        client_fwd_connection = loop.run_until_complete(
            self._client_fwd.connect())

        loop = asyncio.get_event_loop()
        loop.create_task(
            self._client_fwd._handle_messages(client_fwd_connection))
        loop.run_forever()

    async def _send_eval_next_state(self):
        actions = [
            {
                "action": {"move": "right", "type": "move"},
                "agent_number": 0,
            }, {
                "action": {"move": "left", "type": "move"},
                "agent_number": 1,
            }
        ]
        await self._client_fwd.send_next_state(1, self._client._state, actions)

    async def _on_next_game_state(self, state):
        print(state)
        pass

    def make(self, name: str, initial_state: Dict) -> GymEnv:
        if self._environments.get(name) is not None:
            raise Exception(
                f"environment \"{name}\" has already been instantiated")
        self._environments[name] = GymEnv(initial_state)
        return self._environments[name]
