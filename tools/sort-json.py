import json
import re
from pathlib import Path

_canonicalize_regex = re.compile(r"[-_.]+")


def canonicalize_name(name):
    return _canonicalize_regex.sub("-", name).lower()


def sort_key(theme):
    # Normalize names
    theme["pypi"] = canonicalize_name(theme["pypi"])

    if theme["pypi"] == "sphinx":
        # Get alabaster first.
        if theme["config"] == "alabaster":
            return ""
        # All other builtin themes go at the end.
        #     "~" is *last* in sort order for `string.printables`.
        return "~" + theme["display"]

    # Get Sphinx-RTD-theme second.
    if theme["pypi"] == "sphinx-rtd-theme":
        return "1"

    # Third party themes in the middle.
    return theme["pypi"]


def main():
    path = Path("themes.json")

    with path.open("r") as f:
        data = json.load(f)

    data["themes"].sort(key=sort_key)

    with path.open("w") as f:
        json.dump(data, f, sort_keys=True, indent=2)
        f.write("\n")


if __name__ == "__main__":
    main()
