import nox


@nox.session
def update(session: nox.Session) -> None:
    session.install("pip-tools")
    session.run("pip-compile", "requirements.in", "--upgrade")


@nox.session(name="list", reuse_venv=True)
def list_themes(session: nox.Session) -> None:
    session.install("rich")
    session.run("python", "src/list_themes.py")


@nox.session(reuse_venv=True)
def publish(session: nox.Session) -> None:
    session.install("-r", "requirements.txt")
    session.run("playwright", "install", "firefox")
    session.run("python", "src/generate_sample_sites.py", *session.posargs)
    session.run("python", "src/generate_screenshots.py", *session.posargs)
    session.run("python", "src/generate_scaffold.py")


@nox.session(reuse_venv=True)
def lint(session: nox.Session) -> None:
    session.install("prek")
    session.run("prek", "run", "--all-files")
    session.notify("typecheck")


@nox.session(reuse_venv=True)
def typecheck(session: nox.Session) -> None:
    session.install("ty", "nox", "-r", "requirements.txt")
    session.run(
        "ty",
        "check",
        ".",
        "--exclude",
        "src/templates/",
        "--exclude",
        "sample-docs/",
        *session.posargs,
    )
