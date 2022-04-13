import json
from os import walk, path

log_dir = "./logs"
log_file_ends = ".log"

def comp(a, b) -> bool:
    if type(a) != type(b):
        print(f'{a} != {b}')
        return False
    if type(a) == str or type(a) == int:
        if a == b:
            return True
        else:
            print(f'{a} != {b}')
            return False
    elif type(a) == list:
        if len(a) != len(b):
            print(f'{a} != {b}')
            return False
        for x, y in zip(sorted(a, key=lambda x: x if type(x)!=dict else x['x']+x['y']*100), sorted(b, key=lambda x: x if type(x)!=dict else x['x']+x['y']*100)):
            if not comp(x, y):
                print(f'{x} != {y}')
                return False
        return True
    elif type(a) == dict:
        if not comp(list(a.keys()), list(b.keys())):
            print(f'{a.keys()} != {b.keys()}')
            return False
        for x in a.keys():
            if not comp(a.get(x), b.get(x)):
                print(f'key: {x} -> {a} != {b}')
                return False
        return True
    else:
        print(f'{a} != {b}')
        return False
    return True

def test_log(file: str) -> bool:
    with open(file, "r") as cin:
        r = [x.split("|") for x in cin.read().split('\n') if len(x.split("|")) > 2 and x.split("|")[0].find('agent-') >= 0]
    r = [x for x in r if x[1].find("TEST") >= 0]

    a = sorted([[int(x[2]), x[3]]  for x in r if x[0].find('agent-a') > 0], key=lambda x: x[0])
    b = sorted([[int(x[2]), x[3]]  for x in r if x[0].find('agent-b') > 0], key=lambda x: x[0])

    l = min(len(a), len(b))
    print(f'Test file "{file}" --> {l} steps')
    pol = {x[0]: [x[1], y[1]] for x, y in zip(a[:l], b[:l]) if x[0] == y[0]}

    for i, [a, b] in pol.items():
        aa = json.loads(a)
        bb = json.loads(b)
        aa['connection']['id'] = bb['connection']['id']
        aa['connection']['agent_id'] = bb['connection']['agent_id']
        if not comp(aa, bb):
            return False
    return True

files = []
for _, _, files in walk(log_dir):
    break
    
test_files = 0
for f in files:
    if not f.endswith(log_file_ends): continue
    file = path.join(log_dir, f)
    test_files += 1
    if not test_log(file):
        break

if test_files == 0:
    print(f'No "*{log_file_ends}" files in directory "{log_dir}"')