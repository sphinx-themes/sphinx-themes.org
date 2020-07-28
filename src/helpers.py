"""Helpers for all the automation.

This is imported by noxfile.py and the scripts it invokes.
"""

import json
import os
import shutil
import subprocess
from pathlib import Path
from types import SimpleNamespace

import virtualenv

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


class IsolatedEnvironment:
    """A helper class to make scripting with isolated environments easier.

    Inspired by nox's Session object.
    """

    def __init__(self, name):
        super().__init__()
        self.name = name
        self.path = VENV_PATH / name
        self.bin_paths = [self.path / "bin"]

        self.log(f"Creating virtualenv for {name} in {self.path}")
        virtualenv.cli_run([str(self.path)])

    def log(self, message):
        print(f"> {message}")

    def install(self, *args, **kwargs):
        self.run("pip", "install", *args, **kwargs)

    def run(self, *args):
        assert args
        self.log(" ".join(args))

        # Get the right executable
        path_location = os.pathsep.join(map(str, self.bin_paths))
        executable_path = shutil.which(args[0], path=path_location)

        command = (executable_path,) + args[1:]
        subprocess.run(command, stderr=subprocess.STDOUT, check=True)
