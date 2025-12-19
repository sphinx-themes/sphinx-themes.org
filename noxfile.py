import nox


@nox.session
def update(session: nox.Session) -> None:
    session.install("pip-tools")
    session.run("pip-compile", "requirements.in", "--upgrade")


@nox.session(name="list", reuse_venv=True)
def list_themes(session: nox.Session) -> None:
    session.install("rich")
    session.run("python", "-m", "src.themes")


@nox.session(reuse_venv=True)
def publish(session: nox.Session) -> None:
    session.install("-r", "requirements.txt")
    session.run("playwright", "install", "firefox")
    session.run("python", "-m", "src.generate_sample_sites", *session.posargs)
    session.run("python", "-m", "src.generate_screenshots", *session.posargs)
    session.run("python", "-m", "src.generate_scaffold")


@nox.session(reuse_venv=True)
def lint(session: nox.Session) -> None:
    session.install("prek")
    session.run("prek", "run", "--all-files")
