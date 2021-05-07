from game_state import GameState
import random
from game_objects import Player, Bomb, Blast, Ammo, Powerup, Wood, Ore, Metal

_VER_STRING = "Test Bot"

ALL_ACTIONS = ["up", "down", "left", "right", "bomb", "detonate", None]
ALL_OBJECT_TYPES = ["blast", "my_bomb", "opp_bomb", "ammo", "powerup", "wood", "ore", "metal"]
MOVE_DICT = {"right": (1, 0), "left": (-1, 0), "down": (0, -1), "up": (0, 1), None: (0, 0)}

_WORLD_WIDTH, _WORLD_HEIGHT = 9, 9
in_bounds = lambda pos: pos[0] >= 0 and pos[0] < _WORLD_WIDTH and pos[1] >= 0 and pos[1] < _WORLD_HEIGHT


class MyBot():
    def __init__(self, game_state_reference):
        self.id = None
        self.opp_id = None
        self.game_state_reference = game_state_reference

        self.all_objects = {}

        self.parsed_game_tick = -1

        print(_VER_STRING)

    def choose_action(self, tick_number, game_state):
        self._parse_game_state(tick_number, game_state)

        """
        ########################################
        ### Start Decision-Making Logic here ###
        ########################################
        """
        print(self.player) # print player's current status

        valid_actions = self.get_valid_actions(ALL_ACTIONS)
        print(valid_actions)
        chosen_action = random.choice(valid_actions)
        if chosen_action == "detonate": # has to return "detonate" and the bomb's position
            bomb_to_detonate = random.choice(self.player.bombs)
            return "detonate", bomb_to_detonate.pos
        return chosen_action


        """
        ########################################
        ### End of Choose Action             ###
        ########################################
        """

    def get_valid_actions(self, all_actions):
        valid_actions = list(all_actions) # make a copy
        for action in all_actions:
            if action is None:
                continue
            if action in ["up", "down", "left", "right"]:
                delta_pos = MOVE_DICT[action]
                new_pos = (self.player.pos[0]+delta_pos[0], self.player.pos[1]+delta_pos[1])
                if not in_bounds(new_pos): # NOTE: you can add additional logic to check if tiles are empty, to determine if move action is valid
                    valid_actions.remove(action)
            if action == "bomb":
                if self.player.inventory == 0 or self.player.pos in [bomb.pos for bomb in self.player.bombs]: # no more bombs OR already on a bomb
                    valid_actions.remove(action) # remove bomb action
            if action == "detonate":
                if len(self.player.bombs) == 0: # no bombs to detonate
                    valid_actions.remove(action) # remove detonate action
        return valid_actions


    def _parse_game_state(self, tick_number, game_state):
        # Run once, if player is freshly initialized
        if self.id is None:
            self.id     = game_state["connection"]["agent_number"]
            self.opp_id = (1-self.id) # if id and opp_id are either 0 or 1 respectively
            self.player = Player(player_id=self.id)
            self.opp    = Player(player_id=self.opp_id)

        self.game_state_reference = game_state
        self.game_tick = tick_number

        self.player.update_state(game_state["agent_state"])
        self.opp.update_state(game_state["agent_state"])

        self._parse_entities(game_state)


    def _parse_entities(self, game_state):
        entities = game_state["entities"]
        self.player.bombs, self.opp.bombs = [], []
        self.all_objects = {k:[] for k in ALL_OBJECT_TYPES}
        for e in entities:
            if e["type"] == "x": #blast
                new_object = Blast(e)
                new_object_type = "blast"
            elif e["type"] == "b": #bomb
                new_object = Bomb(e)
                if new_object.owner == self.id:
                    new_object_type = "my_bomb"
                    self.player.bombs.append(new_object)
                else:
                    new_object_type = "opp_bomb"
                    self.opp.bombs.append(new_object)
            elif e["type"] == "a": #ammo
                new_object = Ammo(e)
                new_object_type = "ammo"
            elif e["type"] == "bp": #powerup
                new_object = Powerup(e)
                new_object_type = "powerup"
            elif e["type"] == "w": #wood
                new_object = Wood(e)
                new_object_type = "wood"
            elif e["type"] == "o": #ore
                new_object = Ore(e)
                new_object_type = "ore"
            elif e["type"] == "m": #metal
                new_object = Metal(e)
                new_object_type = "metal"
            self.all_objects[new_object_type].append(new_object)
