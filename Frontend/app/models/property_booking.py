from __future__ import annotations

from datetime import datetime

from beanie import Document, Link
from pydantic import Field

from Frontend.app.models.property import Property


class PropertyBooking(Document):
    property_id: Link[Property] = Field(index=True)
    tenant_name: str
    tenant_phone: str
    scheduled_at: datetime
    status: str = "Requested"
    message: str | None = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "property_bookings"
