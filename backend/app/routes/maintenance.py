from __future__ import annotations

from fastapi import APIRouter, Depends, Query

from app.auth.dependencies import get_current_user
from app.middleware.rate_limit import rate_limit_dependency
from app.models.user import User
from app.schemas.maintenance import MaintenanceCreate, MaintenanceOut, MaintenanceUpdate
from app.services.maintenance_service import MaintenanceService

router = APIRouter(
    prefix="/maintenance",
    tags=["maintenance"],
    dependencies=[Depends(rate_limit_dependency), Depends(get_current_user)],
)
service = MaintenanceService()


@router.get("", response_model=list[MaintenanceOut])
async def list_maintenance(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    priority: str | None = None,
    status: str | None = None,
    user: User = Depends(get_current_user),
):
    items, _ = await service.list_tickets(user, skip, limit, priority, status)
    return items


@router.post("", response_model=MaintenanceOut)
async def create_maintenance(
    payload: MaintenanceCreate,
    user: User = Depends(get_current_user),
):
    return await service.create_ticket(payload, user)


@router.patch("/{ticket_id}", response_model=MaintenanceOut)
async def update_maintenance(
    ticket_id: str,
    payload: MaintenanceUpdate,
    user: User = Depends(get_current_user),
):
    return await service.update_ticket(ticket_id, payload, user)
