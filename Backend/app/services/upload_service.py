from __future__ import annotations

from fastapi import HTTPException, UploadFile

import cloudinary
import cloudinary.uploader

from app.core.config import get_settings
from app.schemas.upload import UploadResponse


class UploadService:
    async def upload_image(self, file: UploadFile) -> UploadResponse:
        settings = get_settings()

        if settings.cloudinary_url:
            cloudinary.config(cloudinary_url=settings.cloudinary_url)
        elif settings.cloudinary_name and settings.cloudinary_key and settings.cloudinary_secret:
            cloudinary.config(
                cloud_name=settings.cloudinary_name,
                api_key=settings.cloudinary_key,
                api_secret=settings.cloudinary_secret,
                secure=True,
            )
        else:
            raise HTTPException(status_code=500, detail="Cloudinary is not configured")

        result = cloudinary.uploader.upload(
            file.file,
            folder="awadhlease",
            resource_type="image",
        )
        return UploadResponse(url=result["secure_url"], provider="cloudinary")
