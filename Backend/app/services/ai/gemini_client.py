from __future__ import annotations

import asyncio
from typing import Any, Dict, Optional

import google.generativeai as genai
from google.api_core.exceptions import NotFound

from app.core.config import Settings
from app.services.ai.base import AIClient
from app.utils.json_utils import extract_json


class GeminiClient(AIClient):
    def __init__(self, settings: Settings) -> None:
        genai.configure(api_key=settings.gemini_api_key)
        self._model_name = settings.gemini_model
        self._model = genai.GenerativeModel(self._model_name)
        self._fallback_models = [
            "gemini-1.5-flash-002",
            "gemini-1.5-pro-002",
            "gemini-1.0-pro",
        ]

    def _swap_model(self, model_name: str) -> None:
        self._model_name = model_name
        self._model = genai.GenerativeModel(model_name)

    async def generate_text(self, prompt: str, system_prompt: Optional[str] = None) -> str:
        full_prompt = prompt if system_prompt is None else f"{system_prompt}\n\n{prompt}"
        try:
            response = await asyncio.to_thread(self._model.generate_content, full_prompt)
            return response.text or ""
        except NotFound:
            for fallback in self._fallback_models:
                if fallback == self._model_name:
                    continue
                self._swap_model(fallback)
                try:
                    response = await asyncio.to_thread(
                        self._model.generate_content,
                        full_prompt,
                    )
                    return response.text or ""
                except NotFound:
                    continue
            raise

    async def generate_json(
        self, prompt: str, system_prompt: Optional[str] = None
    ) -> Dict[str, Any]:
        json_prompt = (
            f"{prompt}\n\nRespond with a JSON object only, no markdown."
        )
        response_text = await self.generate_text(json_prompt, system_prompt)
        return extract_json(response_text)
