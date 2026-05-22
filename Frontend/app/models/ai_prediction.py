from __future__ import annotations

from datetime import datetime
from typing import Any, Dict

from beanie import Document
from pydantic import Field


class AIPrediction(Document):
    prediction_type: str = Field(index=True)
    subject_id: str | None = None
    payload: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "ai_predictions"
