from __future__ import annotations

from datetime import datetime
from typing import List, Tuple

from beanie import PydanticObjectId
from fastapi import HTTPException

from app.models.property import Property
from app.schemas.property import PropertyCreate, PropertyOut, PropertyUpdate


class PropertyService:
    async def list_properties(
        self,
        skip: int,
        limit: int,
        occupancy_status: str | None,
        property_type: str | None,
        min_rent: float | None,
        max_rent: float | None,
        bhk: int | None,
        furnished: bool | None,
        parking: bool | None,
        wifi: bool | None,
        ac: bool | None,
        pet_friendly: bool | None,
        locality: str | None,
        city: str | None,
        sort_by: str | None,
    ) -> Tuple[List[PropertyOut], int]:
        filters = []
        if occupancy_status:
            filters.append(Property.occupancy_status == occupancy_status)
        if property_type:
            filters.append(Property.property_type == property_type)
        if min_rent is not None:
            filters.append(Property.monthly_rent >= min_rent)
        if max_rent is not None:
            filters.append(Property.monthly_rent <= max_rent)
        if bhk is not None:
            filters.append(Property.bhk == bhk)
        if furnished is not None:
            filters.append(Property.furnished == furnished)
        if parking is not None:
            filters.append(Property.parking == parking)
        if wifi is not None:
            filters.append(Property.wifi == wifi)
        if ac is not None:
            filters.append(Property.ac == ac)
        if pet_friendly is not None:
            filters.append(Property.pet_friendly == pet_friendly)
        if locality:
            filters.append(Property.locality == locality)
        if city:
            filters.append(Property.city == city)

        query = Property.find(*filters)
        if sort_by == "rent_asc":
            query = query.sort("monthly_rent")
        elif sort_by == "rent_desc":
            query = query.sort("-monthly_rent")
        elif sort_by == "newest":
            query = query.sort("-created_at")

        total = await query.count()
        items = await query.skip(skip).limit(limit).to_list()
        return [PropertyOut.model_validate(item) for item in items], total

    async def get_property(self, property_id: str) -> PropertyOut:
        doc = await Property.get(PydanticObjectId(property_id))
        if not doc:
            raise HTTPException(status_code=404, detail="Property not found")
        return PropertyOut.model_validate(doc)

    async def create_property(self, payload: PropertyCreate) -> PropertyOut:
        doc = Property(**payload.model_dump())
        await doc.insert()
        return PropertyOut.model_validate(doc)

    async def update_property(self, property_id: str, payload: PropertyUpdate) -> PropertyOut:
        doc = await Property.get(PydanticObjectId(property_id))
        if not doc:
            raise HTTPException(status_code=404, detail="Property not found")
        update_data = payload.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(doc, key, value)
        doc.updated_at = datetime.utcnow()
        await doc.save()
        return PropertyOut.model_validate(doc)

    async def delete_property(self, property_id: str) -> None:
        doc = await Property.get(PydanticObjectId(property_id))
        if not doc:
            raise HTTPException(status_code=404, detail="Property not found")
        await doc.delete()
