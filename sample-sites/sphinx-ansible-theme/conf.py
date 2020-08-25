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

# NOTE: All the lines after this marker, are modified during generation.
# !! MARKER !!
extensions.append("sphinx_ansible_theme.ext.pygments_lexer")
html_theme = "sphinx_ansible_theme"
highlight_language = 'YAML+Jinja'
html_context = {'display_github': True, 'github_user': 'pradyunsg', 'github_repo': 'sphinx-themes', 'github_version': 'master/sample-docs/', 'github_root_dir': 'master/src', 'current_version': 'latest', 'latest_version': 'latest', 'available_versions': ('latest', ), 'css_files': (), }
html_theme_options = {'collapse_navigation': False, 'analytics_id': '', 'style_nav_header_background': '#5bbdbf', 'style_external_links': True, 'canonical_url': 'https://pradyunsg.me/sphinx-themes/', 'vcs_pageview_mode': 'edit', 'navigation_depth': 3, }
pygments_style = 'sphinx'
