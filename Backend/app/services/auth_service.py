from __future__ import annotations

from fastapi import HTTPException

from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.models.landlord import Landlord
from app.models.user import User
from app.schemas.auth import (
    ForgotPasswordResponse,
    RegisterLandlordRequest,
    TokenResponse,
    UserMeResponse,
)
from app.schemas.user import UserUpdate
from app.utils.user_context import resolve_profile_context


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
        return self._issue_tokens(str(user.id), user.role)

    async def login(self, email: str, password: str) -> TokenResponse:
        user = await User.find(User.email == email).first_or_none()
        if not user or not user.password_hash:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        if not verify_password(password, user.password_hash):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        return self._issue_tokens(str(user.id), user.role)

    async def refresh(self, refresh_token: str) -> TokenResponse:
        try:
            payload = decode_token(refresh_token)
        except Exception as exc:  # noqa: BLE001
            raise HTTPException(status_code=401, detail="Invalid refresh token") from exc
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await User.get(payload.get("sub"))
        role = user.role if user else "landlord"
        return self._issue_tokens(payload.get("sub"), role)

    async def get_me(self, user: User) -> UserMeResponse:
        landlord_id, tenant_id, property_id, tenant_doc = await resolve_profile_context(user)
        lease_start = None
        lease_end = None
        rent_status = None
        if tenant_doc:
            lease_start = tenant_doc.lease_start.isoformat()
            lease_end = tenant_doc.lease_end.isoformat()
            rent_status = tenant_doc.rent_status

        return UserMeResponse(
            id=str(user.id),
            full_name=user.full_name,
            email=user.email,
            phone=user.phone,
            role=user.role,
            landlord_id=landlord_id,
            tenant_id=tenant_id,
            property_id=property_id,
            lease_start=lease_start,
            lease_end=lease_end,
            rent_status=rent_status,
        )

    async def request_password_reset(self, email: str) -> ForgotPasswordResponse:
        # Do not reveal whether the email exists.
        _ = await User.find(User.email == email).first_or_none()
        return ForgotPasswordResponse(status="sent")

    async def update_me(self, user: User, payload: UserUpdate) -> UserMeResponse:
        update_data = payload.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(user, key, value)
        await user.save()
        return await self.get_me(user)

    @staticmethod
    def _issue_tokens(user_id: str, role: str) -> TokenResponse:
        return TokenResponse(
            access_token=create_access_token(user_id, {"role": role}),
            refresh_token=create_refresh_token(user_id),
        )
