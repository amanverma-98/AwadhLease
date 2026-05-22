from __future__ import annotations

from datetime import datetime
from typing import Optional

from beanie import Document, Link
from pydantic import Field

from app.models.landlord import Landlord
from app.models.property import Property
from app.models.user import User


class Tenant(Document):
    property_id: Link[Property] = Field(index=True)
    landlord_id: Optional[Link[Landlord]] = Field(default=None, index=True)
    user_id: Optional[Link[User]] = Field(default=None, index=True)
    full_name: str
    phone: str = Field(index=True)
    email: str
    aadhaar_number: str
    pan_number: str
    lease_start: datetime
    lease_end: datetime
    rent_status: str
    status: str = "Active"
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "tenants"
