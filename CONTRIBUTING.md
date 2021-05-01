# Contributing

Thanks for your interest in contributing to this project!

## Adding a new theme

The most valuable contribution to this project would be to contribute more awesome Sphinx themes! Adding a theme to this website involves adding an entry to [`themes.json`].

- Create a fork of this repository.
- Clone your fork.
- Edit [`themes.json`], adding the new theme's configuration (described below) to it.
- Run `nox -s lint`, to ensure the entry is positioned properly.
- Commit and push changes.
- File a pull request!

If you skip the sorting step, the CI will show a lot of red text, and we won't be able to merge the pull request.

### Guidelines

We have some rough guidelines, to make sure that this gallery serves the intended purpose:

- The theme must be available from a [PyPI] package.
  - Only one entry is permitted for a PyPI package.
- The theme should be "intended for reuse".
  - no project-specific themes like `pytorch-sphinx-theme`.
  - no organisation-specific themes like `edx-sphinx-theme`.

### Theme Configuration

#### Simple Configuration (recommended)

For themes which only need `html_theme` to be set, the entry would be something like:

```json
{
  "config": "sphinx_rtd_theme",
  "display": "Read the Docs",
  "documentation": "https://sphinx-rtd-theme.readthedocs.io/en/latest/",
  "pypi": "sphinx-rtd-theme"
}
```

- `config` becomes the `html_theme` in Sphinx's `conf.py`
- `display` is the name presented on the website
- `documentation` is the link to the theme's "latest" documentation
- `pypi` is the package installed for the theme from [PyPI]

#### Complex Configuration

> Only use this if it is absolutely necessary to use the theme, or to demonstrate the important parts of the theme.

Certain themes require additional values to be set in `conf.py`, to be able to use them. This can be done using a JSON object for "config" as follows:

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
  "display": "Read the Docs",
  "documentation": "https://sphinx-rtd-theme.readthedocs.io/en/latest/",
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

```sh
$ nox -s lint
```

Runs the linters and formats all the files in the repository. This uses [`pre-commit`] for running the linters. Notably, [`tools/sort-json.py`] is also run as part of these linters and formats [`themes.json`].

### Site generation pipeline

`nox -s publish` generates the various parts of the website as follows:

- Install the dependencies.
- Run `python -m src.generate_sample_sites`
  - For every theme (with concurrency):
    - Create an isolated virtualenv in `build/`.
    - Install the latest sphinx pre-release, and then the theme's package.
    - Generate a `conf.py` for rendering documentation using this theme.
    - Call `sphinx-build` to generate the documentation using given theme.
- Run `python -m src.generate_previews`
  - Creates a webdriver for Firefox.
  - For every theme (with concurrency):
    - Open the generated sample site's root in the browser.
    - Take screenshots for various resolutions.
    - Place the screenshots appropriately in `src/assets/preview.template.png`.
    - Write the appropriately-modified-for-web-use preview image.
- `python -m src.generate_scaffold`
  - Renders `src/index.template.html`, with themes loaded from [`themes.json`].
  - Copies the illustration, which makes the site look pretty.
  - Write `CNAME` for GitHub Pages to serve the page correctly.

### Continuous Deployment

This is done using GitHub Actions.

The GitHub Action job runs `nox -s publish` and pushes the generated site to the `gh-pages` branch of this repository. GitHub Pages hosts the website which is served through https://sphinx-themes.org.

[pypi]: https://pypi.org/
[`nox`]: https://pypi.org/project/nox/
[`pipx`]: https://pypi.org/project/pipx/
[`pre-commit`]: https://pypi.org/project/pre-commit/
[`chromedriver`]: https://chromedriver.chromium.org/
[`themes.json`]: ./themes.json
[`tools/sort-json.py`]: ./tools/sort-json.py
