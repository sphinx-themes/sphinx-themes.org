import os
import sys
import textwrap

from docutils import nodes
from docutils.parsers.rst import Directive, directives
from docutils.statemachine import StringList

# -- Common stuff -------------------------------------------------------------

project = "Sphinx Themes Sample"
copyright = "2021, Pradyun Gedam"
author = "Pradyun Gedam"

html_title = "{{ theme.display }}"

sys.path.insert(0, os.path.abspath("sample-docs/kitchen-sink/"))

extensions = [
    "sphinx.ext.autodoc",
    "sphinx.ext.extlinks",
    "sphinx.ext.intersphinx",
    "sphinx.ext.mathjax",
    "sphinx.ext.viewcode",
    "sphinx.ext.todo",
]

extlinks = {
    "pypi": ("https://pypi.org/project/%s/", "%s"),
}

intersphinx_mapping = {
    "sphinx": ("https://www.sphinx-doc.org/", None),
}

todo_include_todos = True

# -- Theme-specific -----------------------------------------------------------

rst_prolog = """
.. |theme_package| replace:: {{ theme.pypi_package }}
.. |theme_pypi_link| replace:: :pypi:`{{ theme.pypi_package }}`
.. |theme_name| replace:: {{ theme.name }}
.. |theme_display| replace:: {{ theme.display }}
{% if theme.documentation_link -%}
.. |theme_documentation_message| replace:: You can find this theme's documentation at {{ theme.documentation_link }}.
{% else %}
.. |theme_documentation_message| replace:: This theme does not have any hosted-on-the-web documentation.
{%- endif %}
"""

theme_configuration = """
{% for line in theme.compute_python_configuration_lines() %}
{{ line }}
{%- endfor %}
"""

exec(theme_configuration)


# -- Directives to include theme-specific stuff -------------------------------
class ThemeConfigurationDirective(Directive):
    has_content = False
    required_arguments = 0
    optional_arguments = 0

    def run(self):
        container = nodes.literal_block()
        translated_content = StringList(theme_configuration.splitlines(keepends=False))
        self.state.nested_parse(translated_content, 0, container)
        return [container]


class ThemeInstallDirective(Directive):
    has_content = False
    required_arguments = 0
    optional_arguments = 0

    def run(self):
        container = nodes.literal_block()
        translated_content = StringList(["$ pip install {{ theme.pypi_package }}"])
        self.state.nested_parse(translated_content, 0, container)
        return [container]


def setup(app):
    app.add_directive("theme-configuration", ThemeConfigurationDirective)
    app.add_directive("theme-install", ThemeInstallDirective)
