from __future__ import annotations

from fastapi import APIRouter, Depends, Query

from Frontend.app.auth.dependencies import require_role
from Frontend.app.middleware.rate_limit import rate_limit_dependency
from Frontend.app.schemas.property import PropertyCreate, PropertyOut, PropertyUpdate
from Frontend.app.services.property_service import PropertyService

router = APIRouter(prefix="/properties", tags=["properties"], dependencies=[Depends(rate_limit_dependency)])
service = PropertyService()


@router.get("", response_model=list[PropertyOut])
async def list_properties(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    occupancy_status: str | None = None,
    property_type: str | None = None,
    min_rent: float | None = None,
    max_rent: float | None = None,
    bhk: int | None = None,
    furnished: bool | None = None,
    parking: bool | None = None,
    wifi: bool | None = None,
    ac: bool | None = None,
    pet_friendly: bool | None = None,
    locality: str | None = None,
    city: str | None = None,
    sort_by: str | None = Query(None, description="rent_asc|rent_desc|newest"),
):
    items, _ = await service.list_properties(
        skip,
        limit,
        occupancy_status,
        property_type,
        min_rent,
        max_rent,
        bhk,
        furnished,
        parking,
        wifi,
        ac,
        pet_friendly,
        locality,
        city,
        sort_by,
    )
    return items


@router.get("/{property_id}", response_model=PropertyOut)
async def get_property(property_id: str):
    return await service.get_property(property_id)


@router.post("", response_model=PropertyOut, dependencies=[Depends(require_role("landlord"))])
async def create_property(payload: PropertyCreate):
    return await service.create_property(payload)


@router.put(
    "/{property_id}",
    response_model=PropertyOut,
    dependencies=[Depends(require_role("landlord"))],
)
async def update_property(property_id: str, payload: PropertyUpdate):
    return await service.update_property(property_id, payload)


@router.delete("/{property_id}", dependencies=[Depends(require_role("landlord"))])
async def delete_property(property_id: str):
    await service.delete_property(property_id)
    return {"status": "deleted"}
