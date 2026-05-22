from __future__ import annotations

from typing import List

from beanie import PydanticObjectId
from fastapi import HTTPException

from Frontend.app.models.notification import Notification
from Frontend.app.models.user import User
from Frontend.app.schemas.notification import NotificationOut
from Frontend.app.websocket.manager import manager


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
