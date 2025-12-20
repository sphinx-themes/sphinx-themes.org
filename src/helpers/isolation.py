"""Manage isolated virtual environments for each build."""

import asyncio
import sys

from .constants import BUILD


class IsolatedEnvironment:
    """Isolated Environment interaction and management.

    Inspired by nox's Session object.
    """

    def __init__(self, name):
        super().__init__()
        self.name = name
        self.path = BUILD["virtual-environments"] / name
        self.bin_paths = [self.path / "bin"]

    async def create(self, *, delete=False):
        if self.path.exists() and not delete:
            assert all(path.exists() for path in self.bin_paths)
            return

        process = await asyncio.create_subprocess_exec(
            "uv",
            "venv",
            "--python",
            sys.executable,
            str(self.path),
            stdout=asyncio.subprocess.DEVNULL,
            stderr=asyncio.subprocess.DEVNULL,
        )
        await process.wait()
        if process.returncode:
            raise RuntimeError("Could not create virtual environment.")

    async def install(self, *args, **kwargs):
        returncode, _ = await self.run("uv", "pip", "install", *args, **kwargs)
        if returncode:
            raise RuntimeError(f"Could not install: {' '.join(args)}")

    async def run(self, *args, env=None):
        process = await asyncio.create_subprocess_exec(
            *args,
            env=env,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )

        outputs = await process.communicate()

        return process.returncode, outputs
