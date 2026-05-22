from __future__ import annotations

from typing import List, Tuple

import secrets

from beanie import PydanticObjectId
from fastapi import HTTPException

from app.core.security import hash_password
from app.models.landlord import Landlord
from app.models.property import Property
from app.models.tenant import Tenant
from app.models.user import User
from app.schemas.tenant import TenantCreate, TenantCreateResponse, TenantOut, TenantUpdate


class TenantService:
    async def list_tenants(
        self, skip: int, limit: int, property_id: str | None
    ) -> Tuple[List[TenantOut], int]:
        query = Tenant.find()
        if property_id:
            query = Tenant.find(Tenant.property_id.id == PydanticObjectId(property_id))
        total = await query.count()
        items = await query.skip(skip).limit(limit).to_list()
        return [self._to_out(item) for item in items], total

    async def create_tenant(self, payload: TenantCreate) -> TenantCreateResponse:
        property_doc = await Property.get(PydanticObjectId(payload.property_id))
        if not property_doc:
            raise HTTPException(status_code=404, detail="Property not found")
        landlord_doc = None
        if payload.landlord_id:
            landlord_doc = await Landlord.get(PydanticObjectId(payload.landlord_id))
            if not landlord_doc:
                raise HTTPException(status_code=404, detail="Landlord not found")

        temp_password = secrets.token_urlsafe(8)
        user = User(
            full_name=payload.full_name,
            email=payload.email,
            phone=payload.phone,
            password_hash=hash_password(temp_password),
            role="tenant",
        )
        await user.insert()

        data = payload.model_dump()
        data["property_id"] = property_doc
        data["landlord_id"] = landlord_doc
        data["user_id"] = user
        doc = Tenant(**data)
        await doc.insert()
        return TenantCreateResponse(
            tenant=self._to_out(doc),
            username=user.email,
            temporary_password=temp_password,
        )

    async def update_tenant(self, tenant_id: str, payload: TenantUpdate) -> TenantOut:
        doc = await Tenant.get(PydanticObjectId(tenant_id))
        if not doc:
            raise HTTPException(status_code=404, detail="Tenant not found")
        update_data = payload.model_dump(exclude_unset=True)
        if "property_id" in update_data:
            property_doc = await Property.get(PydanticObjectId(update_data["property_id"]))
            if not property_doc:
                raise HTTPException(status_code=404, detail="Property not found")
            update_data["property_id"] = property_doc
        if "landlord_id" in update_data:
            landlord_doc = await Landlord.get(PydanticObjectId(update_data["landlord_id"]))
            if not landlord_doc:
                raise HTTPException(status_code=404, detail="Landlord not found")
            update_data["landlord_id"] = landlord_doc
        for key, value in update_data.items():
            setattr(doc, key, value)
        await doc.save()
        return self._to_out(doc)

    async def delete_tenant(self, tenant_id: str) -> None:
        doc = await Tenant.get(PydanticObjectId(tenant_id))
        if not doc:
            raise HTTPException(status_code=404, detail="Tenant not found")
        await doc.delete()

    @staticmethod
    def _to_out(doc: Tenant) -> TenantOut:
        return TenantOut(
            id=str(doc.id),
            property_id=str(doc.property_id.id) if doc.property_id else "",
            landlord_id=str(doc.landlord_id.id) if doc.landlord_id else None,
            full_name=doc.full_name,
            phone=doc.phone,
            email=doc.email,
            aadhaar_number=doc.aadhaar_number,
            pan_number=doc.pan_number,
            lease_start=doc.lease_start,
            lease_end=doc.lease_end,
            rent_status=doc.rent_status,
            status=doc.status,
            created_at=doc.created_at,
        )
