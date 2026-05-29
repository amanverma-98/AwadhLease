from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query

from app.auth.dependencies import get_current_user, get_optional_user, require_role
from app.middleware.rate_limit import rate_limit_dependency
from beanie import PydanticObjectId

from app.models.landlord import Landlord
from app.models.property import Property
from app.models.user import User
from app.schemas.property import (
    ContactLandlordRequest,
    ContactLandlordResponse,
    PropertyCreate,
    PropertyOut,
    PropertyUpdate,
)
from app.utils.link import get_link_id
from app.services.notification_service import NotificationService
from app.services.property_service import PropertyService

router = APIRouter(prefix="/properties", tags=["properties"], dependencies=[Depends(rate_limit_dependency)])
service = PropertyService()
notification_service = NotificationService()


@router.get("", response_model=list[PropertyOut])
async def list_properties(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    mine: bool = Query(False),
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
    user: User | None = Depends(get_optional_user),
):
    landlord_id = None
    if mine:
        if not user:
            raise HTTPException(status_code=401, detail="Authentication required")
        if user.role != "landlord":
            raise HTTPException(status_code=403, detail="Landlord access required")
        landlord = await Landlord.find(Landlord.user_id.id == user.id).first_or_none()
        if not landlord:
            raise HTTPException(status_code=404, detail="Landlord profile not found")
        landlord_id = str(landlord.id)

    items, _ = await service.list_properties(
        skip,
        limit,
        landlord_id,
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
async def create_property(payload: PropertyCreate, user: User = Depends(get_current_user)):
    return await service.create_property(payload, user)


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


@router.post("/{property_id}/contact", response_model=ContactLandlordResponse)
async def contact_landlord(property_id: str, payload: ContactLandlordRequest):
    doc = await Property.get(PydanticObjectId(property_id))
    if not doc or not doc.landlord_id:
        return ContactLandlordResponse(status="not_found")

    landlord_id = get_link_id(doc.landlord_id)
    if not landlord_id:
        return ContactLandlordResponse(status="not_found")
    landlord = await Landlord.get(PydanticObjectId(landlord_id))
    if not landlord or not landlord.user_id:
        return ContactLandlordResponse(status="not_found")

    user_id = get_link_id(landlord.user_id)
    if not user_id:
        return ContactLandlordResponse(status="not_found")
    user = await User.get(PydanticObjectId(user_id))
    if not user:
        return ContactLandlordResponse(status="not_found")

    message = payload.message or ""
    body = f"Contact request from {payload.name} ({payload.phone}). {message}".strip()
    await notification_service.notify(user, "New property inquiry", body)
    return ContactLandlordResponse(status="sent")
