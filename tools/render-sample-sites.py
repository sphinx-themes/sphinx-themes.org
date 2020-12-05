import os
import shutil
import subprocess
import sys
from multiprocessing.dummy import Pool

sys.path.insert(0, "")
from src.helpers import (
    BUILD_PATH,
    PUBLIC_PATH,
    IsolatedEnvironment,
    generate_sphinx_config_for,
    load_themes,
)


def worker(theme):
    print(f"Working on: {theme.name}")

    html_theme = None
    if not isinstance(theme.config, str) and theme.config["html_theme"]:
        html_theme = theme.config["html_theme"]

    env = IsolatedEnvironment(theme.name, html_theme)
    try:
        env.create(delete="CI" in os.environ)

        # Directory management
        build_location = BUILD_PATH / "sample-sites" / theme.name
        if build_location.exists():
            shutil.rmtree(build_location)
        build_location.mkdir(parents=True)

        # Install required packages
        packages = sorted({"sphinx", theme.pypi})  # prevents duplication
        env.install(*packages)

        # Run sphinx
        generate_sphinx_config_for(theme, at=build_location)

        env.run(
            "sphinx-build",
            "-v",
            "-b=html",
            f"-c={build_location}",
            "sample-docs",
            str(build_location),
            env={"SAMPLE_DOCS_LOCATION": "sample-docs"},
        )
    except Exception as e:
        return (theme.name, e)

    return (theme.name, None)


def main():
    all_themes = load_themes(*sys.argv[1:])

    pool = Pool()
    for name, error in pool.imap_unordered(worker, all_themes):
        if error is not None:
            print(f"FAILED: {name}")
            print(error)
            print(f"Will terminate all workers now...")
            pool.terminate()
            break

        print(f" Generated: {name}")
    else:
        pool.close()

    pool.join()
    if error is not None:
        sys.exit(1)


if __name__ == "__main__":
    main()
