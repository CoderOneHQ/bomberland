import asyncio
from typing import Dict
from gym import Gym
import os
import time

fwd_model_uri = os.environ.get(
    "FWD_MODEL_CONNECTION_STRING") or "ws://127.0.0.1:6969/?role=admin"

mock_6x6_state: Dict = {
  "game_id": "dev",
  "agents": {
    "a": { "agent_id": "a", "unit_ids": ["c", "e", "g"] },
    "b": { "agent_id": "b", "unit_ids": ["d", "f", "h"] }
  },
  "unit_state": {
    "c": {
      "coordinates": [0, 1],
      "hp": 3,
      "inventory": { "bombs": 3 },
      "blast_diameter": 3,
      "unit_id": "c",
      "agent_id": "a",
      "invulnerable": 0,
      "stunned": 0
    },
    "d": {
      "coordinates": [5, 1],
      "hp": 3,
      "inventory": { "bombs": 3 },
      "blast_diameter": 3,
      "unit_id": "d",
      "agent_id": "b",
      "invulnerable": 0,
      "stunned": 0
    },
    "e": {
      "coordinates": [3, 3],
      "hp": 3,
      "inventory": { "bombs": 3 },
      "blast_diameter": 3,
      "unit_id": "e",
      "agent_id": "a",
      "invulnerable": 0,
      "stunned": 0
    },
    "f": {
      "coordinates": [2, 3],
      "hp": 3,
      "inventory": { "bombs": 3 },
      "blast_diameter": 3,
      "unit_id": "f",
      "agent_id": "b",
      "invulnerable": 0,
      "stunned": 0
    },
    "g": {
      "coordinates": [2, 4],
      "hp": 3,
      "inventory": { "bombs": 3 },
      "blast_diameter": 3,
      "unit_id": "g",
      "agent_id": "a",
      "invulnerable": 0,
      "stunned": 0
    },
    "h": {
      "coordinates": [3, 4],
      "hp": 3,
      "inventory": { "bombs": 3 },
      "blast_diameter": 3,
      "unit_id": "h",
      "agent_id": "b",
      "invulnerable": 0,
      "stunned": 0
    }
  },
  "entities": [
    { "created": 0, "x": 0, "y": 3, "type": "m" },
    { "created": 0, "x": 5, "y": 3, "type": "m" },
    { "created": 0, "x": 4, "y": 3, "type": "m" },
    { "created": 0, "x": 1, "y": 3, "type": "m" },
    { "created": 0, "x": 3, "y": 5, "type": "m" },
    { "created": 0, "x": 2, "y": 5, "type": "m" },
    { "created": 0, "x": 5, "y": 4, "type": "m" },
    { "created": 0, "x": 0, "y": 4, "type": "m" },
    { "created": 0, "x": 1, "y": 1, "type": "w", "hp": 1 },
    { "created": 0, "x": 4, "y": 1, "type": "w", "hp": 1 },
    { "created": 0, "x": 3, "y": 0, "type": "w", "hp": 1 },
    { "created": 0, "x": 2, "y": 0, "type": "w", "hp": 1 },
    { "created": 0, "x": 5, "y": 5, "type": "w", "hp": 1 },
    { "created": 0, "x": 0, "y": 5, "type": "w", "hp": 1 },
    { "created": 0, "x": 4, "y": 0, "type": "w", "hp": 1 },
    { "created": 0, "x": 1, "y": 0, "type": "w", "hp": 1 },
    { "created": 0, "x": 5, "y": 0, "type": "w", "hp": 1 },
    { "created": 0, "x": 0, "y": 0, "type": "w", "hp": 1 }
  ],
  "world": { "width": 6, "height": 6 },
  "tick": 0,
  "config": {
    "tick_rate_hz": 10,
    "game_duration_ticks": 300,
    "fire_spawn_interval_ticks": 2
  }
}




def calculate_reward(state: Dict):
    # custom reward function
    return 1


async def main():
    gym = Gym(fwd_model_uri)
    for i in range(0,10):
        while True:
            try:
                await gym.connect()
            except:
                time.sleep(5)
                continue
            break
    
    env = gym.make("bomberland-open-ai-gym", mock_6x6_state)
    for i_ in range(1000):
        actions = []
        observation, done, info = await env.step(actions)
        reward = calculate_reward(observation)

        print(f"reward: {reward}, done: {done}, info: {info}")
        if done:
            await env.reset()
    await gym.close()


if __name__ == "__main__":
    asyncio.run(main())
