"""Script to generate the screenshots for all the themes."""

import asyncio
import contextlib
import functools
import io
import textwrap
from typing import Dict, Tuple

import rich
from PIL import Image
from playwright.async_api import BrowserContext
from playwright.async_api import Error as PlaywrightError
from playwright.async_api import Page, async_playwright

from .constants import DESTINATION, SCREENSHOT_OFFSETS, SCREENSHOT_SIZES, TEMPLATES
from .output import run_for_themes_with_progress
from .themes import Theme, get_themes


# --------------------------------------------------------------------------------------
# Image handling
# --------------------------------------------------------------------------------------
def get_template_image() -> Image.Image:
    print("Loading template image...", end=" ", flush=True)
    try:
        with TEMPLATES["preview-image"].open("rb") as png_stream:
            return Image.open(png_stream).convert("RGB")
    finally:
        print("Done")


def sanitize_screenshot(raw_png: bytes, real_size: Tuple[int, int]) -> Image.Image:
    """Processing screenshots taken by the browser."""
    with io.BytesIO(raw_png) as f:
        image = Image.open(f).convert("RGB")
    return image.resize(real_size)


def render_into_template(
    screenshots: Dict[str, Image.Image],
    template: Image.Image,
) -> Image.Image:
    """Place all the screenshots, into the correct place."""
    # Place all the screenshots
    for device, screenshot in screenshots.items():
        template.paste(screenshot, SCREENSHOT_OFFSETS[device])

    # Reduce image size, to reduce bandwidth usage
    width, height = template.size
    resize_to = (int(width / 2), int(height / 2))

    template.thumbnail(resize_to)

    return template


# --------------------------------------------------------------------------------------
# Browser Interactions
# --------------------------------------------------------------------------------------
async def take_screenshots_at_all_resolutions(page: Page, url: str) -> Dict[str, Image.Image]:
    screenshots = {}

    for name, resolution in SCREENSHOT_SIZES.items():
        await page.set_viewport_size(resolution)
        await page.goto(url, wait_until="load")
        await asyncio.sleep(1)  # give the rendering logic a moment

        size = (resolution["width"], resolution["height"])
        screenshots[name] = sanitize_screenshot(await page.screenshot(), size)

    return screenshots


async def render_at_multiple_resolutions(
    context: BrowserContext,
    original_template: Image.Image,
    *,
    theme: Theme,
    progress: rich.progress.Progress,
) -> None:
    task = progress.add_task(theme.name, total=10)
    try:
        # progress.log(f"{theme.name}: Creating browser tab.")
        page = await context.new_page()
        progress.advance(task, 1)

        # progress.log(f"{theme.name}: Taking screenshots.")
        screenshots = await take_screenshots_at_all_resolutions(page, theme.url)
        progress.advance(task, 5)

        # progress.log(f"{theme.name}: Rendering to template.")
        rendered_image = render_into_template(screenshots, original_template.copy())
        progress.advance(task, 1)

        rendered_image.save(theme.image, "JPEG", optimize=True, quality=80)
        progress.advance(task, 1)
    except PlaywrightError as e:
        progress.log(f"Fail: [red]{theme.name}[reset]\n{e}")
        progress.update(task, description="FAILED")
    else:
        progress.log(f"Done: [green]{theme.name}[reset]")
    finally:
        progress.remove_task(task)


# --------------------------------------------------------------------------------------
# Main entrypoint
# --------------------------------------------------------------------------------------
async def run(playwright) -> None:
    print("Launching browser...", end=" ", flush=True)
    try:
        browser = await playwright.firefox.launch()
    finally:
        print("Done")

    original_template = get_template_image()
    themes = get_themes()
    DESTINATION["images"].mkdir(parents=True, exist_ok=True)

    my_partial = functools.partial(
        render_at_multiple_resolutions, browser, original_template
    )
    await run_for_themes_with_progress(themes, my_partial)


async def main() -> None:
    async with async_playwright() as playwright:
        await run(playwright)


if __name__ == "__main__":
    asyncio.run(main())
