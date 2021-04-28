"""Generate the main site, other than the theme-specific generated pages."""

import shutil

from jinja2 import Template

from .constants import BUILD, DESTINATION, TEMPLATES
from .themes import get_themes


def main():
    # Render index.html
    template = Template(TEMPLATES["index.html"].read_text())
    rendered = template.render(themes=get_themes())
    DESTINATION["index.html"].write_text(rendered)

    # Copy the assets
    for file in BUILD["assets"].iterdir():
        shutil.copy(file, DESTINATION["assets"])

    DESTINATION["CNAME"].write_text("sphinx-themes.org")


if __name__ == "__main__":
    main()
