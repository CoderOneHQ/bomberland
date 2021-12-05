from forward_model import ForwardModel

mock_6x6_state = {"units": [{"coordinates": [0, 1], "hp":3, "inventory":{"bombs": 3}, "blast_diameter": 3, "unit_id": "c", "agent_id": "a", "invulnerability": 0}, {"coordinates": [5, 1], "hp":3, "inventory":{"bombs": 3}, "blast_diameter": 3, "unit_id": "d", "agent_id": "b", "invulnerability": 0}, {"coordinates": [3, 3], "hp":3, "inventory":{"bombs": 3}, "blast_diameter": 3, "unit_id": "e", "agent_id": "a", "invulnerability": 0}, {"coordinates": [2, 3], "hp":3, "inventory":{"bombs": 3}, "blast_diameter": 3, "unit_id": "f", "agent_id": "b", "invulnerability": 0}, {"coordinates": [2, 4], "hp":3, "inventory":{"bombs": 3}, "blast_diameter": 3, "unit_id": "g", "agent_id": "a", "invulnerability": 0}, {"coordinates": [3, 4], "hp":3, "inventory":{"bombs": 3}, "blast_diameter": 3, "unit_id": "h", "agent_id": "b", "invulnerability": 0}], "entities": [
    {"created": 0, "x": 0, "y": 3, "type": "m"}, {"created": 0, "x": 5, "y": 3, "type": "m"}, {"created": 0, "x": 4, "y": 3, "type": "m"}, {"created": 0, "x": 1, "y": 3, "type": "m"}, {"created": 0, "x": 3, "y": 5, "type": "m"}, {"created": 0, "x": 2, "y": 5, "type": "m"}, {"created": 0, "x": 5, "y": 4, "type": "m"}, {"created": 0, "x": 0, "y": 4, "type": "m"}, {"created": 0, "x": 1, "y": 1, "type": "w", "hp": 1}, {"created": 0, "x": 4, "y": 1, "type": "w", "hp": 1}, {"created": 0, "x": 3, "y": 0, "type": "w", "hp": 1}, {"created": 0, "x": 2, "y": 0, "type": "w", "hp": 1}, {"created": 0, "x": 5, "y": 5, "type": "w", "hp": 1}, {"created": 0, "x": 0, "y": 5, "type": "w", "hp": 1}, {"created": 0, "x": 4, "y": 0, "type": "w", "hp": 1}, {"created": 0, "x": 1, "y": 0, "type": "w", "hp": 1}, {"created": 0, "x": 5, "y": 0, "type": "w", "hp": 1}, {"created": 0, "x": 0, "y": 0, "type": "w", "hp": 1}]}


class GymEnv:
    def __init__(self, fwd_model: ForwardModel):
        self._client_fwd = fwd_model

    def reset(self):
        print("resetting")

    def step(self, action):
        print("stepping")
        return [1, 2, 3, 4]


class Gym:
    def __init__(self, fwd_model_connection_string: str):
        self._client_fwd = ForwardModel(fwd_model_connection_string)

    def make(self, name: str) -> GymEnv:
        return GymEnv(self._client_fwd)
