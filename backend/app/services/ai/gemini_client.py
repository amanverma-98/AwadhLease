from __future__ import annotations

import asyncio
from typing import Any, Dict, Optional

from google import genai

from app.core.config import Settings
from app.services.ai.base import AIClient
from app.utils.json_utils import extract_json


def _extract_text(response: Any) -> str:
    if getattr(response, "text", None):
        return response.text
    try:
        return response.candidates[0].content.parts[0].text
    except Exception:
        return ""


class GeminiClient(AIClient):
    def __init__(self, settings: Settings) -> None:
        self._client = genai.Client(api_key=settings.gemini_api_key)
        self._model = settings.gemini_model

    async def generate_text(self, prompt: str, system_prompt: Optional[str] = None) -> str:
        full_prompt = prompt if system_prompt is None else f"{system_prompt}\n\n{prompt}"
        response = await asyncio.to_thread(
            self._client.models.generate_content,
            model=self._model,
            contents=full_prompt,
        )
        return _extract_text(response)

    async def generate_json(
        self, prompt: str, system_prompt: Optional[str] = None
    ) -> Dict[str, Any]:
        json_prompt = (
            f"{prompt}\n\nRespond with a JSON object only, no markdown."
        )
        response_text = await self.generate_text(json_prompt, system_prompt)
        return extract_json(response_text)
