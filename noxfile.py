import json
import shutil
from types import SimpleNamespace
from pathlib import Path

import nox

TO_RENDER = Path("build") / "to-render.json"


def _load_themes():
    try:
        with open("themes.json") as f:
            data = json.load(f)
    except Exception as e:
        raise Exception("Could not load themes.json") from e

    themes = []
    for theme in data["themes"]:
        themes.append(SimpleNamespace(**theme))
    return themes


def _prepare_destination(destination):
    # Clean up existing stuff
    if destination.exists():
        shutil.rmtree(destination)

    # Make the barebones skeleton
    destination.mkdir()
    (destination / "preview-images").mkdir()
    (destination / "sample-sites").mkdir()


def _build_theme(session, theme):
    session.log(f"----- Working on {theme.display} -----")

    # Render the documentation
    TO_RENDER.write_text(repr(vars(theme)))
    session.run(
        "python",
        "tools/render-theme.py",
        silent=session.interactive,  # Be silent if local, be loud if CI
    )
    TO_RENDER.remove()

    # Generate the preview
    session.run(
        "python", "tools/generate-preview.py", "build/index.html", theme.pypi,
        silent=session.interactive,  # Be silent if local, be loud if CI
    )



def _copy_theme(session, theme, destination):
    session.log("copy <theme files>")
    screenshot_file = f"{theme.pypi}.jpg"

    shutil.move(
        Path("screenshots") / screenshot_file,
        destination / "preview-images" / screenshot_file,
    )
    shutil.move(Path("build") / theme.pypi, destination / "sample-sites" / theme.pypi)


@nox.session(python=False)
def publish(session):
    session.notify("render-themes")
    session.notify("render-index")

@nox.session(name="render-themes")
def render_themes(session):
    session.install("virtualenv", "selenium", "pillow")

    destination = Path("public")
    _prepare_destination(destination)

    # Generate *all* the things
    themes = _load_themes()
    for theme in themes:
        _build_theme(session, theme)
        _copy_theme(session, theme, destination)


@nox.session(name="render-index")
def render_index(session):
    session.install("jinja2")
    session.run("python", "tools/render-index.py")
