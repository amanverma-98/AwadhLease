from __future__ import annotations

from app.agents.base import BaseAgent
from app.schemas.ai import AnalyticsInsight


class AnalyticsAgent(BaseAgent):
    async def summarize(self, metrics_text: str) -> AnalyticsInsight:
        prompt = (
            "Return JSON with keys: summary (string), risks (array of strings), opportunities (array of strings). "
            "Use only the provided metrics and avoid placeholders. "
            f"Metrics: {metrics_text}"
        )
        data = await self.client.generate_json(prompt, self.system_prompt)
        normalized = self._normalize_insight_payload(data)
        return AnalyticsInsight.model_validate(normalized)

    @staticmethod
    def _normalize_insight_payload(data: object) -> dict:
        if isinstance(data, dict):
            payload = dict(data)
        else:
            payload = {"summary": str(data)}

        if "summary" not in payload and "insights" in payload:
            payload["summary"] = str(payload.get("insights"))

        for key in ("risks", "opportunities"):
            value = payload.get(key, [])
            if isinstance(value, dict):
                payload[key] = [f"{k}: {v}" for k, v in value.items()]
            elif isinstance(value, str):
                payload[key] = [value]
            elif value is None:
                payload[key] = []

        payload.setdefault("summary", "Summary unavailable due to missing data.")
        payload.setdefault("risks", [])
        payload.setdefault("opportunities", [])
        return payload
