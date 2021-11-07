To do tests (compare game_state calculated by C++ agent with game_state calculated by python3 agent):

1. In file 'C++/game_state.hpp' uncoment line 
// #define _TEST_

2. In file 'python3/agent.py' add line (at the begining):
    import json
    
   and in function '_on_game_tick()' add line:
            print(f"TEST |{tick_number}|{json.dumps(game_state)}|")

3. In 'docker-compose.yml' uncomment agent-a section and change line
            service: python3-agent-dev
   to 
            service: cpp-agent
   Additionally, to generate more random results, it helps to comment lines:
                - PRNG_SEED=1234
   and
                - WORLD_SEED=1234

4. Run following code to generate test logs from 100 matches

for x in 0 1 2 3 4 5 6 7 8 9; do 
    for y in 0 1 2 3 4 5 6 7 8 9; do 
        sudo docker-compose up --abort-on-container-exit --force-recreate --build  2>&1 | tee C++/tests/logs/test${x}${y}.log
    done
done

5. In directory 'C++/tests' run 
    python test.py

   The script will compare logs from agent-a with logs from agent-b in all files '*.log' in 'logs' directory. In case of any difference script will stop and point the difference.
   Of course script ignore differences in whitespacies and order in lists and dirs.
