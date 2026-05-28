from __future__ import annotations

import asyncio
import time
from typing import Dict, List

from fastapi import HTTPException, Request

from app.core.config import get_settings


class InMemoryRateLimiter:
    def __init__(self, limit_per_minute: int) -> None:
        self.limit_per_minute = limit_per_minute
        self._hits: Dict[str, List[float]] = {}
        self._lock = asyncio.Lock()

    async def allow(self, key: str) -> bool:
        async with self._lock:
            now = time.time()
            window_start = now - 60
            hits = self._hits.get(key, [])
            hits = [ts for ts in hits if ts >= window_start]
            if len(hits) >= self.limit_per_minute:
                self._hits[key] = hits
                return False
            hits.append(now)
            self._hits[key] = hits
            return True


_rate_limiter: InMemoryRateLimiter | None = None


def get_rate_limiter() -> InMemoryRateLimiter:
    global _rate_limiter
    if _rate_limiter is None:
        settings = get_settings()
        _rate_limiter = InMemoryRateLimiter(settings.rate_limit_per_minute)
    return _rate_limiter


async def rate_limit_dependency(request: Request) -> None:
    limiter = get_rate_limiter()
    client_ip = request.client.host if request.client else "unknown"
    allowed = await limiter.allow(client_ip)
    if not allowed:
        raise HTTPException(status_code=429, detail="Rate limit exceeded")
