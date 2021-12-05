from gym import Gym
import os

fwd_model_uri = os.environ.get(
    "FWD_MODEL_CONNECTION_STRING") or "ws://127.0.0.1:6969/?role=admin"

gym = Gym(fwd_model_uri)
env = gym.make("bomberland-open-ai-gym")
observation = env.reset()
for _ in range(1000):
    actions = []
    observation, reward, done, info = env.step(actions)

    if done:
        observation = env.reset()
env.close()
