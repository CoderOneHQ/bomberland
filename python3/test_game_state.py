import unittest
from game_state import GameState
from unittest import IsolatedAsyncioTestCase
import copy
import json

mock_state = {"agentState": {"0": {"coordinates": [6, 7], "hp": 3, "inventory": {"bombs": 3}, "blast_diameter": 3, "number": 0, "invulnerability": 0}, "1": {"coordinates": [6, 6], "hp": 3, "inventory": {"bombs": 3}, "blast_diameter": 3, "number": 1, "invulnerability": 0}}, "entities": [{"x": 8, "y": 4, "type": "m"}, {"x": 2, "y": 5, "type": "m"}, {"x": 2, "y": 6, "type": "m"}, {"x": 2, "y": 7, "type": "m"}, {"x": 1, "y": 5, "type": "m"}, {"x": 6, "y": 8, "type": "m"}, {"x": 4, "y": 4, "type": "m"}, {"x": 8, "y": 6, "type": "m"}, {"x": 3, "y": 3, "type": "m"}, {"x": 0, "y": 5, "type": "m"}, {"x": 8, "y": 2, "type": "m"}, {"x": 1, "y": 8, "type": "m"}, {"x": 2, "y": 2, "type": "m"}, {"x": 5, "y": 6, "type": "m"}, {"x": 3, "y": 0, "type": "m"}, {"x": 2, "y": 8, "type": "m"}, {"x": 8, "y": 1, "type": "m"}, {
    "x": 6, "y": 2, "type": "w"}, {"x": 2, "y": 3, "type": "w"}, {"x": 3, "y": 5, "type": "w"}, {"x": 7, "y": 6, "type": "w"}, {"x": 4, "y": 3, "type": "w"}, {"x": 0, "y": 3, "type": "w"}, {"x": 5, "y": 3, "type": "w"}, {"x": 3, "y": 2, "type": "w"}, {"x": 5, "y": 5, "type": "w"}, {"x": 8, "y": 7, "type": "w"}, {"x": 3, "y": 7, "type": "w"}, {"x": 1, "y": 7, "type": "w"}, {"x": 4, "y": 0, "type": "w"}, {"x": 3, "y": 6, "type": "w"}, {"x": 0, "y": 0, "type": "w"}, {"x": 7, "y": 5, "type": "w"}, {"x": 3, "y": 4, "type": "w"}, {"x": 0, "y": 8, "type": "w"}, {"x": 8, "y": 3, "type": "w"}, {"x": 6, "y": 0, "type": "w"}, {"x": 1, "y": 4, "type": "o"}, {"x": 0, "y": 4, "type": "o"}, {"x": 3, "y": 8, "type": "o"}, {"x": 0, "y": 2, "type": "o"}, {"x": 4, "y": 7, "type": "o"}], "world": {"width": 9, "height": 9}, "connection": {"id": 7, "role": "agent", "agentNumber": 0}}

mock_state_packet = {"type": "game_state",
                     "payload": mock_state}

mock_tick_spawn = {"tick": 33, "events": [
    {"type": "entity_spawned", "data": {"x": 5, "y": 4, "type": "a", "expires": 73}}]}

mock_tick_spawn_packet = {
    "type": "tick", "payload": mock_tick_spawn}


def copy_object(data):
    return copy.deepcopy(data)


class TestGameState(IsolatedAsyncioTestCase):
    def setUp(self):
        self.client = GameState("")
        self.maxDiff = None

    def assertJsonEqual(self, first, second, msg=None):
        j1 = json.dumps(first, sort_keys=True, indent=4)
        j2 = json.dumps(second, sort_keys=True, indent=4)
        self.assertEqual(j1, j2, msg)

    async def test_initial_game_state_constructor(self):
        self.assertTrue(self.client._state == None)
        self.assertTrue(self.client._connection_string == "")
        self.assertTrue(self.client._generate_agent_action_callback == None)

    def test_on_game_state_payload(self):
        self.client._on_data(mock_state_packet)
        self.assertEqual(self.client._state, mock_state)

    def test_on_game_entity_spawn_payload(self):
        self.client._on_data(copy_object(mock_state_packet))
        self.client._on_data(copy_object(mock_tick_spawn_packet))
        expected = copy_object(mock_state)
        expected["entities"].append(
            {"x": 5, "y": 4, "type": "a", "expires": 73})
        self.assertJsonEqual(self.client._state, expected)


if __name__ == '__main__':
    unittest.main()