from __future__ import annotations

from app.core.config import get_settings
from app.schemas.upload import UploadResponse


class UploadService:
    async def save_upload(self, filename: str) -> UploadResponse:
        settings = get_settings()
        provider = "local"
        if settings.cloudinary_url or settings.cloudinary_name:
            provider = "cloudinary"
        url = f"/uploads/{filename}"
        return UploadResponse(url=url, provider=provider)
