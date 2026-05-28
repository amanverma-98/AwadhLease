from __future__ import annotations

from datetime import datetime
from typing import Any, Dict

from beanie import Document
from pydantic import Field


class AnalyticsSnapshot(Document):
    metrics: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "analytics"
