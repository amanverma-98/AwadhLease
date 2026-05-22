from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from beanie import Document, Link
from pydantic import Field

from Frontend.app.models.property import Property
from Frontend.app.models.tenant import Tenant


class MaintenanceTicket(Document):
    property_id: Link[Property] = Field(index=True)
    tenant_id: Link[Tenant]
    issue: str
    issue_images: List[str] = Field(default_factory=list)
    category: str
    priority: str
    estimated_cost: float
    status: str
    assigned_vendor: Optional[str] = None
    summary: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "maintenance_tickets"
