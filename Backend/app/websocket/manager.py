from __future__ import annotations

import asyncio
from typing import Dict, Set

from fastapi import WebSocket


class WebsocketManager:
    def __init__(self) -> None:
        self._connections: Dict[str, Set[WebSocket]] = {}
        self._lock = asyncio.Lock()

    async def connect(self, channel: str, websocket: WebSocket) -> None:
        await websocket.accept()
        async with self._lock:
            self._connections.setdefault(channel, set()).add(websocket)

    async def disconnect(self, channel: str, websocket: WebSocket) -> None:
        async with self._lock:
            if channel in self._connections:
                self._connections[channel].discard(websocket)

    async def broadcast(self, channel: str, message: dict) -> None:
        async with self._lock:
            targets = list(self._connections.get(channel, set()))
        for websocket in targets:
            await websocket.send_json(message)


manager = WebsocketManager()
