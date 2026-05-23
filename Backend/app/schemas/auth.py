from __future__ import annotations

from pydantic import BaseModel


class RegisterLandlordRequest(BaseModel):
    full_name: str
    email: str
    phone: str
    password: str
    property_type: str
    property_count: int


class LoginRequest(BaseModel):
    email: str
    password: str


class RefreshRequest(BaseModel):
    refresh_token: str


class ForgotPasswordRequest(BaseModel):
    email: str


class ForgotPasswordResponse(BaseModel):
    status: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class UserMeResponse(BaseModel):
    id: str
    full_name: str
    email: str
    phone: str
    role: str
    landlord_id: str | None = None
    tenant_id: str | None = None
    property_id: str | None = None
    lease_start: str | None = None
    lease_end: str | None = None
    rent_status: str | None = None
