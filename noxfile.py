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
    load_themes,
    patch_sample_docs_for,
)


def _prepare_output_directory(destination):
    # Clean up existing stuff
    if destination.exists():
        shutil.rmtree(destination)

    # Make the barebones skeleton
    destination.mkdir()
    (destination / "preview-images").mkdir()
    (destination / "sample-sites").mkdir()


def _generate_docs(session, theme):
    session.log(f" {theme.name} ".center(80, "-"))

    # Setup the isolated environment
    env = IsolatedEnvironment(theme.name)
    session.run("virtualenv", str(env.path), silent=True)

    # Install required packages
    packages = sorted({"sphinx", theme.pypi})  # prevents duplication
    env.install(*packages)

    # Run sphinx
    patch_sample_docs_for(theme)
    env.run(
        "sphinx-build",
        "-v",
        "-b",
        "html",
        "sample-docs",
        str(BUILD_PATH / theme.name),
        silent=True,
    )

    shutil.move(
        str(BUILD_PATH / theme.name), str(PUBLIC_PATH / "sample-sites" / theme.name),
    )


def with_every_theme(session, function, message):
    """Nice little helper, to make looping through all the themes easier.
    """
    themes = load_themes()
    failed = []
    for theme in themes:
        try:
            function(session, theme)
        except subprocess.CalledProcessError:
            failed.append(theme)
            continue

    if failed:
        parts = [f"Failed to {message.lower()} for:"]
        for theme in failed:
            parts.append(f"- {theme.name}")
        session.error("\n".join(parts))


@nox.session(python=False)
def publish(session):
    session.notify("render-sample-sites")
    session.notify("generate-previews")
    session.notify("render-index")


@nox.session(name="render-sample-sites", python=False)
def render_sample_sites(session):
    _prepare_output_directory(PUBLIC_PATH)
    _prepare_output_directory(BUILD_PATH)

    with_every_theme(session, _generate_docs, "Render")


@nox.session(name="generate-previews")
def generate_previews(session):
    assert BUILD_PATH.exists(), "Did you run 'render-sample-sites' yet?"

    def _call_script(session, theme):
        session.run(
            "python",
            "tools/generate-preview.py",
            str(BUILD_PATH / theme.name / "index.html"),
            theme.name,
        )

    session.install("selenium", "pillow")
    with_every_theme(session, _call_script, "Generate preview")

    source = BUILD_PATH / "preview-images"
    destination = PUBLIC_PATH / "preview-images"
    for file in source.iterdir():
        assert file.is_file(), repr(file)
        shutil.move(str(file), str(destination / file.name))


@nox.session(name="render-index")
def render_index(session):
    session.install("jinja2")
    session.run("python", "tools/render-index.py")
    shutil.move(str(BUILD_PATH / "index.html"), str(PUBLIC_PATH / "index.html"))


@nox.session
def lint(session):
    session.install("pre-commit")
    session.run("pre-commit", "run", "--all-files")
