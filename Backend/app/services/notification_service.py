from __future__ import annotations

from typing import List

from beanie import PydanticObjectId
from fastapi import HTTPException

from app.models.landlord import Landlord
from app.models.notification import Notification
from app.models.tenant import Tenant
from app.models.user import User
from app.schemas.notification import NotificationOut
from app.websocket.manager import manager


class NotificationService:
    async def notify(
        self, user: User, title: str, message: str, channel: str = "in_app"
    ) -> NotificationOut:
        doc = Notification(user_id=user, title=title, message=message, channel=channel)
        await doc.insert()
        await manager.broadcast(
            f"user:{user.id}",
            {"event": "notification", "payload": NotificationOut.model_validate(doc).model_dump()},
        )
        return NotificationOut.model_validate(doc)

    async def list_notifications(self, user: User) -> List[NotificationOut]:
        items = await Notification.find(Notification.user_id.id == user.id).to_list()
        return [NotificationOut.model_validate(item) for item in items]

    async def mark_read(self, notification_id: str, user: User) -> NotificationOut:
        doc = await Notification.get(PydanticObjectId(notification_id))
        if doc and str(doc.user_id.id) == str(user.id):
            doc.status = "read"
            await doc.save()
            return NotificationOut.model_validate(doc)
        raise HTTPException(status_code=404, detail="Notification not found")

    async def broadcast_to_tenants(
        self,
        user: User,
        title: str,
        message: str,
        property_id: str | None = None,
    ) -> List[NotificationOut]:
        landlord = await Landlord.find(Landlord.user_id.id == user.id).first_or_none()
        if not landlord:
            raise HTTPException(status_code=404, detail="Landlord profile not found")

        query = Tenant.find(Tenant.landlord_id.id == landlord.id)
        if property_id:
            query = query.find(Tenant.property_id.id == PydanticObjectId(property_id))

        tenants = await query.to_list()
        if not tenants:
            return []

        results: List[NotificationOut] = []
        for tenant in tenants:
            if not tenant.user_id:
                continue
            tenant_user = await User.get(tenant.user_id.id)
            if not tenant_user:
                continue
            results.append(await self.notify(tenant_user, title, message))
        return results
