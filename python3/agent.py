from game_state import GameState

uri = "ws://127.0.0.1:3000/?role=agent&agentId=agentId&name=defaultName"


def main():
    g = GameState(uri)


if __name__ == "__main__":
    main()
