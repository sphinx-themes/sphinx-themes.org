"""sphinx-themes.org sample documentation configuration

If you're reading this for sphinx-themes.org, you probably want to look at
`src/templates/conf.template.py` instead, which will replace this file as the
configuration file.
"""

import sys

sys.path.insert(0, "./kitchen-sink")

# -- Project information ------------------------------------------------------
project = "Sphinx Themes Sample"
copyright = "2021, Pradyun Gedam"
author = "Pradyun Gedam"

# -- General configuration ----------------------------------------------------
extensions = [
    "sphinx.ext.autodoc",
    "sphinx.ext.extlinks",
    "sphinx.ext.intersphinx",
    "sphinx.ext.mathjax",
    "sphinx.ext.napoleon",
    "sphinx.ext.todo",
    "sphinx.ext.viewcode",
]


# -- Options for extlinks -----------------------------------------------------
extlinks = {
    "pypi": ("https://pypi.org/project/%s/", "%s"),
}

# -- Options for intersphinx --------------------------------------------------
intersphinx_mapping = {
    "sphinx": ("https://www.sphinx-doc.org/", None),
}

# -- Options for TODOs --------------------------------------------------------
todo_include_todos = True

# -- Options for HTML output --------------------------------------------------
html_title = "Sample Documentation"
