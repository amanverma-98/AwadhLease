from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, field_serializer

from app.schemas.base import DocumentOut
from app.utils.link import get_link_id


class ConversationOut(DocumentOut):
    user_id: str | None
    title: str | None
    created_at: datetime

    @field_serializer("user_id")
    def serialize_user_id(self, value):
        return None if value is None else get_link_id(value)


class MessageOut(DocumentOut):
    conversation_id: str
    role: str
    content: str
    created_at: datetime

    @field_serializer("conversation_id")
    def serialize_conversation_id(self, value):
        return "" if value is None else (get_link_id(value) or "")
