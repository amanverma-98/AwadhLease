from __future__ import annotations

from datetime import datetime

from beanie import Document, Link
from pydantic import Field

from app.models.ai_conversation import AIConversation


class AIMessage(Document):
    conversation_id: Link[AIConversation] = Field(index=True)
    role: str
    content: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "ai_messages"
