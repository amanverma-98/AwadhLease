from __future__ import annotations

from fastapi import APIRouter

from app.schemas.auth import LoginRequest, RefreshRequest, RegisterLandlordRequest, TokenResponse
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


