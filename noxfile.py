import json
import shutil
from types import SimpleNamespace
from pathlib import Path

import nox


def _load_themes():
    try:
        with open("themes.json") as f:
            data = json.load(f)
    except Exception as e:
        raise Exception("Could not load themes.json") from e

    themes = []
    for theme in data["themes"]:
        theme["name"] = theme["pypi"] or ("default-" + theme["config"])
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


def _generate_docs(session):
    session.run(
        "python",
        "tools/render-theme.py",
        silent=session.interactive,  # Be silent if local, be loud if CI
    )


def _generate_preview(session, theme):
    # Generate the preview
    session.run(
        "python",
        "tools/generate-preview.py",
        f"build/{theme.name}/index.html",
        theme.name,
        silent=session.interactive,  # Be silent if local, be loud if CI
    )


def _copy_theme_assets(session, theme, destination):
    session.log("copy <theme files>")
    screenshot_file = f"{theme.name}.jpg"

    shutil.move(
        Path("screenshots") / screenshot_file,
        destination / "preview-images" / screenshot_file,
    )
    shutil.move(
        str(Path("build") / theme.name), str(destination / "sample-sites" / theme.name)
    )


@nox.session(python=False)
def publish(session):
    session.notify("render-themes")
    session.notify("render-index")


@nox.session(name="render-themes")
def render_themes(session):
    session.install("virtualenv", "selenium", "pillow")

    # Prepare output directories
    destination = Path("public")
    _prepare_destination(destination)

    build = Path("build")
    to_render = build / "to-render.json"
    if build.exists():
        shutil.rmtree(build)
    build.mkdir()

    # Load the list of themes
    themes = _load_themes()

    # Generate documentation using every theme
    failed = []
    for theme in themes:
        session.log(f"----- Working on {theme.display} -----")

        to_render.write_text(repr(vars(theme)))
        try:
            _generate_docs(session)
        except Exception:
            failed.append(theme)
            continue
        to_render.unlink()

        _generate_preview(session, theme)
        _copy_theme_assets(session, theme, destination)

    if failed:
        message = "Failed to render using:\n- " + "\n- ".join(
            theme.name for theme in failed
        )
        session.error(message)


@nox.session(name="render-index")
def render_index(session):
    session.install("jinja2")
    session.run("python", "tools/render-index.py")
