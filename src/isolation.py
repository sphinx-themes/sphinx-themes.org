"""Manage isolated virtual environments for each build.
"""

import asyncio
import os
import shutil
import subprocess
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
            "virtualenv",
            str(self.path),
            stdout=asyncio.subprocess.DEVNULL,
            stderr=asyncio.subprocess.DEVNULL,
        )
        await process.wait()
        if process.returncode:
            raise RuntimeError("Could not create virtual environment.")

    async def install(self, *args, **kwargs):
        returncode, _ = await self.run("pip", "install", *args, **kwargs)
        if returncode:
            raise RuntimeError(f"Could not install: {' '.join(args)}")

    async def run(self, *args, external=False, env={}):
        assert args

        locations = [str(path.resolve()) for path in self.bin_paths]
        executable_path = shutil.which(args[0], path=os.pathsep.join(locations))

        process = await asyncio.create_subprocess_exec(
            executable_path,
            *args[1:],
            env=env,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )

        outputs = await process.communicate()

        return process.returncode, outputs
