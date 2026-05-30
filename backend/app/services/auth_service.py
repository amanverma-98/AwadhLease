from __future__ import annotations

from datetime import datetime, timedelta
import hashlib
import secrets

from fastapi import HTTPException

from app.core.config import get_settings
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)
from beanie import PydanticObjectId

from app.models.landlord import Landlord
from app.models.password_reset_token import PasswordResetToken
from app.models.user import User
from app.schemas.auth import (
    ForgotPasswordResponse,
    RegisterLandlordRequest,
    ResetPasswordResponse,
    TokenResponse,
    UserMeResponse,
)
from app.schemas.user import UserUpdate
from app.services.email_service import EmailService
from app.utils.link import get_link_id
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
        user = await User.find(User.email == email).first_or_none()
        if user:
            settings = get_settings()
            now = datetime.utcnow()
            token = secrets.token_urlsafe(32)
            token_hash = self._hash_token(token)
            expires_at = now + timedelta(minutes=settings.password_reset_minutes)

            existing = await PasswordResetToken.find(
                PasswordResetToken.user_id.id == user.id,
                PasswordResetToken.used_at == None,  # noqa: E711
            ).to_list()
            for entry in existing:
                entry.used_at = now
                await entry.save()

            doc = PasswordResetToken(
                user_id=user,
                token_hash=token_hash,
                expires_at=expires_at,
            )
            await doc.insert()

            reset_url = self._build_reset_url(settings, token)
            await EmailService().send_password_reset(user.email, reset_url)
        return ForgotPasswordResponse(status="sent")

    async def reset_password(self, token: str, password: str) -> ResetPasswordResponse:
        if not token or not password:
            raise HTTPException(status_code=422, detail="Token and password are required")

        token_hash = self._hash_token(token)
        doc = await PasswordResetToken.find(
            PasswordResetToken.token_hash == token_hash,
        ).first_or_none()
        if not doc:
            raise HTTPException(status_code=400, detail="Invalid or expired reset token")
        if doc.used_at is not None:
            raise HTTPException(status_code=400, detail="Reset token has already been used")
        if doc.expires_at < datetime.utcnow():
            raise HTTPException(status_code=400, detail="Reset token has expired")

        user_id = get_link_id(doc.user_id)
        if not user_id:
            raise HTTPException(status_code=400, detail="Invalid reset token")
        user = await User.get(PydanticObjectId(user_id))
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        user.password_hash = hash_password(password)
        await user.save()

        doc.used_at = datetime.utcnow()
        await doc.save()
        return ResetPasswordResponse(status="reset")

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

    @staticmethod
    def _hash_token(token: str) -> str:
        return hashlib.sha256(token.encode("utf-8")).hexdigest()

    @staticmethod
    def _build_reset_url(settings, token: str) -> str:
        base_url = settings.portal_url or settings.tenant_portal_url or "http://localhost:5173"
        base_url = base_url.rstrip("/")
        return f"{base_url}/auth/reset-password?token={token}"
