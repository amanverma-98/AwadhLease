from __future__ import annotations

from datetime import datetime

from beanie import Document, Link
from pydantic import Field

from app.models.property import Property
from app.models.tenant import Tenant


class Review(Document):
    property_id: Link[Property] = Field(index=True)
    tenant_id: Link[Tenant] = Field(index=True)
    rating: int
    comment: str | None = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "reviews"
