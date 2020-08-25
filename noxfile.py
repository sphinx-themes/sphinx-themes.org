import shutil
import subprocess
import sys

import nox

sys.path.insert(0, "")
from src.helpers import (
    BUILD_PATH,
    PUBLIC_PATH,
    RENDER_INFO_FILE,
    IsolatedEnvironment,
    generate_sphinx_config_for,
    load_themes,
)


def _prepare_output_directory(destination, *, delete=True):
    # Clean up existing stuff
    if destination.exists():
        if delete:
            shutil.rmtree(destination)
        else:
            return

    # Make the barebones skeleton
    destination.mkdir()
    (destination / "preview-images").mkdir()
    (destination / "sample-sites").mkdir()


@nox.session(python=False)
def publish(session):
    session.notify("render-sample-sites")
    session.notify("generate-previews")
    session.notify("render-index")


@nox.session(name="render-sample-sites", python=False)
def render_sample_sites(session):
    _prepare_output_directory(PUBLIC_PATH)
    _prepare_output_directory(BUILD_PATH, delete=False)

    session.run("python", "tools/render-sample-sites.py", *session.posargs)
    shutil.copytree(
        str(BUILD_PATH / "sample-sites"),
        str(PUBLIC_PATH / "sample-sites"),
        dirs_exist_ok=True,
    )


@nox.session(name="generate-previews")
def generate_previews(session):
    assert PUBLIC_PATH.exists(), "Did you run 'render-sample-sites' yet?"

    session.install("selenium", "pillow", "colorama")
    session.run("python", "tools/generate-previews.py", *session.posargs)

    source = BUILD_PATH / "preview-images"
    destination = PUBLIC_PATH / "preview-images"
    for file in source.iterdir():
        assert file.is_file(), repr(file)
        shutil.copy(str(file), str(destination / file.name))


@nox.session(name="render-index")
def render_index(session):
    session.install("jinja2")
    session.run("python", "tools/render-index.py")
    shutil.copy(str(BUILD_PATH / "index.html"), str(PUBLIC_PATH / "index.html"))


@nox.session
def lint(session):
    session.install("pre-commit")
    session.run("pre-commit", "run", "--all-files")
