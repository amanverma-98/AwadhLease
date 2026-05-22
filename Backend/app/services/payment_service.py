from __future__ import annotations

from typing import List

from beanie import PydanticObjectId
from fastapi import HTTPException

from app.models.landlord import Landlord
from app.models.payment import Payment
from app.models.property import Property
from app.models.tenant import Tenant
from app.models.user import User
from app.schemas.payment import PaymentCreate, PaymentOut
from app.utils.user_context import get_tenant_for_user


class PaymentService:
    async def list_for_user(self, user: User, skip: int, limit: int) -> List[PaymentOut]:
        if user.role == "tenant":
            tenant_doc = await get_tenant_for_user(user)
            if not tenant_doc:
                return []
            items = (
                await Payment.find(Payment.tenant_id.id == tenant_doc.id)
                .skip(skip)
                .limit(limit)
                .to_list()
            )
            return [PaymentOut.model_validate(item) for item in items]

        if user.role == "landlord":
            landlord = await Landlord.find(Landlord.user_id.id == user.id).first_or_none()
            if not landlord:
                return []
            tenant_docs = await Tenant.find(Tenant.landlord_id.id == landlord.id).to_list()
            tenant_ids = [t.id for t in tenant_docs]
            if not tenant_ids:
                return []
            items = (
                await Payment.find({"tenant_id.$id": {"$in": tenant_ids}})
                .skip(skip)
                .limit(limit)
                .to_list()
            )
            return [PaymentOut.model_validate(item) for item in items]

        return []

    async def create_payment(self, payload: PaymentCreate, user: User) -> PaymentOut:
        if user.role != "landlord":
            raise HTTPException(status_code=403, detail="Only landlords can record payments")

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
