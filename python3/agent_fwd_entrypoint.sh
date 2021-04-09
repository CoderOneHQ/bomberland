#!/bin/bash
export ENV TELEMETRY_ENABLED=0
{ python3 agent_fwd.py; } &
{ /game-server; } &
wait -n
pkill -P $$