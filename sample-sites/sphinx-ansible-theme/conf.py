import os
import sys

sys.path.append(os.path.join(os.environ["SAMPLE_DOCS_LOCATION"], "demo"))
print("", sys.path[-1], "", sep="\n" + "-" * 80 + "\n")

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

html_title = project

# NOTE: All the lines are after this are the theme-specific ones. These are
#       written as part of the site generation pipeline for this project.
# !! MARKER !!
extensions.append("sphinx_ansible_theme.ext.pygments_lexer")
html_theme = "sphinx_ansible_theme"
highlight_language = 'YAML+Jinja'
html_context = {'display_github': True, 'github_user': 'pradyunsg', 'github_repo': 'sphinx-themes', 'github_version': 'master/sample-docs/', 'github_root_dir': 'master/src', 'current_version': 'latest', 'latest_version': 'latest', 'available_versions': ('latest', ), 'css_files': (), }
html_theme_options = {'collapse_navigation': False, 'analytics_id': '', 'style_nav_header_background': '#5bbdbf', 'style_external_links': True, 'canonical_url': 'https://pradyunsg.me/sphinx-themes/', 'vcs_pageview_mode': 'edit', 'navigation_depth': 3, }
pygments_style = 'sphinx'
