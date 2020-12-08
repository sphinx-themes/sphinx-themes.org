"""Helpers for all the automation.

This is imported by noxfile.py and the scripts it invokes.
"""

import json
import logging
import os
import shutil
import subprocess
from pathlib import Path
from types import SimpleNamespace

logger = logging.getLogger("venv")

# Special directories and files
ROOT = Path(__file__).parent.parent.relative_to(Path(".").resolve())
VENV_PATH = ROOT / ".venv"
THEMES_FILE = ROOT / "themes.json"

TEMPLATE_IMAGE_FILE = ROOT / "src" / "template.png"

BUILD_PATH = ROOT / "build"
RENDER_INFO_FILE = BUILD_PATH / "to-render.json"

PUBLIC_PATH = ROOT / "public"
CONF_PY_TEMPLATE = ROOT / "sample-docs" / "conf.template.py"


def load_themes(*specific_allowed_names):
    try:
        with THEMES_FILE.open() as f:
            data = json.load(f)
    except Exception as e:
        raise Exception("Could not load themes.json") from e

    themes = []
    for theme in data["themes"]:
        theme["name"] = get_theme_name(theme)
        if not specific_allowed_names or theme["name"] in specific_allowed_names:
            themes.append(SimpleNamespace(**theme))

    if not themes:
        raise Exception("No themes match given names.")
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

    def create(self, *, delete=False):
        if self.path.exists() and not delete:
            assert all(path.exists() for path in self.bin_paths)
            return

        subprocess.check_output(["virtualenv", str(self.path)])

    def log(self, message):
        logger.info(message)

    def install(self, *args, **kwargs):
        self.run("pip", "install", *args, **kwargs)

    def run(self, *args, external=False, env={}):
        assert args
        self.log(" ".join(args))

        path_location = os.pathsep.join(map(str, self.bin_paths))
        executable_path = shutil.which(args[0], path=path_location)

        command = (executable_path,) + args[1:]

        try:
            subprocess.run(command, env=env, capture_output=True, check=True)
        except subprocess.CalledProcessError as e:
            print(" stdout ".center(80, "-"))
            print(e.stdout.decode().strip("\n") or "<nothing>")
            print(" stderr ".center(80, "-"))
            print(e.stderr.decode().strip("\n") or "<nothing>")
            print(" Error occurred ".center(80, "-"))
            print("Command:", " ".join(command))
            print("Exited with exit code:", e.returncode)
            print("-" * 80)
            raise


def _theme_config_to_source_lines(config):
    """Convert themes.json "config" keys into lines for conf.py

    `config` can either be a string or a dictionary. When it is a string, it
    maps to a dictionary with "html_theme" key.

    There are 3 special keys in the dictionary form:
    - _imports: a list of names, converted to "import name" statements.
    - _extensions: a list of names, appended to "extensions" list.
    - html_theme: name, automatically quoted in the final file.

    The rest of the dictionary are transformed and added into the file as-is.
    In other words, { "key": "value" } becomes a line "key = value" in the
    conf.py file.
    """
    if isinstance(config, str):
        config = {"html_theme": config}

    # Convert config into lines.
    config_lines = []

    # Imports
    imports = config.pop("_imports", [])
    for module in imports:
        config_lines.append(f"import {module}\n")

    # Extensions
    extensions = config.pop("_extensions", [])
    for ext in extensions:
        config_lines.append(f'extensions.append("{ext}")\n')

    # Theme
    html_theme = config.pop("html_theme")
    assert html_theme is not None, "really need html_theme to be provided via config"
    config_lines.append(f'html_theme = "{html_theme}"\n')

    # Everything else
    for key, value in config.items():
        config_lines.append(f"{key} = {value}\n")

    return config_lines


def generate_sphinx_config_for(theme, *, at):
    """Generate the Sphinx configuration file for this theme.
    """
    config_lines = _theme_config_to_source_lines(theme.config)

    with CONF_PY_TEMPLATE.open() as f:
        lines = f.readlines()

    replace_from = lines.index("# !! MARKER !!\n") + 1  # Find the marker we replace.
    lines[replace_from:] = config_lines

    with (at / "conf.py").open("w") as f:
        f.writelines(lines)
