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
from app.schemas.maintenance import MaintenanceCreate, MaintenanceOut, MaintenanceUpdate
from app.services.ai.factory import get_ai_client
from app.utils.link import get_link_id
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
        landlord: Landlord | None = None

        if user.role == "tenant":
            tenant_doc = await get_tenant_for_user(user)
            if not tenant_doc:
                raise HTTPException(
                    status_code=400,
                    detail="Tenant profile not linked to this account",
                )
            tenant_id = str(tenant_doc.id)
            property_id = get_link_id(tenant_doc.property_id) or property_id
        elif user.role == "landlord":
            landlord = await Landlord.find(Landlord.user_id.id == user.id).first_or_none()
            if not landlord:
                raise HTTPException(status_code=404, detail="Landlord profile not found")
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

        if user.role == "landlord":
            property_landlord_id = get_link_id(property_doc.landlord_id)
            if property_landlord_id and str(property_landlord_id) != str(landlord.id):
                raise HTTPException(
                    status_code=403,
                    detail="Cannot create ticket for another landlord",
                )
            tenant_landlord_id = get_link_id(tenant_doc.landlord_id)
            if tenant_landlord_id and str(tenant_landlord_id) != str(landlord.id):
                raise HTTPException(
                    status_code=403,
                    detail="Cannot create ticket for another landlord",
                )

        if user.role == "tenant" and tenant_doc.user_id:
            tenant_user_id = get_link_id(tenant_doc.user_id)
            if tenant_user_id and str(tenant_user_id) != str(user.id):
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

    async def update_ticket(
        self,
        ticket_id: str,
        payload: MaintenanceUpdate,
        user: User,
    ) -> MaintenanceOut:
        if user.role != "landlord":
            raise HTTPException(status_code=403, detail="Only landlords can update tickets")

        doc = await MaintenanceTicket.get(PydanticObjectId(ticket_id))
        if not doc:
            raise HTTPException(status_code=404, detail="Maintenance ticket not found")

        landlord = await Landlord.find(Landlord.user_id.id == user.id).first_or_none()
        if not landlord:
            raise HTTPException(status_code=404, detail="Landlord profile not found")

        property_id = get_link_id(doc.property_id)
        property_doc = None
        if property_id:
            property_doc = await Property.get(PydanticObjectId(property_id))

        tenant_id = get_link_id(doc.tenant_id)
        if not tenant_id:
            raise HTTPException(status_code=404, detail="Tenant not found")
        tenant_doc = await Tenant.get(PydanticObjectId(tenant_id))
        if not tenant_doc:
            raise HTTPException(status_code=404, detail="Tenant not found")

        property_landlord_id = get_link_id(property_doc.landlord_id) if property_doc else None
        tenant_landlord_id = get_link_id(tenant_doc.landlord_id)
        is_authorized = False
        if property_landlord_id:
            is_authorized = str(property_landlord_id) == str(landlord.id)
        elif tenant_landlord_id:
            is_authorized = str(tenant_landlord_id) == str(landlord.id)

        if not is_authorized:
            raise HTTPException(status_code=403, detail="Cannot update ticket for another landlord")

        update_data = payload.model_dump(exclude_unset=True)
        if not update_data:
            raise HTTPException(status_code=400, detail="No updates provided")

        if "status" in update_data and update_data["status"]:
            doc.status = update_data["status"]
        if "assigned_vendor" in update_data:
            doc.assigned_vendor = update_data["assigned_vendor"]

        await doc.save()
        return self._to_out(doc)

    @staticmethod
    def _to_out(doc: MaintenanceTicket) -> MaintenanceOut:
        return MaintenanceOut(
            id=str(doc.id),
            property_id=get_link_id(doc.property_id) or "",
            tenant_id=get_link_id(doc.tenant_id) or "",
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
