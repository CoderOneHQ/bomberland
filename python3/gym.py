from forward_model import ForwardModel


class Gym:
    def __init__(self, fwd_model_connection_string: str):
        self._client_fwd = ForwardModel(fwd_model_connection_string)

    def make(self,name:str):
        print(name)