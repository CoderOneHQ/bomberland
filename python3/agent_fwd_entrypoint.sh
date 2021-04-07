python3 agent_fwd.py & p1=$!
/app/game-server & p2=$!

wait -n
[ "$?" -gt 1 ] || kill "$p1" "$p2"
wait