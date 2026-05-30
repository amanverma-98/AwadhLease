from __future__ import annotations

from typing import Any, Dict, Optional

from app.services.ai.base import AIClient


class NoopAIClient(AIClient):
    async def generate_text(self, prompt: str, system_prompt: Optional[str] = None) -> str:
        raise RuntimeError(
            "AI features are disabled. Install groq and set GROQ_API_KEY to enable."
        )

    async def generate_json(
        self, prompt: str, system_prompt: Optional[str] = None
    ) -> Dict[str, Any]:
        raise RuntimeError(
            "AI features are disabled. Install groq and set GROQ_API_KEY to enable."
        )
