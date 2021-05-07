class Player:
    def __init__(self, player_id):
        self.id = player_id
        self.id_str = str(self.id)
        self.bombs = []

    def update_state(self, agent_state_input):
        agent_state = agent_state_input[self.id_str]

        self.x, self.y = agent_state["coordinates"]
        self.pos = (self.x, self.y)

        self.hp = agent_state["hp"]
        self.inventory = agent_state["inventory"]["bombs"]
        self.blast_diam = agent_state["blast_diameter"]
        self.invulnerability = agent_state["invulnerability"]

    def set_pos(self, pos):
        self.pos = pos
        self.x, self.y = pos

    def __str__(self):
        return f"Agent {self.id}: Pos: {self.pos}, HP:{self.hp}, #Bombs:{self.inventory}, Blast D:{self.blast_diam}, Invul Expires:{self.invulnerability}"

class GameObject:
    def __init__(self, json_entry):
        self.x = json_entry["x"]
        self.y = json_entry["y"]
        self.pos = (self.x, self.y)

class Ammo(GameObject):
    def __init__(self, json_entry):
        super().__init__(json_entry)
        self.expires = json_entry["expires"]

    def ttl(self, current_game_tick):
        return self.expires - current_game_tick

    def __str__(self):
        return f"Ammo: Pos:{self.pos}, Expires:{self.expires}"

class Bomb(GameObject):
    def __init__(self, json_entry):
        super().__init__(json_entry)
        self.owner = json_entry["owner"]
        self.expires = json_entry["expires"]
        self.hp = json_entry["hp"]
        self.blast_diam = json_entry["blast_diameter"]

    def ttl(self, current_game_tick):
        return self.expires - current_game_tick

    def __str__(self):
        return f"Bomb: Pos:{self.pos}, Owner:{self.owner}, Blast Diameter:{self.blast_diam}, Expires:{self.expires}, HP:{self.hp}"

class Blast(GameObject):
    def __init__(self, json_entry):
        super().__init__(json_entry)
        self.owner = None
        if "owner" in json_entry:
            self.owner = json_entry["owner"]
        self.expires = 5000
        if "expires" in json_entry:
            self.expires = json_entry["expires"]

    def ttl(self, current_game_tick):
        return self.expires - current_game_tick

    def __str__(self):
        return f"Blast: Pos:{self.pos}, Owner:{self.owner}, Expires:{self.expires}"


class Powerup(GameObject):
    def __init__(self, json_entry):
        super().__init__(json_entry)
        self.expires = json_entry["expires"]

    def ttl(self, current_game_tick):
        return self.expires - current_game_tick

    def __str__(self):
        return f"Powerup: Pos:{self.pos}, Expires:{self.expires}"

class Metal(GameObject):
    def __init__(self, json_entry):
        super().__init__(json_entry)

    def __str__(self):
        return f"Metal: Pos:{self.pos}"

class Ore(GameObject):
    def __init__(self, json_entry):
        super().__init__(json_entry)
        self.hp = json_entry["hp"]

    def __str__(self):
        return f"Ore: Pos:{self.pos}, HP:{self.hp}"


class Wood(GameObject):
    def __init__(self, json_entry):
        super().__init__(json_entry)
        self.hp = json_entry["hp"]

    def __str__(self):
        return f"Wood: Pos:{self.pos}, HP:{self.hp}"
