from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel

from app.schemas.base import DocumentOut


class TenantCreate(BaseModel):
    property_id: str
    landlord_id: str | None = None
    full_name: str
    phone: str
    email: str
    aadhaar_number: str
    pan_number: str
    lease_start: datetime
    lease_end: datetime
    rent_status: str


class TenantUpdate(BaseModel):
    property_id: Optional[str] = None
    landlord_id: Optional[str] = None
    full_name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    aadhaar_number: Optional[str] = None
    pan_number: Optional[str] = None
    lease_start: Optional[datetime] = None
    lease_end: Optional[datetime] = None
    rent_status: Optional[str] = None


class TenantOut(DocumentOut):
    property_id: str
    landlord_id: str | None = None
    full_name: str
    phone: str
    email: str
    aadhaar_number: str
    pan_number: str
    lease_start: datetime
    lease_end: datetime
    rent_status: str
    status: str
    created_at: datetime


class TenantCreateResponse(BaseModel):
    tenant: TenantOut
    username: str
    temporary_password: str
