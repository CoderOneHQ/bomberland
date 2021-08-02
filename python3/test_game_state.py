import unittest
from game_state import GameState
from unittest import IsolatedAsyncioTestCase
from jsonschema import validate
import copy
import json


def copy_object(data):
    return copy.deepcopy(data)


def create_mock_tick_packet(tick_number, events):
    return{"type": "tick", "payload": {
        "tick": tick_number, "events": copy_object(events)}}


mock_state = {"agents": {"a": {"agent_id": "a", "unit_ids": ["c", "e", "g"]}, "b": {"agent_id": "b", "unit_ids": ["d", "f", "h"]}}, "unit_state": {"c": {"coordinates": [3, 10], "hp": 3, "inventory": {"bombs": 3}, "blast_diameter": 3, "unit_id": "c", "agent_id": "a", "invulnerability": 0}, "d": {"coordinates": [11, 10], "hp": 3, "inventory": {"bombs": 3}, "blast_diameter": 3, "unit_id": "d", "agent_id": "b", "invulnerability": 0}, "e": {"coordinates": [1, 9], "hp": 3, "inventory": {"bombs": 3}, "blast_diameter": 3, "unit_id": "e", "agent_id": "a", "invulnerability": 0}, "f": {"coordinates": [13, 9], "hp": 3, "inventory": {"bombs": 3}, "blast_diameter": 3, "unit_id": "f", "agent_id": "b", "invulnerability": 0}, "g": {"coordinates": [12, 7], "hp": 3, "inventory": {"bombs": 3}, "blast_diameter": 3, "unit_id": "g", "agent_id": "a", "invulnerability": 0}, "h": {"coordinates": [2, 7], "hp": 3, "inventory": {"bombs": 3}, "blast_diameter": 3, "unit_id": "h", "agent_id": "b", "invulnerability": 0}}, "entities": [{"created": 0, "x": 11, "y": 7, "type": "m"}, {"created": 0, "x": 3, "y": 7, "type": "m"}, {"created": 0, "x": 10, "y": 11, "type": "m"}, {"created": 0, "x": 4, "y": 11, "type": "m"}, {"created": 0, "x": 11, "y": 2, "type": "m"}, {"created": 0, "x": 3, "y": 2, "type": "m"}, {"created": 0, "x": 4, "y": 8, "type": "m"}, {"created": 0, "x": 10, "y": 8, "type": "m"}, {"created": 0, "x": 14, "y": 14, "type": "m"}, {"created": 0, "x": 0, "y": 14, "type": "m"}, {"created": 0, "x": 13, "y": 13, "type": "m"}, {"created": 0, "x": 1, "y": 13, "type": "m"}, {"created": 0, "x": 14, "y": 0, "type": "m"}, {"created": 0, "x": 0, "y": 0, "type": "m"}, {"created": 0, "x": 2, "y": 3, "type": "m"}, {"created": 0, "x": 12, "y": 3, "type": "m"}, {"created": 0, "x": 3, "y": 14, "type": "m"}, {"created": 0, "x": 11, "y": 14, "type": "m"}, {"created": 0, "x": 0, "y": 1, "type": "m"}, {"created": 0, "x": 14, "y": 1, "type": "m"}, {"created": 0, "x": 5, "y": 2, "type": "m"}, 
    {"created": 0, "x": 9, "y": 2, "type": "m"}, {"created": 0, "x": 9, "y": 6, "type": "m"}, {"created": 0, "x": 5, "y": 6, "type": "m"}, {"created": 0, "x": 11, "y": 13, "type": "m"}, {"created": 0, "x": 
    3, "y": 13, "type": "m"}, {"created": 0, "x": 2, "y": 10, "type": "m"}, {"created": 0, "x": 12, "y": 10, "type": "m"}, {"created": 0, "x": 2, "y": 13, "type": "m"}, {"created": 0, "x": 12, "y": 13, "type": "m"}, {"created": 0, "x": 12, "y": 6, "type": "m"}, {"created": 0, "x": 2, "y": 6, "type": "m"}, {"created": 0, "x": 1, "y": 10, "type": "m"}, {"created": 0, "x": 13, "y": 10, "type": "m"}, {"created": 0, "x": 1, "y": 6, "type": "m"}, {"created": 0, "x": 13, "y": 6, "type": "m"}, {"created": 0, "x": 9, "y": 12, "type": "m"}, {"created": 0, "x": 5, "y": 12, "type": "m"}, {"created": 0, "x": 1, "y": 0, "type": "m"}, {"created": 0, "x": 13, "y": 0, "type": "m"}, {"created": 0, "x": 14, "y": 2, "type": "m"}, {"created": 0, "x": 0, "y": 2, "type": "m"}, {"created": 0, "x": 10, "y": 1, "type": "m"}, {"created": 0, "x": 4, "y": 1, "type": "m"}, {"created": 0, "x": 11, "y": 8, "type": "m"}, {"created": 0, "x": 3, "y": 8, "type": "m"}, {"created": 0, "x": 0, "y": 6, "type": "m"}, {"created": 0, "x": 14, "y": 6, "type": "m"}, {"created": 0, "x": 12, "y": 5, "type": "m"}, {"created": 0, "x": 2, "y": 5, "type": "m"}, {"created": 0, "x": 1, "y": 3, "type": "w", "hp": 1}, {"created": 0, "x": 13, "y": 3, "type": "w", "hp": 1}, {"created": 0, "x": 1, "y": 8, "type": "w", "hp": 1}, {"created": 0, "x": 13, "y": 8, "type": "w", "hp": 1}, {"created": 0, "x": 0, "y": 8, "type": "w", "hp": 1}, {"created": 0, "x": 14, "y": 8, "type": "w", "hp": 1}, {"created": 0, "x": 6, "y": 3, "type": "w", "hp": 1}, {"created": 0, "x": 8, "y": 3, "type": "w", "hp": 1}, {"created": 0, "x": 6, "y": 1, "type": "w", "hp": 1}, {"created": 0, "x": 8, "y": 1, "type": "w", "hp": 1}, {"created": 0, "x": 9, "y": 1, "type": "w", "hp": 1}, {"created": 0, "x": 5, "y": 1, "type": "w", "hp": 1}, {"created": 0, "x": 13, "y": 14, "type": "w", "hp": 1}, {"created": 0, "x": 1, "y": 14, "type": "w", "hp": 1}, {"created": 0, "x": 5, "y": 9, "type": "w", "hp": 1}, {"created": 0, "x": 9, "y": 9, "type": "w", "hp": 1}, {"created": 0, "x": 3, "y": 1, "type": "w", "hp": 1}, {"created": 0, "x": 11, "y": 1, "type": "w", "hp": 1}, {"created": 0, "x": 13, "y": 11, "type": "w", "hp": 1}, {"created": 0, "x": 1, "y": 11, "type": "w", "hp": 1}, {"created": 0, "x": 8, "y": 12, "type": "w", "hp": 1}, {"created": 0, "x": 6, "y": 12, "type": "w", "hp": 1}, {"created": 0, "x": 14, "y": 3, "type": "w", "hp": 1}, {"created": 0, "x": 0, "y": 3, "type": "w", 
    "hp": 1}, {"created": 0, "x": 10, "y": 13, "type": "w", "hp": 1}, {"created": 0, "x": 4, "y": 13, "type": "w", "hp": 1}, {"created": 0, "x": 14, "y": 13, "type": "w", "hp": 1}, {"created": 0, "x": 0, "y": 13, "type": "w", "hp": 1}, {"created": 0, "x": 10, "y": 14, "type": "w", "hp": 1}, {"created": 0, "x": 4, "y": 14, "type": "w", "hp": 1}, {"created": 0, "x": 5, "y": 3, "type": "w", "hp": 1}, {"created": 0, "x": 9, "y": 3, "type": "w", "hp": 1}, {"created": 0, "x": 2, "y": 11, "type": "w", "hp": 1}, {"created": 0, "x": 12, "y": 11, "type": "w", "hp": 1}, {"created": 0, "x": 10, "y": 2, "type": "w", "hp": 1}, {"created": 0, "x": 4, "y": 2, "type": "w", "hp": 1}, {"created": 0, "x": 9, "y": 0, "type": "w", "hp": 1}, {"created": 0, "x": 5, "y": 0, "type": "w", "hp": 1}, {"created": 0, "x": 1, "y": 4, "type": "w", "hp": 1}, {"created": 0, "x": 13, "y": 4, "type": "w", "hp": 1}, {"created": 0, "x": 1, "y": 2, "type": "w", "hp": 1}, {"created": 0, "x": 13, "y": 2, "type": "w", "hp": 1}, {"created": 0, "x": 8, "y": 5, "type": "w", "hp": 1}, {"created": 0, "x": 6, "y": 5, "type": "w", "hp": 1}, {"created": 0, "x": 6, "y": 2, "type": "w", "hp": 1}, {"created": 0, "x": 8, "y": 2, "type": "w", "hp": 1}, {"created": 0, "x": 0, "y": 4, "type": "w", "hp": 1}, {"created": 0, "x": 14, "y": 4, "type": "w", "hp": 1}, {"created": 0, "x": 13, "y": 1, "type": "w", "hp": 1}, {"created": 0, "x": 1, "y": 1, "type": "w", "hp": 1}, {"created": 0, "x": 5, "y": 14, "type": "w", "hp": 1}, {"created": 0, "x": 9, "y": 14, "type": "w", "hp": 1}, {"created": 0, "x": 14, "y": 11, "type": "w", "hp": 1}, {"created": 0, "x": 0, "y": 11, "type": "w", "hp": 1}, {"created": 0, "x": 5, "y": 5, "type": "w", "hp": 1}, {"created": 0, "x": 9, "y": 5, "type": "w", "hp": 1}, {"created": 0, "x": 10, "y": 4, "type": "o", "hp": 3}, {"created": 0, "x": 4, "y": 4, "type": "o", "hp": 3}, {"created": 0, "x": 9, "y": 11, "type": "o", "hp": 3}, {"created": 0, "x": 5, "y": 11, "type": "o", "hp": 3}, {"created": 0, "x": 4, "y": 12, "type": "o", "hp": 3}, {"created": 0, "x": 10, "y": 12, "type": "o", "hp": 3}, {"created": 0, "x": 2, "y": 1, "type": "o", "hp": 3}, {"created": 0, "x": 12, "y": 1, "type": "o", "hp": 3}, {"created": 0, "x": 10, "y": 6, "type": "o", "hp": 3}, {"created": 0, "x": 4, "y": 6, "type": "o", "hp": 3}, {"created": 0, "x": 11, "y": 3, "type": "o", "hp": 3}, {"created": 0, "x": 3, "y": 3, "type": "o", "hp": 3}, {"created": 0, "x": 2, "y": 4, "type": "o", "hp": 3}, {"created": 0, "x": 12, "y": 4, "type": "o", "hp": 3}], "world": {"width": 15, "height": 15}, "tick": 0, "config": {"tick_rate_hz": 10, "game_duration_ticks": 1, "fire_spawn_interval_ticks": 5}, "connection": {"id": 2, "role": "agent", "agent_id": "b"}}

