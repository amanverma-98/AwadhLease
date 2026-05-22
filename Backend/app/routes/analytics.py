from __future__ import annotations

from fastapi import APIRouter, Depends

from app.auth.dependencies import require_role
from app.middleware.rate_limit import rate_limit_dependency
from app.schemas.analytics import AnalyticsResponse
from app.services.analytics_service import AnalyticsService

router = APIRouter(
    prefix="/analytics",
    tags=["analytics"],
    dependencies=[Depends(rate_limit_dependency), Depends(require_role("landlord"))],
)
service = AnalyticsService()


@router.get("", response_model=AnalyticsResponse)
async def analytics():
    metrics = await service.compute_metrics()
    result = await service.summarize(metrics)
    return AnalyticsResponse(metrics=result["metrics"], insight=result["insight"])
