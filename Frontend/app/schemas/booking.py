from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, field_serializer

from Frontend.app.schemas.base import DocumentOut


class BookingCreate(BaseModel):
    property_id: str
    tenant_name: str
    tenant_phone: str
    scheduled_at: datetime
    message: str | None = None


class BookingOut(DocumentOut):
    property_id: str
    tenant_name: str
    tenant_phone: str
    scheduled_at: datetime
    status: str
    message: str | None
    created_at: datetime

    @field_serializer("property_id")
    def serialize_property_id(self, value):
        return "" if value is None else str(value)
