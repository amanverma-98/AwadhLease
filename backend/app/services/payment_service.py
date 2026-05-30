from __future__ import annotations

from datetime import datetime
import secrets
from typing import List

from beanie import PydanticObjectId
from bson.errors import InvalidId
from fastapi import HTTPException

from app.models.landlord import Landlord
from app.models.payment import Payment
from app.models.property import Property
from app.models.tenant import Tenant
from app.models.user import User
from app.schemas.payment import PaymentCreate, PaymentOut, TenantPaymentCreate
from app.utils.link import get_link_id
from app.utils.user_context import get_tenant_for_user


class PaymentService:
    async def list_for_user(
        self,
        user: User,
        skip: int,
        limit: int,
        tenant_id: str | None,
        property_id: str | None,
        status: str | None,
        date_from: datetime | None,
        date_to: datetime | None,
    ) -> List[PaymentOut]:
        if user.role == "tenant":
            tenant_doc = await get_tenant_for_user(user)
            if not tenant_doc:
                return []
            filters = {"tenant_id.$id": tenant_doc.id}

            if property_id:
                try:
                    filters["property_id.$id"] = PydanticObjectId(property_id)
                except InvalidId as exc:
                    raise HTTPException(status_code=400, detail="Invalid property ID") from exc
            if status:
                filters["payment_status"] = status
            if date_from or date_to:
                range_filter = {}
                if date_from:
                    range_filter["$gte"] = date_from
                if date_to:
                    range_filter["$lte"] = date_to
                filters["payment_date"] = range_filter

            items = await Payment.find(filters).skip(skip).limit(limit).to_list()
            return [PaymentOut.model_validate(item) for item in items]

        if user.role == "landlord":
            landlord = await Landlord.find(Landlord.user_id.id == user.id).first_or_none()
            if not landlord:
                return []
            tenant_docs = await Tenant.find(Tenant.landlord_id.id == landlord.id).to_list()
            tenant_ids = [t.id for t in tenant_docs]
            if not tenant_ids:
                return []
            if tenant_id:
                try:
                    tenant_object_id = PydanticObjectId(tenant_id)
                except InvalidId as exc:
                    raise HTTPException(status_code=400, detail="Invalid tenant ID") from exc
                if tenant_object_id not in tenant_ids:
                    return []
                tenant_ids = [tenant_object_id]

            filters = {"tenant_id.$id": {"$in": tenant_ids}}

            if property_id:
                try:
                    property_object_id = PydanticObjectId(property_id)
                except InvalidId as exc:
                    raise HTTPException(status_code=400, detail="Invalid property ID") from exc

                property_doc = await Property.find(
                    Property.landlord_id.id == landlord.id,
                    Property.id == property_object_id,
                ).first_or_none()
                if not property_doc:
                    return []
                filters["property_id.$id"] = property_object_id

            if status:
                filters["payment_status"] = status
            if date_from or date_to:
                range_filter = {}
                if date_from:
                    range_filter["$gte"] = date_from
                if date_to:
                    range_filter["$lte"] = date_to
                filters["payment_date"] = range_filter

            items = await Payment.find(filters).skip(skip).limit(limit).to_list()
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
            transaction_id=payload.transaction_id,
        )
        await doc.insert()
        return PaymentOut.model_validate(doc)

    async def create_tenant_payment(self, payload: TenantPaymentCreate, user: User) -> PaymentOut:
        tenant_doc = await get_tenant_for_user(user)
        if not tenant_doc:
            raise HTTPException(status_code=404, detail="Tenant profile not found")
        if not tenant_doc.property_id:
            raise HTTPException(status_code=404, detail="Tenant property not found")

        property_id = get_link_id(tenant_doc.property_id)
        if not property_id:
            raise HTTPException(status_code=404, detail="Tenant property not found")
        property_doc = await Property.get(PydanticObjectId(property_id))
        if not property_doc:
            raise HTTPException(status_code=404, detail="Property not found")

        transaction_id = payload.transaction_id or f"TXN-{secrets.token_hex(6)}"
        doc = Payment(
            tenant_id=tenant_doc,
            property_id=property_doc,
            amount=payload.amount,
            payment_date=payload.payment_date or datetime.utcnow(),
            payment_status=payload.payment_status,
            transaction_id=transaction_id,
        )
        await doc.insert()
        return PaymentOut.model_validate(doc)
