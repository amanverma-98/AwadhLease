from __future__ import annotations

from typing import Any, Dict, Optional


class AIClient:
    async def generate_text(self, prompt: str, system_prompt: Optional[str] = None) -> str:
        raise NotImplementedError

    async def generate_json(
        self, prompt: str, system_prompt: Optional[str] = None
    ) -> Dict[str, Any]:
        raise NotImplementedError
