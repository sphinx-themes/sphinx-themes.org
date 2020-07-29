# Contributing

Thanks for your interest in contributing to this project!

## Adding a new theme

The most valuable contribution to this project would be to contribute more awesome Sphinx themes!

Every theme must be available as a [PyPI] package, and only 1 entry is permitted for a package.

Themes are stored in [`themes.json`]. To add a theme to the website, an entry should be added to this JSON document.

The entries in this JSON document are sorted by [`tools/sort-json.py`]. Notably, third-party themes are ordered alphabetically based on the PyPI package name after `sphinx-rtd-theme`. Make sure that the JSON entry is in the correct location and linted as [`tools/sort-json.py`] would output it (sorted keys, each entry in arrays/objects starts on a newline). Otherwise, the CI will show a lot of red text and icons and we won't be able to merge the PR.

### Simple Configuration

For themes which only need `html_theme` to be set, the entry would be something like:

```json
{
  "config": "sphinx_rtd_theme",
  "display": "Read the Docs Sphinx Theme",
  "pypi": "sphinx-rtd-theme"
}
```

- `config` becomes the `html_theme` in Sphinx's `conf.py`
- `display` is the name presented on the website
- `pypi` is the package installed for the theme from [PyPI]

### Complex Configuration

In cases where additional values must be set in `conf.py`, you can use a JSON object for "config" as follows:

```json
{
  "config": {
    "html_theme": "my_awesome_theme",
    "_imports": ["sys"],
    "_extensions": ["sphinx_tabs"],
    "my_theme_colors": "['blue', 'indigo']",
    "my_theme_number": "1",
    "html_context": "{'executable': sys.executable}"
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


## Development

If you want to build this website locally, you need:

- Python 3.8 or newer
- [`chromedriver`] and Google Chrome
- [`nox`] installed in a virtualenv or with [`pipx`]

### Workflow Commands

```sh
$ nox -s publish
```

Generates the entire site in `public/`. The generated site is meant to be viewed using an HTTP server. You can use Python's `http.server` module to create such a server locally using `python -m http.server -d public`. This should make it possible to view the generated website at <localhost:8000>.


```sh
$ nox -s publish -- sphinx-rtd-theme
```

Generates the site in `public/`, while only generating assets (sample-site and preview-image) for the given theme name(s). Multiple theme names can be passed after the `--`. This is useful when adding one or more new themes, to ensure that the configuration is correct.

> If you use this command, make sure to not include sample-docs/conf.py changes in any commits you make.

```sh
$ nox -s lint
```

Runs the linters and formats all the files in the repository. This uses [`pre-commit`] for running the linters. Notably, [`tools/sort-json.py`] is also run as part of these linters and formats [`themes.json`].

### Site generation pipeline

`nox -s publish` generates the various parts of the website as follows:

- `nox -s render-sample-sites`: Generate the sample site.
  - For every theme:
    - Create an isolated virtualenv in `.venv` and install sphinx + theme's PyPI package.
    - Patch `sample-docs/conf.py` according to what's needed for the theme.
    - Call `sphinx-build` to render the documentation using given theme.

- `nox -s generate-previews`: Generate the preview images.
  - Install the required packages.
  - Run `tools/generate-previews.py`
    - Creates a selenium driver for Google Chrome.
    - For every theme:
      - Open the generated sample site's root.
      - Take screenshots for various resolutions.
      - Place the screenshots appropriately in `src/template.png`
      - Write the appropriately-modified-for-web-use preview image.

- `nox -s render-index`: Rendering the index page.
  - Renders `src/index.jinja2` using Jinja2 and themes loaded from [`themes.json`].

### Continuous Deployment

This is done using GitHub Actions.

The GitHub Action job runs the various `nox -s ...` commands and pushes the generated site to the `gh-pages` branch of this repository. GitHub Pages hosts the website which is served through https://sphinx-themes.org.

[PyPI]: https://pypi.org/
[`nox`]: https://pypi.org/project/nox/
[`pipx`]: https://pypi.org/project/pipx/
[`pre-commit`]: https://pypi.org/project/pre-commit/
[`chromedriver`]: https://chromedriver.chromium.org/
[`themes.json`]: https://github.com/pradyunsg/sphinx-themes/blob/master/themes.json
[`tools/sort-json.py`]: https://github.com/pradyunsg/sphinx-themes/blob/master/tools/sort-json.py
