from __future__ import annotations

import sys
from pathlib import Path
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from sphinx.application import Sphinx

sys.path.insert(0, str(Path(r"{{ sources }}") / "kitchen-sink"))

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
    "python": ("https://docs.python.org/3/", None),
    "sphinx": ("https://www.sphinx-doc.org/en/master/", None),
}

# -- Options for TODOs --------------------------------------------------------
todo_include_todos = True

# -- Options for HTML output --------------------------------------------------
html_title = "Sample Documentation"

# -- Theme-specific -----------------------------------------------------------
# Settings above mirror the baseline `sample-docs/conf.py`.
theme_configuration = """
{{ theme.conf_py_snippet }}
"""
exec(theme_configuration)  # noqa: S102 -- Execute trusted theme configuration from the repository.


def replace_index(app: Sphinx, docname: str, source: list[str]) -> None:
    """Replaces the contents of the `index` document with custom content."""
    if docname != "index":
        return

    with open(r"{{ injected_index_rst }}") as fp:
        source[0] = fp.read()


def setup(app: Sphinx) -> dict[str, object]:
    app.connect("source-read", replace_index)
    return {
        "parallel_read_safe": True,
        "parallel_write_safe": True,
    }
