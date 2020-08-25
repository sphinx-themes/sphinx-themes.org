import os
import sys

sys.path.append(os.path.join(os.path.dirname(__file__), "demo"))


# -- Project information -----------------------------------------------------

project = "Sphinx Themes Sample"
copyright = "2020, Pradyun Gedam"
author = "Pradyun Gedam"

# -- Extensions --------------------------------------------------------------
extensions = [
    "sphinx.ext.intersphinx",
    "sphinx.ext.autodoc",
    "sphinx.ext.mathjax",
    "sphinx.ext.viewcode",
]

# -- Options for HTML output -------------------------------------------------

# NOTE: All the lines are after this are the theme-specific ones. These are
#       written as part of the site generation pipeline for this project.
# !! MARKER !!
import lsst_dd_rtd_theme
html_theme = "lsst_dd_rtd_theme"
html_theme_path = [lsst_dd_rtd_theme.get_html_theme_path()]
