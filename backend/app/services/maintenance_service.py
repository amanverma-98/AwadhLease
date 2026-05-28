from __future__ import annotations

from typing import List, Tuple

from beanie import PydanticObjectId
from fastapi import HTTPException

from app.agents.maintenance_agent import MaintenanceClassificationAgent
from app.core.config import get_settings
from app.models.landlord import Landlord
from app.models.maintenance import MaintenanceTicket
from app.models.property import Property
from app.models.tenant import Tenant
from app.models.user import User
from app.schemas.maintenance import MaintenanceCreate, MaintenanceOut
from app.services.ai.factory import get_ai_client
from app.utils.user_context import get_tenant_for_user


class MaintenanceService:
    def __init__(self) -> None:
        settings = get_settings()
        self._agent = MaintenanceClassificationAgent(get_ai_client(), settings.system_prompt)

    async def list_tickets(
        self,
        user: User,
        skip: int,
        limit: int,
        priority: str | None,
        status: str | None,
    ) -> Tuple[List[MaintenanceOut], int]:
        mongo_filter: dict = {}
        if priority:
            mongo_filter["priority"] = priority
        if status:
            mongo_filter["status"] = status

        if user.role == "tenant":
            tenant_doc = await get_tenant_for_user(user)
            if not tenant_doc:
                return [], 0
            mongo_filter["tenant_id.$id"] = tenant_doc.id
        elif user.role == "landlord":
            landlord = await Landlord.find(Landlord.user_id.id == user.id).first_or_none()
            if not landlord:
                return [], 0
            tenant_docs = await Tenant.find(Tenant.landlord_id.id == landlord.id).to_list()
            tenant_ids = [t.id for t in tenant_docs]
            if not tenant_ids:
                return [], 0
            mongo_filter["tenant_id.$id"] = {"$in": tenant_ids}

        query = MaintenanceTicket.find(mongo_filter)
        total = await query.count()
        items = await query.skip(skip).limit(limit).to_list()
        return [self._to_out(item) for item in items], total

    async def create_ticket(self, payload: MaintenanceCreate, user: User) -> MaintenanceOut:
        property_id = payload.property_id
        tenant_id = payload.tenant_id

        if user.role == "tenant":
            tenant_doc = await get_tenant_for_user(user)
            if not tenant_doc:
                raise HTTPException(
                    status_code=400,
                    detail="Tenant profile not linked to this account",
                )
            tenant_id = str(tenant_doc.id)
            property_id = str(tenant_doc.property_id.id) if tenant_doc.property_id else property_id
        elif not property_id or not tenant_id:
            raise HTTPException(
                status_code=422,
                detail="property_id and tenant_id are required for landlords",
            )

        property_doc = await Property.get(PydanticObjectId(property_id))
        if not property_doc:
            raise HTTPException(status_code=404, detail="Property not found")
        tenant_doc = await Tenant.get(PydanticObjectId(tenant_id))
        if not tenant_doc:
            raise HTTPException(status_code=404, detail="Tenant not found")

        if user.role == "tenant" and tenant_doc.user_id:
            if str(tenant_doc.user_id.id) != str(user.id):
                raise HTTPException(status_code=403, detail="Cannot create ticket for another tenant")

        classification = await self._agent.classify(payload.issue)
        doc = MaintenanceTicket(
            property_id=property_doc,
            tenant_id=tenant_doc,
            issue=payload.issue,
            issue_images=payload.issue_images,
            category=classification.category,
            priority=classification.priority,
            estimated_cost=classification.estimated_cost,
            status="Open",
            summary=classification.summary,
        )
        await doc.insert()
        return self._to_out(doc)

    @staticmethod
    def _to_out(doc: MaintenanceTicket) -> MaintenanceOut:
        return MaintenanceOut(
            id=str(doc.id),
            property_id=str(doc.property_id.id) if doc.property_id else "",
            tenant_id=str(doc.tenant_id.id) if doc.tenant_id else "",
            issue=doc.issue,
            issue_images=doc.issue_images,
            category=doc.category,
            priority=doc.priority,
            estimated_cost=doc.estimated_cost,
            status=doc.status,
            assigned_vendor=doc.assigned_vendor,
            summary=doc.summary,
            created_at=doc.created_at,
        )
