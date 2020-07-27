import json
from pathlib import Path


def sort_key(theme):
    if theme["pypi"] is not None:
        return theme["pypi"]

    # Get alabaster on top.
    if theme["config"] == "alabaster":
        return ""

    # All other builtin themes go at the end.
    #     "~" is *last* in sort order for `string.printables`.
    return "~" + theme["display"]


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
