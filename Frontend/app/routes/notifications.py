from __future__ import annotations

from fastapi import APIRouter, Depends

from Frontend.app.auth.dependencies import get_current_user
from Frontend.app.middleware.rate_limit import rate_limit_dependency
from Frontend.app.schemas.notification import NotificationOut
from Frontend.app.services.notification_service import NotificationService

router = APIRouter(
    prefix="/notifications",
    tags=["notifications"],
    dependencies=[Depends(rate_limit_dependency)],
)
service = NotificationService()


@router.get("", response_model=list[NotificationOut])
async def list_notifications(user=Depends(get_current_user)):
    return await service.list_notifications(user)


@router.post("/{notification_id}/read", response_model=NotificationOut)
async def mark_read(notification_id: str, user=Depends(get_current_user)):
    return await service.mark_read(notification_id, user)
