from __future__ import annotations

from pydantic import BaseModel, field_validator

MAX_BCRYPT_PASSWORD_BYTES = 72


def _validate_password_bytes(value: str) -> str:
    if len(value.encode("utf-8")) > MAX_BCRYPT_PASSWORD_BYTES:
        raise ValueError("Password must be 72 bytes or fewer")
    return value


class RegisterLandlordRequest(BaseModel):
    full_name: str
    email: str
    phone: str
    password: str
    property_type: str
    property_count: int

    @field_validator("password")
    @classmethod
    def password_length(cls, value: str) -> str:
        return _validate_password_bytes(value)


class LoginRequest(BaseModel):
    email: str
    password: str

    @field_validator("password")
    @classmethod
    def password_length(cls, value: str) -> str:
        return _validate_password_bytes(value)


class RefreshRequest(BaseModel):
    refresh_token: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class AuthUserResponse(BaseModel):
    id: str
    full_name: str
    email: str
    phone: str
    role: str
