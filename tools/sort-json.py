import json
from pathlib import Path

path = Path("themes.json")

with path.open("r") as f:
    data = json.load(f)

data["themes"].sort(key=lambda x: x["pypi"].lower())

with path.open("w") as f:
    json.dump(data, f, indent=2)
    f.write("\n")
