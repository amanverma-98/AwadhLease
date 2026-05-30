from __future__ import annotations

from fastapi import APIRouter, Depends, Query

from app.auth.dependencies import get_current_user, require_role
from app.middleware.rate_limit import rate_limit_dependency
from app.models.user import User
from app.schemas.tenant import TenantCreate, TenantCreateResponse, TenantOut, TenantUpdate
from app.services.tenant_service import TenantService

router = APIRouter(
    prefix="/tenants",
    tags=["tenants"],
    dependencies=[Depends(rate_limit_dependency), Depends(require_role("landlord"))],
)
service = TenantService()


@router.get("", response_model=list[TenantOut])
async def list_tenants(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    property_id: str | None = None,
    include_inactive: bool = Query(False),
    user: User = Depends(get_current_user),
):
    items, _ = await service.list_tenants(user, skip, limit, property_id, include_inactive)
    return items


@router.post("", response_model=TenantCreateResponse, dependencies=[Depends(require_role("landlord"))])
async def create_tenant(payload: TenantCreate, user: User = Depends(get_current_user)):
    return await service.create_tenant(payload, user)


@router.put(
    "/{tenant_id}",
    response_model=TenantOut,
    dependencies=[Depends(require_role("landlord"))],
)
async def update_tenant(tenant_id: str, payload: TenantUpdate):
    return await service.update_tenant(tenant_id, payload)


@router.delete("/{tenant_id}", dependencies=[Depends(require_role("landlord"))])
async def delete_tenant(tenant_id: str):
    await service.delete_tenant(tenant_id)
    return {"status": "deleted"}
