import json
import re
import sys
from pathlib import Path

# Only edit this if you're @pradyunsg or @shirou.
# Featured themes are sorted by popularity (i.e. GitHub stars).
_FEATURED = [
    "sphinx-rtd-theme",
    "furo",
    "alabaster",
    "pydata-sphinx-theme",
    "sphinx-book-theme",
    "shibuya",
    "sphinx-immaterial",
    "sphinx-press-theme",
    "piccolo-theme",
    "insegel",
    "insipid-sphinx-theme",
]


_canonicalize_regex = re.compile(r"[-_.]+")


def canonicalize_name(name):
    return _canonicalize_regex.sub("-", name).lower()


def _get_index_or_default(li, value, *, default):
    try:
        return li.index(value)
    except ValueError:
        return default


def sort_key(theme):
    """Sort themes as "featured", "general", built-in."""
    # Normalize names
    theme["pypi"] = canonicalize_name(theme["pypi"])

    if theme["pypi"] == "sphinx":
        rank = _get_index_or_default(
            _FEATURED,
            theme["config"],
            default=len(_FEATURED) + 1,
        )
    else:
        rank = _get_index_or_default(
            _FEATURED,
            theme["pypi"],
            default=len(_FEATURED),
        )

    return (rank, theme["display"])


def validate_display_names(data):
    bad = set()
    for theme in data["themes"]:
        if theme["pypi"] == "sphinx":
            continue

        name = theme["display"].lower()
        if "sphinx" in name or "theme" in name:
            bad.add(f"display: {theme['display']}, pypi: {theme['pypi']}")

    if bad:
        bad_names = "\n".join(sorted(bad))
        print(
            f"FATAL: Got improper `display` values for packages:\n{bad_names}",
            file=sys.stderr,
        )
        print(
            "Don't include the words 'sphinx' and 'theme' in the display. "
            'It is in a "Sphinx Themes Gallery" already.'
        )
        sys.exit(1)


def main():
    path = Path("themes.json")

    with path.open("r") as f:
        data = json.load(f)

    validate_display_names(data)
    data["themes"].sort(key=sort_key)

    with path.open("w") as f:
        json.dump(data, f, sort_keys=True, indent=2)
        f.write("\n")


if __name__ == "__main__":
    main()
