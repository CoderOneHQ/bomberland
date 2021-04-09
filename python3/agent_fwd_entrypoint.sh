#!/bin/bash
{ python3 agent_fwd.py; } &
{ /game-server; } &
wait -n
pkill -P $$