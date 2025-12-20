"""Get good-looking output, thanks to rich."""

from __future__ import annotations

import asyncio
import random
from typing import TYPE_CHECKING

import rich.live
import rich.progress

from .themes import Theme, get_themes

if TYPE_CHECKING:
    from collections.abc import Awaitable, Callable


# --------------------------------------------------------------------------------------
# Run with limited concurrency and a progress bar
# --------------------------------------------------------------------------------------
async def gather_with_limited_concurrency[T](n: int, *tasks: Awaitable[T]) -> list[T]:
    semaphore = asyncio.Semaphore(n)

    async def sem_task(task: Awaitable[T]) -> T:
        async with semaphore:
            return await task

    return await asyncio.gather(*(sem_task(task) for task in tasks))


async def run_for_themes_with_progress(
    themes: list[Theme],
    async_function: Callable[[Theme, rich.progress.Progress], Awaitable[None]],
) -> None:
    progress = rich.progress.Progress(
        "[progress.description]{task.description}",
        rich.progress.BarColumn(),
        "[progress.percentage]{task.percentage:>3.0f}%",
        rich.progress.TimeRemainingColumn(),
        auto_refresh=False,
    )

    live_display = rich.live.Live(progress)

    tasks: list[Awaitable[None]] = []
    for theme in themes:
        tasks.append(async_function(theme, progress))

    with live_display:
        await gather_with_limited_concurrency(8, *tasks)


# --------------------------------------------------------------------------------------
# Self-contained sanity check
# --------------------------------------------------------------------------------------
async def _my_stub(theme: Theme, progress: rich.progress.Progress) -> None:
    first = random.randint(1, 10) * 0.1
    second = random.randint(1, 10) * 0.1

    task = progress.add_task(theme.name, total=first + second)

    await asyncio.sleep(first)
    progress.advance(task, first)

    await asyncio.sleep(second)
    progress.advance(task, second)

    progress.log(f"Done: {theme}")
    progress.remove_task(task)


async def main() -> None:
    themes = get_themes()

    await run_for_themes_with_progress(themes, _my_stub)


if __name__ == "__main__":
    asyncio.run(main())
