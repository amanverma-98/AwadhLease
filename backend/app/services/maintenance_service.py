from __future__ import annotations

from typing import List, Tuple

from beanie import PydanticObjectId
from fastapi import HTTPException

from app.agents.maintenance_agent import MaintenanceClassificationAgent
from app.core.config import get_settings
from app.models.maintenance import MaintenanceTicket
from app.models.property import Property
from app.models.tenant import Tenant
from app.schemas.maintenance import MaintenanceCreate, MaintenanceOut
from app.services.ai.factory import get_ai_client


class MaintenanceService:
    def __init__(self) -> None:
        settings = get_settings()
        self._agent = MaintenanceClassificationAgent(get_ai_client(), settings.system_prompt)

    async def list_tickets(
        self, skip: int, limit: int, priority: str | None, status: str | None
    ) -> Tuple[List[MaintenanceOut], int]:
        filters = []
        if priority:
            filters.append(MaintenanceTicket.priority == priority)
        if status:
            filters.append(MaintenanceTicket.status == status)
        query = MaintenanceTicket.find(*filters)
        total = await query.count()
        items = await query.skip(skip).limit(limit).to_list()
        return [self._to_out(item) for item in items], total

    async def create_ticket(self, payload: MaintenanceCreate) -> MaintenanceOut:
        property_doc = await Property.get(PydanticObjectId(payload.property_id))
        if not property_doc:
            raise HTTPException(status_code=404, detail="Property not found")
        tenant_doc = await Tenant.get(PydanticObjectId(payload.tenant_id))
        if not tenant_doc:
            raise HTTPException(status_code=404, detail="Tenant not found")

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
