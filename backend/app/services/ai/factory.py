from __future__ import annotations

from functools import lru_cache
import logging

from app.core.config import get_settings
from app.services.ai.base import AIClient
from app.services.ai.noop_client import NoopAIClient

logger = logging.getLogger(__name__)


@lru_cache
def get_ai_client() -> AIClient:
    settings = get_settings()
    if not settings.prefer_groq:
        return NoopAIClient()

    if not settings.groq_api_key:
        return NoopAIClient()

    try:
        from app.services.ai.groq_client import GroqClient
        return GroqClient(settings)
    except ImportError:
        logger.warning("Groq client unavailable; using Noop AI client.")
        return NoopAIClient()
