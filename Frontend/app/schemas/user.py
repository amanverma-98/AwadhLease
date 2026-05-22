from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel

from Frontend.app.schemas.base import DocumentOut


class UserOut(DocumentOut):
    full_name: str
    email: str
    phone: str
    role: str
    is_active: bool
    created_at: datetime
