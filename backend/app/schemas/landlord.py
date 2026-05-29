from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, field_serializer

from app.schemas.base import DocumentOut
from app.utils.link import get_link_id


class LandlordOut(DocumentOut):
    user_id: str
    property_type: str
    property_count: int
    created_at: datetime

    @field_serializer("user_id")
    def serialize_user_id(self, value):
        return "" if value is None else (get_link_id(value) or "")
