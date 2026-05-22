from __future__ import annotations

from datetime import datetime
from typing import Any, Dict

from beanie import Document, Link
from pydantic import Field

from Frontend.app.models.user import User


class Notification(Document):
    user_id: Link[User] = Field(index=True)
    title: str
    message: str
    channel: str = "in_app"
    status: str = "unread"
    meta: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    read_at: datetime | None = None

    class Settings:
        name = "notifications"
