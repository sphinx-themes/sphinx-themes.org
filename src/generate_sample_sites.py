import asyncio
import os
import shutil
import textwrap
import traceback
from datetime import datetime
from pathlib import Path

import rich.progress
from jinja2 import Template

from .constants import BUILD, DESTINATION, TEMPLATES
from .isolation import IsolatedEnvironment
from .output import run_for_themes_with_progress
from .themes import Theme, get_themes


def get_error_page(theme: Theme, error: Exception) -> str:
    template = Template(TEMPLATES["error.html"].read_text(), autoescape=True)
    return template.render(
        theme=theme,
        error=error,
        traceback=textwrap.dedent("".join(traceback.format_stack())),
        now=datetime.now(),
    )


def render_conf_template(theme: Theme, destination: Path):
    template = Template(TEMPLATES["configuration"].read_text())
    rendered = template.render(theme=theme)

    destination.write_text(rendered)


async def generate_site(
    *,
    theme: Theme,
    progress: rich.progress.Progress,
) -> None:
    task = progress.add_task(theme.name, total=5)

    env = IsolatedEnvironment(theme.name)
    destination_path = DESTINATION["sites"] / theme.name

    try:
        await env.create(delete="CI" in os.environ)
        progress.advance(task, 1)

        progress.log(f"[yellow]{theme.name}[reset]: Installing packages...")
        await env.install("--pre", "sphinx")
        progress.advance(task, 1)
        await env.install(theme.pypi_package)
        progress.advance(task, 1)

        render_conf_template(theme, env.path / "conf.py")
        progress.advance(task, 1)

        if destination_path.exists():
            shutil.rmtree(destination_path)

        progress.log(f"[yellow]{theme.name}[reset]: Building site...")
        returncode, output = await env.run(
            "sphinx-build",
            "-v",
            "-b=dirhtml",
            f"-c={env.path}",
            str(BUILD["sources"]),
            str(destination_path),
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
        progress.log(f"Fail: [red]{theme.name}[reset]\n\t{e}")
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
