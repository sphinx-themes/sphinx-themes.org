# Contributing

Hi! Thanks for your interest in contributing to this project!

## Where is the list of themes?

Themes are managed in [themes.json]. This file is the source from which the themes are installed and used for generating the previews. This file is linted using [tools/sort-json.py], and curated manually.

Every theme MUST be available as a PyPI package, and only 1 entry is permitted for a PyPI package.

### Order of entries

- Alabaster (the default theme)
- ReadTheDocs' excellent Sphinx theme
- Third Party themes (ordered alphabetically based on the PyPI package name)
- Builtin themes

## Adding a new theme

To add a theme, an entry to [themes.json]. There isn't a lot going on, and most entries can be like:

```json
{
  "config": "sphinx_rtd_theme",
  "display": "Read the Docs Sphinx Theme",
  "pypi": "sphinx-rtd-theme"
}
```

If a theme can be used by installing a package and setting `html_theme` in `conf.py`, you can file a PR adding an entry via the GitHub UI itself! Make sure to get the order correct, or else the linting CI job will fail.

### Complex Theme Configuration

In cases where additional values must be set in `conf.py`, you can use a JSON object for "config" as follows:

```json
{
  "config": {
    "html_theme": "my_awesome_theme",
    "_imports": ["sys"],
    "_extensions": ["sphinx_tabs"],
    "my_theme_colors": "['blue', 'indigo']",
    "my_theme_number": "1",
    "html_context": "{'executable': sys.executable}",
  },
  "display": "Read the Docs Sphinx Theme",
  "pypi": "sphinx-rtd-theme"
}
```

This will result in a conf.py containing:

```py
import sys
extensions.append("sphinx_tabs")
html_theme = "my_awesome_theme"
my_theme_colors = ['blue', 'indigo']
my_theme_number = 1
html_context = {'executable': sys.executable}
```

Notice that:

- `_imports` was transformed into import statements.
- `_extensions` was transformed into `extensions.append(...)` statements.
- `"html_theme"` was automatically quoted.
- All other properties were added as-is without any processing.

[themes.json]: https://github.com/pradyunsg/sphinx-themes/blob/master/themes.json
[tools/sort-json.py]: https://github.com/pradyunsg/sphinx-themes/blob/master/tools/sort-json.py
