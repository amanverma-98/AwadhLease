from __future__ import annotations

from functools import lru_cache

from app.core.config import get_settings
from app.services.ai.base import AIClient
from app.services.ai.gemini_client import GeminiClient


@lru_cache
def get_ai_client() -> AIClient:
    settings = get_settings()
    return GeminiClient(settings)
