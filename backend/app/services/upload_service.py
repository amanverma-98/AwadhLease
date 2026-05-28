from __future__ import annotations

import base64
import logging

from fastapi import HTTPException, UploadFile

import cloudinary
import cloudinary.uploader

from app.core.config import get_settings
from app.schemas.upload import UploadResponse


logger = logging.getLogger(__name__)


class UploadService:
    async def upload_image(self, file: UploadFile) -> UploadResponse:
        settings = get_settings()

        # Prefer Cloudinary when configured, but fall back to a data URL so uploads keep working.
        if settings.cloudinary_url or (
            settings.cloudinary_name and settings.cloudinary_key and settings.cloudinary_secret
        ):
            try:
                if settings.cloudinary_url:
                    cloudinary.config(cloudinary_url=settings.cloudinary_url)
                else:
                    cloudinary.config(
                        cloud_name=settings.cloudinary_name,
                        api_key=settings.cloudinary_key,
                        api_secret=settings.cloudinary_secret,
                        secure=True,
                    )

                result = cloudinary.uploader.upload(
                    file.file,
                    folder="awadhlease",
                    resource_type="image",
                )
                return UploadResponse(url=result["secure_url"], provider="cloudinary")
            except Exception:
                logger.exception("Cloudinary upload failed; using data URL fallback")

        await file.seek(0)
        content = await file.read()
        if not content:
            raise HTTPException(status_code=400, detail="Empty upload")

        mime_type = file.content_type or "application/octet-stream"
        encoded = base64.b64encode(content).decode("ascii")
        data_url = f"data:{mime_type};base64,{encoded}"
        return UploadResponse(url=data_url, provider="data-url")
