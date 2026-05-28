from __future__ import annotations

from datetime import datetime
from typing import Any, Dict

from pydantic import BaseModel, field_serializer

from app.schemas.base import DocumentOut


class NotificationOut(DocumentOut):
    user_id: str
    title: str
    message: str
    channel: str
    status: str
    meta: Dict[str, Any]
    created_at: datetime
    read_at: datetime | None

    @field_serializer("user_id")
    def serialize_user_id(self, value):
        return "" if value is None else str(value)


class NotificationBroadcastRequest(BaseModel):
    title: str
    message: str
    property_id: str | None = None
