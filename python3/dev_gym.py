import asyncio
from gym import Gym
import os

fwd_model_uri = os.environ.get(
    "FWD_MODEL_CONNECTION_STRING") or "ws://127.0.0.1:6969/?role=admin"


async def main():
    gym = Gym(fwd_model_uri)
    env = gym.make("bomberland-open-ai-gym")
    observation = env.reset()
    for _ in range(1000):
        actions = []
        observation, reward, done, info = env.step(actions)

        if done:
            observation = env.reset()
    await env.close()

loop = asyncio.get_event_loop()
tasks = [
    asyncio.ensure_future(main()),
]
loop.run_until_complete(asyncio.wait(tasks))
