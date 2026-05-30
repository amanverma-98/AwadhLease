from __future__ import annotations

from datetime import datetime
from typing import List

from beanie import PydanticObjectId
from bson.errors import InvalidId
from fastapi import HTTPException, UploadFile

from app.models.landlord import Landlord
from app.models.lease_document import LeaseDocument
from app.models.property import Property
from app.models.tenant import Tenant
from app.models.user import User
from app.schemas.lease_document import LeaseDocumentOut
from app.services.upload_service import UploadService
from app.utils.link import get_link_id
from app.utils.user_context import get_tenant_for_user


class LeaseDocumentService:
    def __init__(self) -> None:
        self._upload_service = UploadService()

    async def list_documents(
        self,
        user: User,
        tenant_id: str | None,
        property_id: str | None,
    ) -> List[LeaseDocumentOut]:
        if user.role == "tenant":
            tenant_doc = await get_tenant_for_user(user)
            if not tenant_doc:
                return []
            filters = {"tenant_id.$id": tenant_doc.id}
            if property_id:
                try:
                    filters["property_id.$id"] = PydanticObjectId(property_id)
                except InvalidId as exc:
                    raise HTTPException(status_code=400, detail="Invalid property ID") from exc
            items = await LeaseDocument.find(filters).sort("-uploaded_at").to_list()
            return [LeaseDocumentOut.model_validate(item) for item in items]

        if user.role == "landlord":
            landlord = await Landlord.find(Landlord.user_id.id == user.id).first_or_none()
            if not landlord:
                return []
            filters = {"landlord_id.$id": landlord.id}
            if tenant_id:
                try:
                    filters["tenant_id.$id"] = PydanticObjectId(tenant_id)
                except InvalidId as exc:
                    raise HTTPException(status_code=400, detail="Invalid tenant ID") from exc
            if property_id:
                try:
                    filters["property_id.$id"] = PydanticObjectId(property_id)
                except InvalidId as exc:
                    raise HTTPException(status_code=400, detail="Invalid property ID") from exc
            items = await LeaseDocument.find(filters).sort("-uploaded_at").to_list()
            return [LeaseDocumentOut.model_validate(item) for item in items]

        return []

    async def upload_document(
        self,
        user: User,
        tenant_id: str,
        property_id: str,
        file: UploadFile,
    ) -> LeaseDocumentOut:
        if user.role != "landlord":
            raise HTTPException(status_code=403, detail="Landlord access required")

        try:
            tenant_object_id = PydanticObjectId(tenant_id)
+            property_object_id = PydanticObjectId(property_id)
        except InvalidId as exc:
            raise HTTPException(status_code=400, detail="Invalid tenant or property ID") from exc

        tenant_doc = await Tenant.get(tenant_object_id)
        if not tenant_doc:
            raise HTTPException(status_code=404, detail="Tenant not found")

-        property_doc = await Property.get(PydanticObjectId(property_id))
+        property_doc = await Property.get(property_object_id)
        if not property_doc:
            raise HTTPException(status_code=404, detail="Property not found")

        landlord = await Landlord.find(Landlord.user_id.id == user.id).first_or_none()
        if not landlord:
            raise HTTPException(status_code=404, detail="Landlord profile not found")

        property_landlord = get_link_id(property_doc.landlord_id)
        if property_landlord and str(property_landlord) != str(landlord.id):
            raise HTTPException(status_code=403, detail="Property not owned by landlord")

        upload = await self._upload_service.upload_document(file)
        latest = await LeaseDocument.find(
            LeaseDocument.tenant_id.id == tenant_doc.id,
            LeaseDocument.property_id.id == property_doc.id,
        ).sort("-version").first_or_none()
        version = 1 if not latest else latest.version + 1

        doc = LeaseDocument(
            tenant_id=tenant_doc,
            property_id=property_doc,
            landlord_id=landlord,
            file_url=upload.url,
            file_name=file.filename or "lease-document.pdf",
            content_type=file.content_type,
            size_bytes=upload.size_bytes,
            version=version,
            uploaded_at=datetime.utcnow(),
        )
        await doc.insert()
        return LeaseDocumentOut.model_validate(doc)

    async def replace_document(
        self,
        user: User,
        document_id: str,
        file: UploadFile,
    ) -> LeaseDocumentOut:
        if user.role != "landlord":
            raise HTTPException(status_code=403, detail="Landlord access required")
        try:
            doc_id = PydanticObjectId(document_id)
        except InvalidId as exc:
            raise HTTPException(status_code=400, detail="Invalid document ID") from exc

        doc = await LeaseDocument.get(doc_id)
        if not doc:
            raise HTTPException(status_code=404, detail="Lease document not found")

        landlord = await Landlord.find(Landlord.user_id.id == user.id).first_or_none()
        if not landlord:
            raise HTTPException(status_code=404, detail="Landlord profile not found")

        landlord_id = get_link_id(doc.landlord_id)
        if landlord_id and str(landlord_id) != str(landlord.id):
            raise HTTPException(status_code=403, detail="Unauthorized")

        upload = await self._upload_service.upload_document(file)
        doc.file_url = upload.url
        doc.file_name = file.filename or doc.file_name
        doc.content_type = file.content_type
        doc.size_bytes = upload.size_bytes
        doc.version += 1
        doc.uploaded_at = datetime.utcnow()
        await doc.save()
        return LeaseDocumentOut.model_validate(doc)
