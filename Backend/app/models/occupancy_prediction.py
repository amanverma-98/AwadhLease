from __future__ import annotations

from datetime import datetime

from beanie import Document, Link
from pydantic import Field

from app.models.property import Property


class OccupancyPrediction(Document):
    property_id: Link[Property] = Field(index=True)
    predicted_rate: float
    horizon_days: int
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "occupancy_predictions"
