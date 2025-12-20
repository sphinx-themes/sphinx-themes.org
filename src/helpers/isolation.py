"""Manage isolated virtual environments for each build."""

from __future__ import annotations

import asyncio
import sys
from typing import TYPE_CHECKING

from .constants import BUILD

if TYPE_CHECKING:
    from pathlib import Path


class IsolatedEnvironment:
    """Isolated Environment interaction and management.

    Inspired by nox's Session object.
    """

    def __init__(self, name: str) -> None:
        super().__init__()
        self.name = name
        self.path = BUILD["virtual-environments"] / name
        self.bin_paths = [self.path / "bin"]

    async def create(self, *, delete: bool = False) -> None:
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

    async def install(self, *args: str, env: dict[str, str] | None = None) -> None:
        returncode, _ = await self.run(
            "uv", "pip", "install", *args, env=env, cwd=self.path
        )
        if returncode:
            raise RuntimeError(f"Could not install: {' '.join(args)}")

    async def run(
        self, *args: str, cwd: Path | None, env: dict[str, str] | None = None
    ) -> tuple[int | None, tuple[bytes, bytes]]:
        process = await asyncio.create_subprocess_exec(
            *args,
            env=env,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
            cwd=cwd,
        )

        outputs = await process.communicate()

        return process.returncode, outputs
