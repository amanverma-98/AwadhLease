from __future__ import annotations

from fastapi import APIRouter, Depends

from app.auth.dependencies import get_current_user, require_role
from app.middleware.rate_limit import rate_limit_dependency
from app.schemas.analytics import AnalyticsResponse
from app.services.analytics_service import AnalyticsService
from app.models.user import User

router = APIRouter(
    prefix="/analytics",
    tags=["analytics"],
    dependencies=[Depends(rate_limit_dependency), Depends(require_role("landlord"))],
)
service = AnalyticsService()


@router.get("", response_model=AnalyticsResponse)
async def analytics(user: User = Depends(get_current_user)):
    metrics = await service.compute_metrics(user)
    result = await service.summarize(metrics)
    return AnalyticsResponse(metrics=result["metrics"], insight=result["insight"])
