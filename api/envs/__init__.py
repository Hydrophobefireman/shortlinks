import os
import json
print(os.getcwd())
if os.path.isfile(".env.json"):
    with open(".env.json") as f:
        data = json.load(f)
    for k, v in data.items():
        os.environ[k] = v

