from __future__ import annotations

from datetime import datetime

from beanie import Document, Link
from pydantic import Field

from app.models.user import User


class AIConversation(Document):
    user_id: Link[User] | None = Field(default=None, index=True)
    title: str | None = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "ai_conversations"
