from __future__ import annotations

from datetime import datetime
from typing import Optional

from beanie import Document
from pydantic import Field


class User(Document):
    full_name: str
    email: str = Field(index=True)
    phone: str = Field(index=True)
    password_hash: Optional[str] = None
    role: str = Field(default="landlord", index=True)
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "users"
