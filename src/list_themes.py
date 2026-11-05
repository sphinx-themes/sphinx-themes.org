"""Handles parsing and loading of themes."""

import rich

from helpers.themes import get_themes

if __name__ == "__main__":
    for theme in get_themes():
        rich.print(theme)
else:
    raise RuntimeError("This module is intended to be run as a script.")
