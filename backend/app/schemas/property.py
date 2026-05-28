from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel

from app.schemas.base import DocumentOut


class PropertyCreate(BaseModel):
    name: str
    address: str
    city: str = "Lucknow"
    locality: str | None = None
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
    images: List[str] = []
    amenities: List[str] = []
    rules: List[str] = []
    available_from: datetime | None = None
    latitude: float | None = None
    longitude: float | None = None
    description: str | None = None


class PropertyUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    locality: Optional[str] = None
    property_type: Optional[str] = None
    bhk: int | None = None
    furnished: bool | None = None
    parking: bool | None = None
    wifi: bool | None = None
    ac: bool | None = None
    pet_friendly: bool | None = None
    occupancy_status: Optional[str] = None
    monthly_rent: Optional[float] = None
    security_deposit: float | None = None
    images: List[str] | None = None
    amenities: List[str] | None = None
    rules: List[str] | None = None
    available_from: datetime | None = None
    latitude: float | None = None
    longitude: float | None = None
    description: str | None = None


class PropertyOut(DocumentOut):
    name: str
    address: str
    city: str
    locality: str
    property_type: str
    bhk: int | None
    furnished: bool | None
    parking: bool | None
    wifi: bool | None
    ac: bool | None
    pet_friendly: bool | None
    occupancy_status: str
    monthly_rent: float
    security_deposit: float | None
    images: List[str]
    amenities: List[str]
    rules: List[str]
    available_from: datetime | None
    latitude: float | None
    longitude: float | None
    description: str | None
    created_at: datetime
    updated_at: datetime
