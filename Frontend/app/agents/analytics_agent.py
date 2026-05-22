from __future__ import annotations

from Frontend.app.agents.base import BaseAgent
from Frontend.app.schemas.ai import AnalyticsInsight


class AnalyticsAgent(BaseAgent):
    async def summarize(self, metrics_text: str) -> AnalyticsInsight:
        prompt = (
            "Summarize the following analytics metrics into insights, risks, and opportunities. "
            f"Metrics: {metrics_text}"
        )
        data = await self.client.generate_json(prompt, self.system_prompt)
        return AnalyticsInsight.model_validate(data)
