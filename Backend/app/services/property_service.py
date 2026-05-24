from __future__ import annotations

from datetime import datetime
from typing import List, Tuple

from beanie import PydanticObjectId
from fastapi import HTTPException

from app.models.landlord import Landlord
from app.models.property import Property
from app.models.user import User
from app.schemas.property import PropertyCreate, PropertyOut, PropertyUpdate


class PropertyService:
    @staticmethod
    def _extract_link_id(value: object) -> str | None:
        if value is None:
            return None
        if isinstance(value, PydanticObjectId):
            return str(value)
        if isinstance(value, str):
            return value
        link_id = getattr(value, "id", None)
        if link_id is None:
            return None
        return str(link_id)

    def _to_out(self, doc: Property) -> PropertyOut:
        return PropertyOut(
            id=str(doc.id),
            landlord_id=self._extract_link_id(doc.landlord_id),
            name=doc.name,
            address=doc.address,
            city=doc.city,
            locality=doc.locality,
            property_type=doc.property_type,
            bhk=doc.bhk,
            furnished=doc.furnished,
            parking=doc.parking,
            wifi=doc.wifi,
            ac=doc.ac,
            pet_friendly=doc.pet_friendly,
            occupancy_status=doc.occupancy_status,
            monthly_rent=doc.monthly_rent,
            security_deposit=doc.security_deposit,
            images=list(doc.images),
            amenities=list(doc.amenities),
            rules=list(doc.rules),
            available_from=doc.available_from,
            latitude=doc.latitude,
            longitude=doc.longitude,
            description=doc.description,
            created_at=doc.created_at,
            updated_at=doc.updated_at,
        )

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
        return [self._to_out(item) for item in items], total

    async def get_property(self, property_id: str) -> PropertyOut:
        doc = await Property.get(PydanticObjectId(property_id))
        if not doc:
            raise HTTPException(status_code=404, detail="Property not found")
        return self._to_out(doc)

    async def create_property(self, payload: PropertyCreate, user: User) -> PropertyOut:
        landlord = await Landlord.find(Landlord.user_id.id == user.id).first_or_none()
        if not landlord:
            raise HTTPException(status_code=404, detail="Landlord profile not found")

        existing = await Property.find(
            Property.landlord_id.id == landlord.id,
            Property.name == payload.name,
            Property.address == payload.address,
            Property.city == payload.city,
            Property.locality == (payload.locality or payload.address),
            Property.monthly_rent == payload.monthly_rent,
        ).first_or_none()
        if existing:
            raise HTTPException(
                status_code=409,
                detail="Property already exists for this landlord",
            )

        doc = Property(**payload.model_dump(), landlord_id=landlord)
        await doc.insert()
        return self._to_out(doc)

    async def update_property(self, property_id: str, payload: PropertyUpdate) -> PropertyOut:
        doc = await Property.get(PydanticObjectId(property_id))
        if not doc:
            raise HTTPException(status_code=404, detail="Property not found")
        update_data = payload.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(doc, key, value)
        doc.updated_at = datetime.utcnow()
        await doc.save()
        return self._to_out(doc)

    async def delete_property(self, property_id: str) -> None:
        doc = await Property.get(PydanticObjectId(property_id))
        if not doc:
            raise HTTPException(status_code=404, detail="Property not found")
        await doc.delete()
