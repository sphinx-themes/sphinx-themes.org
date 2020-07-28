"""Render sample-docs/ with theme described in build/to-render.json
"""

import os
import shutil
import subprocess
import sys
from pathlib import Path

import virtualenv

sys.path.insert(0, "")
from src.helpers import CONF_PY_FILE, RENDER_INFO_FILE


def log(message):
    print(f"> {message}")


class Session:
    """Mimic nox's session object!
    """

    def __init__(self, name):
        super().__init__()
        self.name = name
        self.virtualenv = Path(".venv") / name
        self.bin_paths = [self.virtualenv / "bin"]

        log(f"Creating virtualenv for {name} in {self.virtualenv}")
        virtualenv.cli_run([str(self.virtualenv)])

    def install(self, *args, **kwargs):
        self.run("pip", "install", *args, **kwargs)

    def run(self, *args):
        assert args
        log(" ".join(args))

        # Get the right executable
        path_location = os.pathsep.join(map(str, self.bin_paths))
        executable_path = shutil.which(args[0], path=path_location)

        command = (executable_path,) + args[1:]
        subprocess.run(command, stderr=subprocess.STDOUT, check=True)


#
# Actual logic
#
def _config_to_lines(config):
    """

    This is where there's a lot of complexity in this module. We allow
    theme.config to either be a string (mapping directly to html_theme) or
    to be a dictionary.

    There are 3 special keys:
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


def _patch_conf_file(theme):
    """Patch the configuration file for this theme.
    """
    config_lines = _config_to_lines(theme.config)

    # Actually manipulate the file.
    with CONF_PY_FILE.open() as f:
        lines = f.readlines()

    # Find the marker we replace after.
    index = lines.index("# !! MARKER !!\n")
    lines[index + 1 :] = config_lines

    with CONF_PY_FILE.open("w") as f:
        f.writelines(lines)


def render(theme):
    session = Session(theme.name)
    session.install("sphinx")
    if theme.pypi != "sphinx":
        session.install(theme.pypi)

    _patch_conf_file(theme)

    session.run(
        "sphinx-build",
        "-v",
        "-b",
        "html",
        "sample-docs",
        str(Path("build") / theme.name),
    )


if __name__ == "__main__":
    import ast
    import sys
    from types import SimpleNamespace

    di = ast.literal_eval(RENDER_INFO_FILE.read_text())
    assert isinstance(di, dict)
    assert di["name"] == sys.argv[1]  # check that file contents match invocation

    theme = SimpleNamespace(**di)
    try:
        render(theme)
    except subprocess.SubprocessError:
        print(CONF_PY_FILE.read_text())
        sys.exit(1)
