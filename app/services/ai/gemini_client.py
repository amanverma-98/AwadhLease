from __future__ import annotations

import asyncio
from typing import Any, Dict, Optional

import google.generativeai as genai

from app.core.config import Settings
from app.services.ai.base import AIClient
from app.utils.json_utils import extract_json


class GeminiClient(AIClient):
    def __init__(self, settings: Settings) -> None:
        genai.configure(api_key=settings.gemini_api_key)
        self._model = genai.GenerativeModel(settings.gemini_model)

    async def generate_text(self, prompt: str, system_prompt: Optional[str] = None) -> str:
        full_prompt = prompt if system_prompt is None else f"{system_prompt}\n\n{prompt}"
        response = await asyncio.to_thread(self._model.generate_content, full_prompt)
        return response.text or ""

    async def generate_json(
        self, prompt: str, system_prompt: Optional[str] = None
    ) -> Dict[str, Any]:
        json_prompt = (
            f"{prompt}\n\nRespond with a JSON object only, no markdown."
        )
        response_text = await self.generate_text(json_prompt, system_prompt)
        return extract_json(response_text)
