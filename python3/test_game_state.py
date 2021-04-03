import unittest
from game_state import GameState


class TestGameState(unittest.TestCase):
    def setUp(self):
        self.client = GameState("")

    def test_initial_game_state_is_none(self):
        self.assertTrue(self.client._state == None)


if __name__ == '__main__':
    unittest.main()
