from __future__ import annotations

from typing import Any, Dict, Optional

from groq import AsyncGroq

from app.core.config import Settings
from app.services.ai.base import AIClient
from app.utils.json_utils import extract_json


class GroqClient(AIClient):
    def __init__(self, settings: Settings) -> None:
        self._client = AsyncGroq(api_key=settings.groq_api_key)
        self._model = settings.groq_model

    async def generate_text(self, prompt: str, system_prompt: Optional[str] = None) -> str:
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        response = await self._client.chat.completions.create(
            model=self._model,
            messages=messages,
            temperature=0.2,
        )
        return response.choices[0].message.content or ""

    async def generate_json(
        self, prompt: str, system_prompt: Optional[str] = None
    ) -> Dict[str, Any]:
        json_prompt = f"{prompt}\n\nRespond with a JSON object only, no markdown."
        response_text = await self.generate_text(json_prompt, system_prompt)
        return extract_json(response_text)
