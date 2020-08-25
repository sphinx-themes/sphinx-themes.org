"""Render index.jinja2 using themes as input.
"""

import sys

sys.path.insert(0, "")
from src.helpers import BUILD_PATH, ROOT, load_themes


def main():
    from jinja2 import Template

    template_file = ROOT / "src" / "index.jinja2"
    template = Template(template_file.read_text())

    rendered = template.render(themes=load_themes())

    destination_file = BUILD_PATH / "index.html"
    destination_file.write_text(rendered)


if __name__ == "__main__":
    main()
