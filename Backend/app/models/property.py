from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from beanie import Document, Link
from pydantic import Field

from app.models.landlord import Landlord

class Property(Document):
    landlord_id: Link[Landlord] | None = Field(default=None, index=True)
    name: str = Field(index=True)
    address: str
    city: str = "Lucknow"
    locality: str = Field(default="", index=True)
    property_type: str
    bhk: int | None = None
    furnished: bool | None = None
    parking: bool | None = None
    wifi: bool | None = None
    ac: bool | None = None
    pet_friendly: bool | None = None
    occupancy_status: str
    monthly_rent: float
    security_deposit: float | None = None
    images: List[str] = Field(default_factory=list)
    amenities: List[str] = Field(default_factory=list)
    rules: List[str] = Field(default_factory=list)
    available_from: Optional[datetime] = None
    latitude: float | None = None
    longitude: float | None = None
    description: str | None = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "properties"
