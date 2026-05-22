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


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
