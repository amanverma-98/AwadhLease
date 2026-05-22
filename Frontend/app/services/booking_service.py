from __future__ import annotations

from typing import List

from beanie import PydanticObjectId
from fastapi import HTTPException

from Frontend.app.models.property import Property
from Frontend.app.models.property_booking import PropertyBooking
from Frontend.app.schemas.booking import BookingCreate, BookingOut


class BookingService:
    async def create_booking(self, payload: BookingCreate) -> BookingOut:
        property_doc = await Property.get(PydanticObjectId(payload.property_id))
        if not property_doc:
            raise HTTPException(status_code=404, detail="Property not found")
        doc = PropertyBooking(
            property_id=property_doc,
            tenant_name=payload.tenant_name,
            tenant_phone=payload.tenant_phone,
            scheduled_at=payload.scheduled_at,
            message=payload.message,
        )
        await doc.insert()
        return BookingOut.model_validate(doc)

    async def list_bookings(self, skip: int, limit: int) -> List[BookingOut]:
        items = await PropertyBooking.find().skip(skip).limit(limit).to_list()
        return [BookingOut.model_validate(item) for item in items]
