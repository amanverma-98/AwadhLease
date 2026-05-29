from __future__ import annotations

from typing import List, Tuple

import secrets

from beanie import PydanticObjectId
from bson.errors import InvalidId
from fastapi import HTTPException

from app.core.security import hash_password
from app.models.landlord import Landlord
from app.models.property import Property
from app.models.tenant import Tenant
from app.models.user import User
from app.schemas.tenant import TenantCreate, TenantCreateResponse, TenantOut, TenantUpdate
from app.services.email_service import EmailService
from app.utils.link import get_link_id


class TenantService:
    @staticmethod
    def _extract_link_id(value: object) -> str | None:
        return get_link_id(value)

    async def list_tenants(
        self,
        user: User,
        skip: int,
        limit: int,
        property_id: str | None,
    ) -> Tuple[List[TenantOut], int]:
        landlord = await Landlord.find(Landlord.user_id.id == user.id).first_or_none()
        if not landlord:
            return [], 0

        if property_id:
            query = Tenant.find(
                Tenant.landlord_id.id == landlord.id,
                Tenant.property_id.id == PydanticObjectId(property_id),
            )
        else:
            query = Tenant.find(Tenant.landlord_id.id == landlord.id)

        total = await query.count()
        items = await query.skip(skip).limit(limit).to_list()
        return [self._to_out(item) for item in items], total

    async def create_tenant(self, payload: TenantCreate, user: User) -> TenantCreateResponse:
        if not payload.property_id:
            raise HTTPException(status_code=400, detail="Property ID is required")
        try:
            property_id = PydanticObjectId(payload.property_id)
        except InvalidId as exc:
            raise HTTPException(status_code=400, detail="Invalid property ID") from exc
        property_doc = await Property.get(property_id)
        if not property_doc:
            raise HTTPException(status_code=404, detail="Property not found")

        landlord_doc = await Landlord.find(Landlord.user_id.id == user.id).first_or_none()
        if not landlord_doc:
            raise HTTPException(status_code=404, detail="Landlord profile not found")
        if payload.landlord_id:
            explicit = await Landlord.get(PydanticObjectId(payload.landlord_id))
            if not explicit:
                raise HTTPException(status_code=404, detail="Landlord not found")
            landlord_doc = explicit

        existing = await Tenant.find(
            Tenant.landlord_id.id == landlord_doc.id,
            Tenant.property_id.id == property_doc.id,
            Tenant.email == payload.email,
            Tenant.phone == payload.phone,
        ).first_or_none()
        if existing:
            raise HTTPException(
                status_code=409,
                detail="Tenant already exists for this property and contact info",
            )

        existing_user = await User.find(User.email == payload.email).first_or_none()
        if existing_user:
            raise HTTPException(
                status_code=409,
                detail="User email already exists. Use a different email for tenant.",
            )

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
        await EmailService().send_tenant_welcome(
            tenant_email=user.email,
            temporary_password=temp_password,
        )
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
            property_id=TenantService._extract_link_id(doc.property_id) or "",
            landlord_id=TenantService._extract_link_id(doc.landlord_id),
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
