from __future__ import annotations

import logging

from app.agents.base import BaseAgent
from app.schemas.ai import MaintenanceClassification

logger = logging.getLogger(__name__)


class MaintenanceClassificationAgent(BaseAgent):
    async def classify(self, issue: str) -> MaintenanceClassification:
        prompt = (
            "Classify the maintenance issue and return category, priority, estimated_cost, summary. "
            f"Issue: {issue}"
        )
        try:
            data = await self.client.generate_json(prompt, self.system_prompt)
            return MaintenanceClassification.model_validate(data)
        except Exception as exc:
            logger.warning(
                "Maintenance classification AI unavailable; using fallback. error=%s",
                exc,
            )
            summary = issue.strip()
            if not summary:
                summary = "Maintenance issue reported. Manual review required."
            else:
                summary = summary[:200]
            return MaintenanceClassification(
                category="General",
                priority="Medium",
                estimated_cost=0.0,
                summary=summary,
            )
