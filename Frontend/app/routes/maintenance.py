from __future__ import annotations

from fastapi import APIRouter, Depends, Query

from Frontend.app.auth.dependencies import get_current_user
from Frontend.app.middleware.rate_limit import rate_limit_dependency
from Frontend.app.schemas.maintenance import MaintenanceCreate, MaintenanceOut
from Frontend.app.services.maintenance_service import MaintenanceService

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
):
    items, _ = await service.list_tickets(skip, limit, priority, status)
    return items


@router.post("", response_model=MaintenanceOut)
async def create_maintenance(payload: MaintenanceCreate):
    return await service.create_ticket(payload)
