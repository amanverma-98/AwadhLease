from __future__ import annotations

from fastapi import APIRouter, Depends, Query

from app.auth.dependencies import require_role
from app.middleware.rate_limit import rate_limit_dependency
from app.schemas.booking import BookingCreate, BookingOut
from app.services.booking_service import BookingService

router = APIRouter(
    prefix="/bookings",
    tags=["bookings"],
    dependencies=[Depends(rate_limit_dependency)],
)
service = BookingService()


@router.post("", response_model=BookingOut)
async def create_booking(payload: BookingCreate):
    return await service.create_booking(payload)


@router.get("", response_model=list[BookingOut], dependencies=[Depends(require_role("landlord"))])
async def list_bookings(skip: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=200)):
    return await service.list_bookings(skip, limit)
