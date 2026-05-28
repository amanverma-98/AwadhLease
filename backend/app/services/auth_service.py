from __future__ import annotations

from fastapi import HTTPException

from app.core.security import (
    create_access_token,
    create_refresh_token,
    hash_password,
    verify_password,
)
from app.models.landlord import Landlord
from app.models.user import User
from app.schemas.auth import RegisterLandlordRequest, TokenResponse


class AuthService:
    async def register_landlord(self, payload: RegisterLandlordRequest) -> TokenResponse:
        existing = await User.find(User.email == payload.email).first_or_none()
        if existing:
            raise HTTPException(status_code=409, detail="Email already registered")
        user = User(
            full_name=payload.full_name,
            email=payload.email,
            phone=payload.phone,
            password_hash=hash_password(payload.password),
            role="landlord",
        )
        await user.insert()
        landlord = Landlord(
            user_id=user,
            property_type=payload.property_type,
            property_count=payload.property_count,
        )
        await landlord.insert()
        return self._issue_tokens(str(user.id))

    async def login(self, email: str, password: str) -> TokenResponse:
        user = await User.find(User.email == email).first_or_none()
        if not user or not user.password_hash:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        if not verify_password(password, user.password_hash):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        return self._issue_tokens(str(user.id))

    async def refresh(self, refresh_token: str) -> TokenResponse:
        from app.core.security import decode_token

        try:
            payload = decode_token(refresh_token)
        except Exception as exc:  # noqa: BLE001
            raise HTTPException(status_code=401, detail="Invalid refresh token") from exc
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
        return self._issue_tokens(payload.get("sub"))

    @staticmethod
    def _issue_tokens(user_id: str) -> TokenResponse:
        return TokenResponse(
            access_token=create_access_token(user_id),
            refresh_token=create_refresh_token(user_id),
        )
