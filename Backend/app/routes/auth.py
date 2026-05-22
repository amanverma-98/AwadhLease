from __future__ import annotations

from fastapi import APIRouter, Depends

from app.auth.dependencies import get_current_user
from app.models.user import User
from app.schemas.auth import (
    LoginRequest,
    RefreshRequest,
    RegisterLandlordRequest,
    TokenResponse,
    UserMeResponse,
)
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["auth"])
service = AuthService()


@router.post("/register", response_model=TokenResponse)
async def register_landlord(payload: RegisterLandlordRequest):
    return await service.register_landlord(payload)


@router.post("/login", response_model=TokenResponse)
async def login(payload: LoginRequest):
    return await service.login(payload.email, payload.password)


@router.post("/refresh", response_model=TokenResponse)
async def refresh(payload: RefreshRequest):
    return await service.refresh(payload.refresh_token)


@router.get("/me", response_model=UserMeResponse)
async def get_me(user: User = Depends(get_current_user)):
    return await service.get_me(user)
