from pathlib import Path

# -------------------------------------------------------------------------------
# Locations
# -------------------------------------------------------------------------------
_BASE = Path(__file__).parent.parent.relative_to(Path(".").resolve())
_PUBLIC = _BASE / "public"
_TEMPLATES = _BASE / "src" / "templates"

FILES = {
    "themes.json": _BASE / "themes.json",
}

TEMPLATES = {
    "configuration": _TEMPLATES / "conf.template.py",
    "preview-image": _TEMPLATES / "preview.template.png",
    "index.html": _TEMPLATES / "index.template.html",
    "error.html": _TEMPLATES / "error.template.html",
}

BUILD = {
    "assets": _BASE / "src" / "assets",
    "sources": _BASE / "sample-docs",
    "virtual-environments": _BASE / "build",
}

DESTINATION = {
    "assets": _PUBLIC,
    "sites": _PUBLIC / "sample-sites",
    "CNAME": _PUBLIC / "CNAME",
    "index.html": _PUBLIC / "index.html",
    "images": _PUBLIC / "preview-images",
}

# -------------------------------------------------------------------------------
# Screenshot
# -------------------------------------------------------------------------------
# Size of the viewport
SCREENSHOT_SIZES = {
    "desktop": {"width": 1920, "height": 1080 - 75},
    "tablet": {"width": 768, "height": 1024 - 75},
    "mobile": {"width": 375, "height": 667 - 75},
}

# Location in the preview image
SCREENSHOT_OFFSETS = {
    "desktop": (43, 62),
    "tablet": (2013, 90),
    "mobile": (2831, 269),
}
