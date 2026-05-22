from __future__ import annotations

from typing import List

from beanie import PydanticObjectId
from fastapi import HTTPException

from Frontend.app.models.payment import Payment
from Frontend.app.models.property import Property
from Frontend.app.models.tenant import Tenant
from Frontend.app.schemas.payment import PaymentCreate, PaymentOut


class PaymentService:
    async def list_payments(self, skip: int, limit: int) -> List[PaymentOut]:
        items = await Payment.find().skip(skip).limit(limit).to_list()
        return [PaymentOut.model_validate(item) for item in items]

    async def create_payment(self, payload: PaymentCreate) -> PaymentOut:
        tenant_doc = await Tenant.get(PydanticObjectId(payload.tenant_id))
        if not tenant_doc:
            raise HTTPException(status_code=404, detail="Tenant not found")
        property_doc = await Property.get(PydanticObjectId(payload.property_id))
        if not property_doc:
            raise HTTPException(status_code=404, detail="Property not found")
        doc = Payment(
            tenant_id=tenant_doc,
            property_id=property_doc,
            amount=payload.amount,
            payment_date=payload.payment_date,
            payment_status=payload.payment_status,
        )
        await doc.insert()
        return PaymentOut.model_validate(doc)
