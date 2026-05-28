from __future__ import annotations

from app.agents.base import BaseAgent
from app.schemas.ai import RentReminder


class RentReminderAgent(BaseAgent):
    async def generate_reminder(self, history_text: str) -> RentReminder:
        prompt = (
            "Create a localized rent reminder with risk level and WhatsApp/SMS-ready template. "
            f"History: {history_text}"
        )
        data = await self.client.generate_json(prompt, self.system_prompt)
        return RentReminder.model_validate(data)