mock_state_packet = {"type": "game_state",
                     "payload": copy_object(mock_state)}


mock_tick_spawn_packet = create_mock_tick_packet(22, [
    {"type": "entity_spawned", "data": {"created": 22, "x": 7, "y": 3, "type": "a", "expires": 62, "hp": 1}}])

mock_tick_expired_packet = create_mock_tick_packet(62, [
    {"type": "entity_expired", "data": [7, 3]}])

mock_unit_state_payload = {"coordinates": [3, 10], "hp": 3, "inventory": {
    "bombs": 2}, "blast_diameter": 3, "unit_id": "c", "agent_id": "a", "invulnerability": 0}

mock_tick_unit_state_packet = create_mock_tick_packet(50, [{"type": "unit_state",
                                                            "data": mock_unit_state_payload}])


mock_tick_unit_action_packet = create_mock_tick_packet(
    5, [{"type": "unit", "agent_id": "a", "data": {"type": "move", "move": "right", "unit_id": "c"}}])


class TestGameState(IsolatedAsyncioTestCase):
    def setUp(self):
        self.client = GameState("")
        self.maxDiff = None

    def assert_object_equal(self, first, second):
        j1 = json.dumps(first, sort_keys=True, indent=4)
        j2 = json.dumps(second, sort_keys=True, indent=4)
        self.assertEqual(j1, j2)

    def test_mocks_are_valid_with_latest_schema(self):
        with open('validation.schema.json') as f:
            schema = json.load(f)
            validate(instance=mock_state_packet, schema=schema.get(
                "definitions").get("ValidServerPacket"))

            validate(instance=mock_tick_spawn_packet, schema=schema.get(
                "definitions").get("ValidServerPacket"))

            validate(instance=mock_tick_unit_action_packet, schema=schema.get(
                "definitions").get("ValidServerPacket"))

            validate(instance=mock_tick_unit_state_packet, schema=schema.get(
                "definitions").get("ValidServerPacket"))

    async def test_initial_game_state_constructor(self):
        self.assertTrue(self.client._state == None)
        self.assertTrue(self.client._connection_string == "")
        self.assertTrue(self.client._tick_callback == None)

    async def test_on_game_state_payload(self):
        await self.client._on_data(mock_state_packet)
        expected = copy_object(mock_state)
        self.assertEqual(self.client._state, expected)

    async def test_on_game_entity_spawn_packet(self):
        await self.client._on_data(copy_object(mock_state_packet))
        await self.client._on_data(copy_object(mock_tick_spawn_packet))
        expected = copy_object(mock_state)
        expected["entities"].append(
            {"created": 22, "x": 7, "y": 3, "type": "a", "expires": 62, "hp": 1})
        self.assert_object_equal(self.client._state, expected)

    async def test_on_game_entity_expired_packet(self):
        await self.client._on_data(copy_object(mock_state_packet))
        await self.client._on_data(copy_object(mock_tick_spawn_packet))
        await self.client._on_data(copy_object(mock_tick_expired_packet))
        expected = copy_object(mock_state)
        self.assert_object_equal(self.client._state, expected)

    async def test_on_unit_state_packet(self):
        await self.client._on_data(copy_object(mock_state_packet))
        await self.client._on_data(copy_object(mock_tick_unit_state_packet))
        expected = copy_object(mock_state)
        expected["unit_state"]["c"] = mock_unit_state_payload
        self.assert_object_equal(
            self.client._state, expected)

    async def test_on_unit_move_packet(self):
        await self.client._on_data(copy_object(mock_state_packet))
        await self.client._on_data(copy_object(mock_tick_unit_action_packet))
        expected = copy_object(mock_state)
        expected["unit_state"]["c"]["coordinates"] = [4, 10]
        self.assert_object_equal(
            self.client._state, expected)


if __name__ == '__main__':
    unittest.main()
