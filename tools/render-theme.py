"""Render sample-docs/ with theme described in build/to-render.json
"""

import os
import shutil
import subprocess
import sys
from pathlib import Path

import virtualenv

sys.path.insert(0, "")
from src.helpers import RENDER_INFO_FILE, IsolatedEnvironment, patch_sample_docs_for


def render(theme):
    env = IsolatedEnvironment(theme.name)
    env.install("sphinx", theme.pypi)

    patch_sample_docs_for(theme)

    env.run(
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
