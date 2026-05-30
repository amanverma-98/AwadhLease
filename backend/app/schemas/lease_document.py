from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, field_serializer

from app.schemas.base import DocumentOut
from app.utils.link import get_link_id


class LeaseDocumentOut(DocumentOut):
    property_id: str
    tenant_id: str
    landlord_id: str
    file_url: str
    file_name: str
    content_type: str | None = None
    size_bytes: int | None = None
    version: int
    uploaded_at: datetime

    @field_serializer("property_id", "tenant_id", "landlord_id")
    def serialize_ids(self, value):
        return "" if value is None else (get_link_id(value) or "")


class LeaseDocumentReplaceResponse(BaseModel):
    status: str
    document: LeaseDocumentOut
