import json
import shutil
from pathlib import Path
from types import SimpleNamespace

import nox

PUBLIC_PATH = Path("public")
BUILD_PATH = Path("build")


def _load_themes():
    try:
        with open("themes.json") as f:
            data = json.load(f)
    except Exception as e:
        raise Exception("Could not load themes.json") from e

    themes = []
    for theme in data["themes"]:
        if theme["pypi"] == "sphinx":
            theme["name"] = "default-" + theme["config"]
        else:
            theme["name"] = theme["pypi"]
        themes.append(SimpleNamespace(**theme))
    return themes


def _prepare_output_directory(destination):
    # Clean up existing stuff
    if destination.exists():
        shutil.rmtree(destination)

    # Make the barebones skeleton
    destination.mkdir()
    (destination / "preview-images").mkdir()
    (destination / "sample-sites").mkdir()


def _generate_docs(session, theme):
    to_render = BUILD_PATH / "to-render.json"

    to_render.write_text(repr(vars(theme)))
    try:
        session.run("python", "tools/render-theme.py", theme.name, silent=True)
    finally:
        to_render.unlink()

    shutil.move(
        str(BUILD_PATH / theme.name), str(PUBLIC_PATH / "sample-sites" / theme.name),
    )


def _generate_preview(session, theme):
    # Generate the preview
    session.run(
        "python",
        "tools/generate-preview.py",
        str(BUILD_PATH / theme.name / "index.html"),
        theme.name,
        silent=True,
    )

    screenshot_file = f"{theme.name}.jpg"
    shutil.move(
        Path("screenshots") / screenshot_file,
        PUBLIC_PATH / "preview-images" / screenshot_file,
    )


def with_every_theme(session, function, message):
    """Nice little helper, to make looping through all the themes easier.
    """
    themes = _load_themes()
    failed = []
    for theme in themes:
        try:
            function(session, theme)
        except Exception:
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


@nox.session(name="render-sample-sites")
def render_sample_sites(session):
    _prepare_output_directory(PUBLIC_PATH)
    _prepare_output_directory(BUILD_PATH)

    session.install("virtualenv")
    with_every_theme(session, _generate_docs, "Render")


@nox.session(name="generate-previews")
def generate_previews(session):
    assert BUILD_PATH.exists(), "Did you run 'render-sample-sites' yet?"

    session.install("selenium", "pillow")
    with_every_theme(session, _generate_preview, "Generate preview")


@nox.session(name="render-index")
def render_index(session):
    session.install("jinja2")
    session.run("python", "tools/render-index.py")
