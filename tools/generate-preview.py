import io
import sys
from pathlib import Path

from PIL import Image
from selenium import webdriver
from selenium.webdriver.chrome.options import Options


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
    return Image.open(png_stream).convert('RGB')


def main():
    file = Path(sys.argv[1]).resolve().as_uri()
    destination_name = sys.argv[2]

    destination = Path(".") / "screenshots"
    if not destination.exists():
        destination.mkdir()

    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--verbose")
    driver = webdriver.Chrome(options=chrome_options)

    # Get all the screenshots
    screenshots = {}
    with driver:
        driver.get(file)

        for name, (width, height) in SIZES.items():
            driver.set_window_size(width, height - 75)

            screen = driver.get_screenshot_as_png()

            # Convert to RGB image
            screenshots[name] = _as_rgb_image(io.BytesIO(screen))
            # screenshots[name].save(str(destination / f"{name}.png"), "PNG")


    # Generate the final preview as a 95% JPEG
    template_file = Path(".") / "src" / "template.png"
    final_file = destination / f"{destination_name}.jpg"

    with template_file.open("rb") as f:
        final_image = _as_rgb_image(f)

        # Place all the screenshots
        for name, screenshot in screenshots.items():
            offset = OFFSETS[name]
            final_image.paste(screenshot, offset)

        # Resize the image
        width, height = final_image.size
        resize_to = (int(width / 2), int(height / 2))
        final_image.thumbnail(resize_to)

        # Save it!
        final_image.save(final_file, 'JPEG', optimize=True, quality=80)

if __name__ == "__main__":
    main()
