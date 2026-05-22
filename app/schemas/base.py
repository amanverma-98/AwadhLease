from __future__ import annotations

from pydantic import BaseModel, ConfigDict, field_serializer


class APIModel(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class DocumentOut(APIModel):
    id: str

    @field_serializer("id")
    def serialize_id(self, value):
        return "" if value is None else str(value)
