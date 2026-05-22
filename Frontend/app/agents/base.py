from __future__ import annotations

from Frontend.app.services.ai.base import AIClient


class BaseAgent:
    def __init__(self, client: AIClient, system_prompt: str) -> None:
        self.client = client
        self.system_prompt = system_prompt
