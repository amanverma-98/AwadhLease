from __future__ import annotations

from fastapi import APIRouter, UploadFile

from Frontend.app.schemas.upload import UploadResponse
from Frontend.app.services.upload_service import UploadService

router = APIRouter(prefix="/uploads", tags=["uploads"])
service = UploadService()


@router.post("", response_model=UploadResponse)
async def upload_file(file: UploadFile):
    return await service.save_upload(file.filename)
