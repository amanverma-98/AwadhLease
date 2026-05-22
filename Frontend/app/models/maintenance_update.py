from __future__ import annotations

from datetime import datetime

from beanie import Document, Link
from pydantic import Field

from Frontend.app.models.maintenance import MaintenanceTicket


class MaintenanceUpdate(Document):
    ticket_id: Link[MaintenanceTicket] = Field(index=True)
    status: str
    note: str | None = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "maintenance_updates"
