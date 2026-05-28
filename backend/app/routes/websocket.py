from __future__ import annotations

from fastapi import APIRouter, WebSocket

from app.websocket.manager import manager

router = APIRouter(tags=["websocket"])


@router.websocket("/ws/notifications/{user_id}")
async def notifications_ws(websocket: WebSocket, user_id: str):
    channel = f"user:{user_id}"
    await manager.connect(channel, websocket)
    try:
        while True:
            await websocket.receive_text()
    except Exception:
        await manager.disconnect(channel, websocket)
