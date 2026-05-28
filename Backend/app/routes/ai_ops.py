from __future__ import annotations

from fastapi import APIRouter, Depends

from app.auth.dependencies import require_role
from app.middleware.rate_limit import rate_limit_dependency
from app.schemas.ai_ops import (
    AIPredictionResponse,
    OccupancyPredictionRequest,
    PaymentDelayRequest,
    TenantRiskRequest,
)
from app.services.ai_ops_service import AIOpsService

router = APIRouter(
    prefix="/ai",
    tags=["ai"],
    dependencies=[Depends(rate_limit_dependency), Depends(require_role("landlord"))],
)
service = AIOpsService()


@router.post("/tenant-risk", response_model=AIPredictionResponse)
async def tenant_risk(payload: TenantRiskRequest):
    return await service.tenant_risk(payload)


@router.post("/occupancy", response_model=AIPredictionResponse)
async def occupancy_prediction(payload: OccupancyPredictionRequest):
    return await service.occupancy_prediction(payload)


@router.post("/payment-delay", response_model=AIPredictionResponse)
async def payment_delay(payload: PaymentDelayRequest):
    return await service.payment_delay(payload)
