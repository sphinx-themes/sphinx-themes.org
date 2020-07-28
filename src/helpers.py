"""Helpers for all the automation.

This is imported by noxfile.py and the scripts it invokes.
"""

import json
from pathlib import Path
from types import SimpleNamespace

# Special directories and files
ROOT = Path(__file__).parent.parent.resolve()
VENV_PATH = ROOT / ".venv"
THEMES_FILE = ROOT / "themes.json"

BUILD_PATH = ROOT / "build"
RENDER_INFO_FILE = BUILD_PATH / "to-render.json"

PUBLIC_PATH = ROOT / "public"
CONF_PY_FILE = ROOT / "sample-docs" / "conf.py"


def load_themes():
    try:
        with THEMES_FILE.open() as f:
            data = json.load(f)
    except Exception as e:
        raise Exception("Could not load themes.json") from e

    themes = []
    for theme in data["themes"]:
        theme["name"] = get_theme_name(theme)
        themes.append(SimpleNamespace(**theme))
    return themes


def get_theme_name(theme):
    if theme["pypi"] != "sphinx":
        return theme["pypi"]
    return "default-" + theme["config"]
