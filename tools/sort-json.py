import json
from pathlib import Path


def sort_key(theme):
    one = theme["pypi"] or ""
    two = theme["config"]
    return one.lower(), two.lower()


def main():
    path = Path("themes.json")

    with path.open("r") as f:
        data = json.load(f)

    data["themes"].sort(key=sort_key)

    with path.open("w") as f:
        json.dump(data, f, indent=2)
        f.write("\n")

if __name__ == "__main__":
    main()
