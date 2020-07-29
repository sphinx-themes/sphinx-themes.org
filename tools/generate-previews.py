import io
import sys
from pathlib import Path

import colorama
from PIL import Image
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

sys.path.insert(0, "")
from src.helpers import BUILD_PATH, PUBLIC_PATH, ROOT, TEMPLATE_IMAGE_FILE, load_themes

RESIZE_FACTOR = 2  # How much smaller to make the template image
QUALITY = 80  # Determines degree of compression in generated JPEGs

# Size of the viewport
SIZES = {
    "desktop": (1920, 1080),
    "tablet": (768, 1024),
    "mobile": (375, 667),
}
# Location in the preview image
OFFSETS = {
    "desktop": (43, 62),
    "tablet": (2013, 90),
    "mobile": (2831, 269),
}


def _as_rgb_image(png_stream):
    return Image.open(png_stream).convert("RGB")


def get_browser():
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--verbose")

    return webdriver.Chrome(options=chrome_options)


def take_screenshots(browser):
    screenshots = {}
    for device, (width, height) in SIZES.items():
        real_size = width, height - 75  # allow for a "top bar" in the window
        browser.set_window_size(*real_size)

        one = browser.get_screenshot_as_png()  # Take the screenshot
        two = _as_rgb_image(io.BytesIO(one))  # Convert to RGB image
        three = two.resize(real_size)  # Accommodate for a 2x screen.

        screenshots[device] = three
        # For debugging
        # screenshots[device].save(str(BUILD_PATH / f"{name}.png"), "PNG")

    return screenshots


def get_template_image():
    with TEMPLATE_IMAGE_FILE.open("rb") as f:
        return _as_rgb_image(f)


def save_preview(name, screenshots, image):
    # Place all the screenshots
    for device, screenshot in screenshots.items():
        offset = OFFSETS[device]
        image.paste(screenshot, offset)

    # Resize the image (to make it consume less bandwidth)
    width, height = image.size
    resize_to = (int(width / RESIZE_FACTOR), int(height / RESIZE_FACTOR))
    image.thumbnail(resize_to)

    # Save it!
    final_file = BUILD_PATH / "preview-images" / f"{name}.jpg"
    image.save(str(final_file), "JPEG", optimize=True, quality=QUALITY)


def main():
    all_themes = load_themes(*sys.argv[1:])
    browser = get_browser()
    template_image = get_template_image()

    with browser:
        for theme in all_themes:
            print(theme.name)

            print("  opening sample site", end="... ", flush=True)
            browser_file = PUBLIC_PATH / "sample-sites" / theme.name / "index.html"
            browser.get(browser_file.as_uri())
            print("done!")

            print("  taking screenshots", end="... ", flush=True)
            screenshots = take_screenshots(browser)
            print("done!")

            print("  generating preview image", end="... ", flush=True)
            save_preview(theme.name, screenshots, template_image.copy())
            print("done!")


if __name__ == "__main__":
    main()
