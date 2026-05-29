from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, field_serializer

from app.schemas.base import DocumentOut
from app.utils.link import get_link_id


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
        return "" if value is None else (get_link_id(value) or "")
