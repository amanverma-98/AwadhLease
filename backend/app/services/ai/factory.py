from __future__ import annotations

from functools import lru_cache

from app.core.config import get_settings
from app.services.ai.base import AIClient
from app.services.ai.noop_client import NoopAIClient


@lru_cache
def get_ai_client() -> AIClient:
    settings = get_settings()
    if settings.groq_api_key and settings.prefer_groq:
        try:
            from app.services.ai.groq_client import GroqClient
        except ImportError:
            return NoopAIClient()
        return GroqClient(settings)

    if settings.gemini_api_key:
        try:
            from app.services.ai.gemini_client import GeminiClient
        except ImportError:
            return NoopAIClient()
        return GeminiClient(settings)

    if settings.groq_api_key:
        try:
            from app.services.ai.groq_client import GroqClient
        except ImportError:
            return NoopAIClient()
        return GroqClient(settings)

    return NoopAIClient()
