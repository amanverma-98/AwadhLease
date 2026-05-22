from __future__ import annotations

from fastapi import APIRouter, Depends, Query

from Frontend.app.auth.dependencies import require_role
from Frontend.app.middleware.rate_limit import rate_limit_dependency
from Frontend.app.schemas.payment import PaymentCreate, PaymentOut
from Frontend.app.services.payment_service import PaymentService

router = APIRouter(
    prefix="/payments",
    tags=["payments"],
    dependencies=[Depends(rate_limit_dependency), Depends(require_role("landlord"))],
)
service = PaymentService()


@router.get("", response_model=list[PaymentOut])
async def list_payments(skip: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=200)):
    return await service.list_payments(skip, limit)


@router.post("", response_model=PaymentOut)
async def create_payment(payload: PaymentCreate):
    return await service.create_payment(payload)
