from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, field_serializer

from app.schemas.base import DocumentOut
from app.utils.link import get_link_id


class PaymentCreate(BaseModel):
    tenant_id: str
    property_id: str
    amount: float
    payment_date: datetime
    payment_status: str
    transaction_id: str | None = None


class TenantPaymentCreate(BaseModel):
    amount: float
    payment_date: datetime | None = None
    payment_status: str = "paid"
    transaction_id: str | None = None


class PaymentOut(DocumentOut):
    tenant_id: str
    property_id: str
    amount: float
    payment_date: datetime
    payment_status: str
    transaction_id: str | None = None

    @field_serializer("tenant_id", "property_id")
    def serialize_ids(self, value):
        return "" if value is None else (get_link_id(value) or "")
