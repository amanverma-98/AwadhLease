from __future__ import annotations

from datetime import datetime

from beanie import Document, Link
from pydantic import Field

from app.models.user import User


class Landlord(Document):
    user_id: Link[User] = Field(index=True)
    property_type: str
    property_count: int
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "landlords"
