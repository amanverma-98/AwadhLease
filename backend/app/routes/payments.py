from __future__ import annotations

from datetime import datetime

from fastapi import APIRouter, Depends, Query

from app.auth.dependencies import get_current_user, require_role
from app.middleware.rate_limit import rate_limit_dependency
from app.models.user import User
from app.schemas.payment import PaymentCreate, PaymentOut, TenantPaymentCreate
from app.services.payment_service import PaymentService

router = APIRouter(
    prefix="/payments",
    tags=["payments"],
    dependencies=[Depends(rate_limit_dependency), Depends(get_current_user)],
)
service = PaymentService()


@router.get("", response_model=list[PaymentOut])
async def list_payments(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    tenant_id: str | None = None,
    property_id: str | None = None,
    status: str | None = None,
    date_from: datetime | None = None,
    date_to: datetime | None = None,
    user: User = Depends(get_current_user),
):
    return await service.list_for_user(
        user,
        skip,
        limit,
        tenant_id,
        property_id,
        status,
        date_from,
        date_to,
    )


@router.post("", response_model=PaymentOut, dependencies=[Depends(require_role("landlord"))])
async def create_payment(payload: PaymentCreate, user: User = Depends(get_current_user)):
    return await service.create_payment(payload, user)


@router.post(
    "/tenant",
    response_model=PaymentOut,
    dependencies=[Depends(require_role("tenant"))],
)
async def create_tenant_payment(
    payload: TenantPaymentCreate, user: User = Depends(get_current_user)
):
    return await service.create_tenant_payment(payload, user)
