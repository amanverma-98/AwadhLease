from __future__ import annotations

from fastapi import APIRouter, Depends

from app.auth.dependencies import get_current_user, require_role
from app.middleware.rate_limit import rate_limit_dependency
from app.schemas.notification import NotificationBroadcastRequest, NotificationOut
from app.services.notification_service import NotificationService

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


@router.post(
    "/broadcast",
    response_model=list[NotificationOut],
    dependencies=[Depends(require_role("landlord"))],
)
async def broadcast_notification(
    payload: NotificationBroadcastRequest, user=Depends(get_current_user)
):
    return await service.broadcast_to_tenants(
        user, payload.title, payload.message, payload.property_id
    )
