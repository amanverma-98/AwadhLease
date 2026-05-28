from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel

from app.schemas.base import DocumentOut


class MaintenanceCreate(BaseModel):
    property_id: str | None = None
    tenant_id: str | None = None
    issue: str
    issue_images: List[str] = []


class MaintenanceOut(DocumentOut):
    property_id: str
    tenant_id: str
    issue: str
    issue_images: List[str]
    category: str
    priority: str
    estimated_cost: float
    status: str
    assigned_vendor: Optional[str]
    summary: Optional[str]
    created_at: datetime
