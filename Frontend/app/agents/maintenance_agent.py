from __future__ import annotations

from Frontend.app.agents.base import BaseAgent
from Frontend.app.schemas.ai import MaintenanceClassification


class MaintenanceClassificationAgent(BaseAgent):
    async def classify(self, issue: str) -> MaintenanceClassification:
        prompt = (
            "Classify the maintenance issue and return category, priority, estimated_cost, summary. "
            f"Issue: {issue}"
        )
        data = await self.client.generate_json(prompt, self.system_prompt)
        return MaintenanceClassification.model_validate(data)
