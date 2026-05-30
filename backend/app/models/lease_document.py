from __future__ import annotations

from datetime import datetime

from beanie import Document, Link
from pydantic import Field

from app.models.landlord import Landlord
from app.models.property import Property
from app.models.tenant import Tenant


class LeaseDocument(Document):
    property_id: Link[Property] = Field(index=True)
    tenant_id: Link[Tenant] = Field(index=True)
    landlord_id: Link[Landlord] = Field(index=True)
    file_url: str
    file_name: str
    content_type: str | None = None
    size_bytes: int | None = None
    version: int = 1
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "lease_documents"
