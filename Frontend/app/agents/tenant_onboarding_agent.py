from __future__ import annotations

from Frontend.app.agents.base import BaseAgent
from Frontend.app.schemas.ai import TenantOnboardingResult


class TenantOnboardingAgent(BaseAgent):
    async def parse_profile(self, raw_text: str) -> TenantOnboardingResult:
        prompt = (
            "Extract tenant profile fields and validate Aadhaar/PAN formats. "
            f"Raw text: {raw_text}"
        )
        data = await self.client.generate_json(prompt, self.system_prompt)
        return TenantOnboardingResult.model_validate(data)
