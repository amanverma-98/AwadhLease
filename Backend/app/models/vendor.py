from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from beanie import Document
from pydantic import Field


class Vendor(Document):
    name: str = Field(index=True)
    category: str
    phone: str
    email: Optional[str] = None
    rating: Optional[float] = None
    service_areas: List[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "vendors"
