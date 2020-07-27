"""Render index.jinja2 using themes as input.
"""

import json
from pathlib import Path
from jinja2 import Template

_root = Path(__file__).parent.parent
TEMPLATE_FILE = _root / "src" / "index.jinja2"
DESTINATION_FILE = _root / "public" / "index.html"
THEME_JSON = _root / "themes.json"


def load_themes():
    with THEME_JSON.open() as f:
        return json.load(f)["themes"]


def main():
    template = Template(TEMPLATE_FILE.read_text())
    contents = template.render(themes=load_themes())
    DESTINATION_FILE.write_text(contents)

if __name__ == "__main__":
    main()
