from __future__ import annotations

from datetime import datetime

from beanie import Document, Link
from pydantic import Field

from app.models.tenant import Tenant


class TenantRiskScore(Document):
    tenant_id: Link[Tenant] = Field(index=True)
    score: float
    risk_level: str
    reason: str | None = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "tenant_risk_scores"
