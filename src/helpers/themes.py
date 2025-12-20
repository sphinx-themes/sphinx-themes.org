"""Handles parsing and loading of themes."""

from __future__ import annotations

import json
import sys
from collections.abc import Iterator
from dataclasses import dataclass, field
from typing import TYPE_CHECKING

from .constants import DESTINATION, FILES, ThemeDict

if TYPE_CHECKING:
    from collections.abc import Iterator


def get_themes() -> list[Theme]:
    allowed_names = sys.argv[1:]

    try:
        with FILES["themes.json"].open() as f:
            data: dict[str, list[ThemeDict]] = json.load(f)
    except Exception as e:
        raise Exception("Could not load themes.json") from e

    assert isinstance(data, dict)
    assert "themes" in data, list(data.keys())

    # Use Theme objects
    themes: list[Theme] = []
    for di in data["themes"]:
        theme = Theme.from_json(di)
        # Filter themes, if only certain names are allowed
        if not allowed_names or theme.name in allowed_names:
            themes.append(theme)

    if not themes:
        raise Exception(f"No themes match given names: {allowed_names!r}.")

    return themes


@dataclass(frozen=True, repr=False)
class Theme:
    """Build information for a single theme."""

    display: str
    pypi_package: str
    documentation_link: str | None
    configuration: dict[str, list[str] | str]

    imports: list[str] = field(default_factory=list[str])
    extensions: list[str] = field(default_factory=list[str])

    def __repr__(self) -> str:
        return f"Theme({self.name!r}, pypi_package={self.pypi_package!r})"

    @classmethod
    def from_json(cls, di: ThemeDict) -> Theme:
        """Determine a theme's information from JSON data."""
        assert "display" in di, di
        display = di["display"]

        assert "pypi" in di, di
        pypi_package = di["pypi"]

        documentation_link = di.get("documentation", None)

        assert "config" in di, di
        if isinstance(di["config"], str):
            return cls(
                display=display,
                pypi_package=pypi_package,
                documentation_link=documentation_link,
                configuration={"html_theme": di["config"]},
            )

        assert isinstance(di["config"], dict), di
        assert "html_theme" in di["config"], di

        extensions = di["config"].pop("_extensions", [])
        imports = di["config"].pop("_imports", [])
        configuration = di["config"].copy()

        return cls(
            display=display,
            pypi_package=pypi_package,
            documentation_link=documentation_link,
            configuration=configuration,
            imports=imports,
            extensions=extensions,
        )

    @property
    def name(self) -> str:
        if self.pypi_package == "sphinx":
            assert "html_theme" in self.configuration, self
            return f"default-{self.configuration['html_theme']}"

        return self.pypi_package

    @property
    def image(self) -> str:
        return str(DESTINATION["images"] / f"{self.name}.jpg")

    @property
    def url(self) -> str:
        path = (DESTINATION["sites"] / self.name / "index.html").resolve()
        return path.as_uri()

    @property
    def conf_py_snippet(self) -> str:
        return "\n".join(self._compute_python_configuration_lines())

    def _compute_python_configuration_lines(self) -> Iterator[str]:
        yield f'html_title = "{self.display} Sample Site"'

        for module in self.imports:
            yield f"import {module}"

        for extension in self.extensions:
            yield f'extensions.append("{extension}")'

        for key, value in self.configuration.items():
            if key == "html_theme":
                yield f"{key} = {value!r}"
            else:
                yield f"{key} = {value}"
