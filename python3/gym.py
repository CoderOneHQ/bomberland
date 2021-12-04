from forward_model import ForwardModel

class GymEnv:
    def __init__(self, fwd_model: ForwardModel):
        self._client_fwd = fwd_model

    def reset(self):
        print("resetting")

    def step(self, action):
        print("stepping")

class Gym:
    def __init__(self, fwd_model_connection_string: str):
        self._client_fwd = ForwardModel(fwd_model_connection_string)

    def make(self,name:str) -> GymEnv:
        return GymEnv(self._client_fwd)