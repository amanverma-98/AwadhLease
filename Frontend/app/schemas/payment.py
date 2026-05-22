from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, field_serializer

from Frontend.app.schemas.base import DocumentOut


class PaymentCreate(BaseModel):
    tenant_id: str
    property_id: str
    amount: float
    payment_date: datetime
    payment_status: str


class PaymentOut(DocumentOut):
    tenant_id: str
    property_id: str
    amount: float
    payment_date: datetime
    payment_status: str

    @field_serializer("tenant_id", "property_id")
    def serialize_ids(self, value):
        return "" if value is None else str(value)
