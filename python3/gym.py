from forward_model import ForwardModel
import json


class GymEnv:
    def __init__(self, fwd_model: ForwardModel):
        self._fwd = fwd_model
        self._sequenceId = 0

    async def reset(self):
        print("resetting")

    async def step(self, actions):
        print("stepping with actions:{}".format(
            json.dumps(actions, separators=(',', ':'))))
        self._fwd.send_next_state()
        return [1, 2, 3, 4]

    async def close(self):
        print("closing")
        await self._fwd.close()


class Gym:
    def __init__(self, fwd_model_connection_string: str):
        self._client_fwd = ForwardModel(fwd_model_connection_string)

    def make(self, name: str) -> GymEnv:
        return GymEnv(self._client_fwd)
