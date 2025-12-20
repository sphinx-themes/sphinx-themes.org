from __future__ import annotations

import asyncio
import os
import shutil
from datetime import UTC, datetime
from pathlib import Path
from typing import TYPE_CHECKING

import rich.progress
import rich.traceback
from jinja2 import Template

from helpers.constants import BUILD, DESTINATION, TEMPLATES
from helpers.isolation import IsolatedEnvironment
from helpers.output import run_for_themes_with_progress
from helpers.themes import Theme, get_themes

if TYPE_CHECKING:
    from pathlib import Path


def get_error_page(theme: Theme, error: Exception) -> str:
    template = Template(TEMPLATES["error.html"].read_text(), autoescape=True)
    return template.render(
        theme=theme,
        error=error,
        now=datetime.now(tz=UTC),
    )


def render_template(name: str, dest_dir: Path, **kwargs: object) -> None:
    template = Template(TEMPLATES[name].read_text())
    rendered = template.render(**kwargs)
    (dest_dir / name).write_text(rendered)


async def generate_site(
    theme: Theme,
    progress: rich.progress.Progress,
) -> None:
    task = progress.add_task(theme.name, total=6)

    env = IsolatedEnvironment(theme.name)
    destination_path = DESTINATION["sites"] / theme.name

    try:
        await env.create(delete="CI" in os.environ)
        progress.advance(task, 1)

        progress.log(f"[yellow]{theme.name}[reset]: Installing packages...")
        await env.install("sphinx")
        progress.advance(task, 1)
        await env.install(theme.pypi_package)
        progress.advance(task, 1)

        render_template("index.rst", env.path, theme=theme)
        progress.advance(task, 1)

        render_template(
            "conf.py",
            env.path,
            theme=theme,
            injected_index_rst=os.fsdecode(env.path / "index.rst"),
        )
        progress.advance(task, 1)

        if destination_path.exists():
            shutil.rmtree(destination_path)

        progress.log(f"[yellow]{theme.name}[reset]: Building site...")
        returncode, output = await env.run(
            "sphinx-build",
            "-v",
            "-b=dirhtml",
            f"-c={env.path}",
            ".",
            os.fsdecode(destination_path),
            cwd=BUILD["sources"],
        )
        progress.advance(task, 1)

        if returncode:
            stdout, stderr = output
            message = [
                " stdout ".center(88, "="),
                stdout.decode(),
                " stderr ".center(88, "="),
                stderr.decode(),
            ]
            raise Exception("\n".join(message))
    except Exception as e:
        progress.log(f"Fail: [red]{theme.name}[reset]", rich.traceback.Traceback())
        destination_path.mkdir(parents=True, exist_ok=True)
        (destination_path / "index.html").write_text(get_error_page(theme, e))
    else:
        progress.log(f"Done: [green]{theme.name}[reset]")
    finally:
        progress.remove_task(task)


# --------------------------------------------------------------------------------------
# Main entrypoint
# --------------------------------------------------------------------------------------
async def main() -> None:
    themes = get_themes()

    await run_for_themes_with_progress(themes, generate_site)


if __name__ == "__main__":
    asyncio.run(main())
else:
    raise RuntimeError("This module is intended to be run as a script.")
