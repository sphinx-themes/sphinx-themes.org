"""Render sample-docs/ with theme described in build/to-render.json
"""

from pathlib import Path
import os
import sys
import shutil
import subprocess

import virtualenv


TO_RENDER = Path("build") / "to-render.json"
CONF_PY_FILE = Path("sample-docs") / "conf.py"


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
        virtualenv.cli_run([str(self.virtualenv), "--clear"])

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
def _patch_conf_file(theme):
    with CONF_PY_FILE.open() as f:
        lines = f.readlines()

    for i, line in enumerate(lines[:]):
        if line.startswith("html_theme = "):
            line = f'html_theme = "{theme.config}"\n'
        elif line.startswith("html_theme_options = "):
            line = f"html_theme_options = {theme.options!r}\n"

        lines[i] = line

    with CONF_PY_FILE.open("w") as f:
        f.writelines(lines)


def render(theme):
    session = Session(theme.name)
    session.install("sphinx")
    if theme.pypi is not None:
        session.install(theme.pypi)

    _patch_conf_file(theme)

    session.run(
        "sphinx-build", "-v", "-b", "html", "sample-docs", str(Path("build") / theme.name),
    )


if __name__ == "__main__":
    import ast
    from types import SimpleNamespace

    di = ast.literal_eval(TO_RENDER.read_text())
    assert isinstance(di, dict)

    theme = SimpleNamespace(**di)
    try:
        render(theme)
    except subprocess.SubprocessError:
        sys.exit(1)
