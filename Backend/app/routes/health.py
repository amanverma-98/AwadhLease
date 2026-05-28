from __future__ import annotations

from fastapi import APIRouter

from app.database.mongo import get_client

router = APIRouter(tags=["health"])


@router.get("/health")
async def health_check() -> dict:
    client = get_client()
    await client.admin.command("ping")
    return {"status": "ok", "database": "reachable"}
