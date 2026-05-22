from __future__ import annotations

from datetime import datetime

from beanie import Document, Link
from pydantic import Field

from Frontend.app.models.property import Property
from Frontend.app.models.tenant import Tenant


class Payment(Document):
    tenant_id: Link[Tenant] = Field(index=True)
    property_id: Link[Property] = Field(index=True)
    amount: float
    payment_date: datetime
    payment_status: str

    class Settings:
        name = "payments"
