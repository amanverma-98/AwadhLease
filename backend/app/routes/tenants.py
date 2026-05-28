from __future__ import annotations

from fastapi import APIRouter, BackgroundTasks, Depends, Query

from app.auth.dependencies import require_role
from app.middleware.rate_limit import rate_limit_dependency
from app.schemas.tenant import TenantCreate, TenantCreateResponse, TenantOut, TenantUpdate
from app.services.email_service import send_welcome_email
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
):
    items, _ = await service.list_tenants(skip, limit, property_id)
    return items


@router.post("", response_model=TenantCreateResponse, dependencies=[Depends(require_role("landlord"))])
async def create_tenant(payload: TenantCreate, background_tasks: BackgroundTasks):
    response, temp_password = await service.create_tenant(payload)
    await send_welcome_email(response.username, temp_password, background_tasks)
    return response


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
