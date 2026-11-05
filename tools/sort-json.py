from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from helpers.constants import ThemeDict

# Only edit this if you're @pradyunsg or @shirou.
_FEATURED = [
    "alabaster",
    "sphinx-rtd-theme",
    "furo",
    "shibuya",
    "sphinx-book-theme",
    "pydata-sphinx-theme",
    "piccolo-theme",
    "insipid-sphinx-theme",
]


_canonicalize_regex = re.compile(r"[-_.]+")


def canonicalize_name(name: str) -> str:
    return _canonicalize_regex.sub("-", name).lower()


def _get_index_or_default[T](li: list[T], value: object, *, default: int) -> int:
    try:
        return li.index(value)  # ty: ignore[invalid-argument-type]
    except ValueError:
        return default


def sort_key(theme: ThemeDict) -> tuple[int, str]:
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


def validate_display_names(data: dict[str, list[ThemeDict]]) -> None:
    bad: set[str] = set()
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


def get_allowed_tags() -> set[str]:
    template = Path(__file__).resolve().parents[1] / "src/templates/index.template.html"
    tags_match = re.search(
        r"{%\s*set tags\s*=\s*(\[.*?\])\s*%}", template.read_text(), re.DOTALL
    )
    assert tags_match is not None, "Missing tag list in index.template.html"
    return set(json.loads(tags_match.group(1)))


def validate_tags(data: dict[str, list[ThemeDict]]) -> None:
    allowed_tags = get_allowed_tags()
    bad: list[str] = []
    for theme in data["themes"]:
        tags = theme.get("tags", [])
        if not isinstance(tags, list) or any(
            not isinstance(tag, str) or tag not in allowed_tags for tag in tags
        ):
            bad.append(f"Invalid tags for {theme['display']!r}: {tags!r}")
        elif len(tags) != len(set(tags)):
            bad.append(f"Duplicate tags for {theme['display']!r}: {tags!r}")

    if bad:
        print("FATAL: " + "\n".join(bad), file=sys.stderr)
        print(f"Allowed tags: {', '.join(sorted(allowed_tags))}", file=sys.stderr)
        sys.exit(1)


def main() -> None:
    path = Path("themes.json")

    with path.open("r") as f:
        data = json.load(f)

    validate_display_names(data)
    validate_tags(data)
    data["themes"].sort(key=sort_key)
    for theme in data["themes"]:
        if "tags" in theme:
            theme["tags"].sort(key=str.casefold)

    with path.open("w") as f:
        json.dump(data, f, sort_keys=True, indent=2)
        f.write("\n")


if __name__ == "__main__":
    main()
