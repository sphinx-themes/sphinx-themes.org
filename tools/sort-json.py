import json
import re
from pathlib import Path

_canonicalize_regex = re.compile(r"[-_.]+")


def canonicalize_name(name):
    return _canonicalize_regex.sub("-", name).lower()


def _get_index_or_default(li, value, *, default):
    try:
        return li.index(value)
    except ValueError:
        return default


def sort_key(theme):
    # Normalize names
    theme["pypi"] = canonicalize_name(theme["pypi"])

    # Determine the "rank" of a theme. Approximately ordered as:
    # - featured
    # - third-party themes
    # - default themes
    featured = ["alabaster", "classic", "furo", "sphinx-rtd-theme"]
    if theme["pypi"] == "sphinx":
        rank = _get_index_or_default(
            featured, theme["config"], default=len(featured) + 1
        )
    else:
        rank = _get_index_or_default(featured, theme["pypi"], default=len(featured))

    return (rank, theme["pypi"])


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
