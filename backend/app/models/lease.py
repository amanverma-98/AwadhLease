from __future__ import annotations

from datetime import datetime

from beanie import Document, Link
from pydantic import Field

from app.models.landlord import Landlord
from app.models.property import Property
from app.models.tenant import Tenant


class Lease(Document):
    property_id: Link[Property] = Field(index=True)
    tenant_id: Link[Tenant] = Field(index=True)
    landlord_id: Link[Landlord] = Field(index=True)
    start_date: datetime
    end_date: datetime
    rent_amount: float
    deposit: float
    status: str = "Active"
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "leases"
