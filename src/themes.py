"""Handles parsing and loading of themes."""

import json
import sys
from dataclasses import dataclass, field
from typing import Dict, Iterator, List, Optional, Union

from .constants import DESTINATION, FILES


def get_themes() -> List["Theme"]:
    allowed_names = sys.argv[1:]

    try:
        with FILES["themes.json"].open() as f:
            data = json.load(f)
    except Exception as e:
        raise Exception("Could not load themes.json") from e

    assert isinstance(data, dict)
    assert "themes" in data, list(data.keys())

    # Use Theme objects
    themes = []
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
    documentation_link: Optional[str]
    configuration: Dict[str, Union[List[str], str]]

    imports: List[int] = field(default_factory=list)
    extensions: List[int] = field(default_factory=list)

    def __repr__(self):
        return f"Theme({self.name!r}, pypi_package={self.pypi_package!r})"

    @classmethod
    def from_json(cls, di):
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

    def compute_python_configuration_lines(self) -> Iterator[str]:
        for module in self.imports:
            yield f"import {module}"

        for extension in self.extensions:
            yield f'extensions.append("{extension}")'

        for key, value in self.configuration.items():
            if key == "html_theme":
                yield f"{key} = {value!r}"
            else:
                yield f"{key} = {value}"


if __name__ == "__main__":
    import rich

    for theme in get_themes():
        rich.print(theme)
