"""Render index.jinja2 using themes as input.
"""

import json
from pathlib import Path
from types import SimpleNamespace

from jinja2 import Template

_root = Path(__file__).parent.parent
TEMPLATE_FILE = _root / "src" / "index.jinja2"
DESTINATION_FILE = _root / "public" / "index.html"
THEME_JSON = _root / "themes.json"


def _load_themes():
    try:
        with THEME_JSON.open() as f:
            data = json.load(f)
    except Exception as e:
        raise Exception("Could not load themes.json") from e

    themes = []
    for theme in data["themes"]:
        theme["name"] = theme["pypi"] or ("default-" + theme["config"])
        themes.append(SimpleNamespace(**theme))
    return themes


def main():
    template = Template(TEMPLATE_FILE.read_text())
    contents = template.render(themes=_load_themes())
    DESTINATION_FILE.write_text(contents)


if __name__ == "__main__":
    main()
