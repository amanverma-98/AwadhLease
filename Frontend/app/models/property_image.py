from __future__ import annotations

from datetime import datetime

from beanie import Document, Link
from pydantic import Field

from Frontend.app.models.property import Property


class PropertyImage(Document):
    property_id: Link[Property] = Field(index=True)
    url: str
    label: str | None = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "property_images"
