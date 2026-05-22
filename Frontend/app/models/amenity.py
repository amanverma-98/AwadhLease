from __future__ import annotations

from datetime import datetime

from beanie import Document
from pydantic import Field


class Amenity(Document):
    name: str = Field(index=True)
    category: str | None = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "amenities"
