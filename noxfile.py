import shutil
import subprocess
import sys

import nox


@nox.session
def update(session):
    session.install("pip-tools")
    session.run("pip-compile")


@nox.session(name="list", reuse_venv=True)
def list_themes(session):
    session.install("rich")
    session.run("python", "-m", "src.themes")


@nox.session(reuse_venv=True)
def publish(session):
    session.install("-r", "requirements.txt")
    session.run("playwright", "install", "firefox")
    session.run("python", "-m", "src.generate_sample_sites", *session.posargs)
    session.run("python", "-m", "src.generate_screenshots", *session.posargs)
    session.run("python", "-m", "src.generate_scaffold")


@nox.session(reuse_venv=True)
def lint(session):
    session.install("pre-commit")
    session.run("pre-commit", "run", "--all-files")
