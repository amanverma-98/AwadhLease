from __future__ import annotations

from fastapi import APIRouter, File, UploadFile

from app.schemas.upload import UploadResponse
from app.services.upload_service import UploadService

router = APIRouter(prefix="/uploads", tags=["uploads"])
service = UploadService()


@router.post("", response_model=UploadResponse)
async def upload_file(file: UploadFile = File(...)):
    return await service.upload_image(file)
