from __future__ import annotations

from typing import Optional

from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient

from Frontend.app.core.config import Settings
from Frontend.app.models.ai_conversation import AIConversation
from Frontend.app.models.ai_message import AIMessage
from Frontend.app.models.ai_prediction import AIPrediction
from Frontend.app.models.analytics_snapshot import AnalyticsSnapshot
from Frontend.app.models.amenity import Amenity
from Frontend.app.models.landlord import Landlord
from Frontend.app.models.lease import Lease
from Frontend.app.models.maintenance import MaintenanceTicket
from Frontend.app.models.maintenance_update import MaintenanceUpdate
from Frontend.app.models.notification import Notification
from Frontend.app.models.occupancy_prediction import OccupancyPrediction
from Frontend.app.models.payment import Payment
from Frontend.app.models.property import Property
from Frontend.app.models.property_booking import PropertyBooking
from Frontend.app.models.property_image import PropertyImage
from Frontend.app.models.review import Review
from Frontend.app.models.tenant import Tenant
from Frontend.app.models.tenant_risk_score import TenantRiskScore
from Frontend.app.models.user import User
from Frontend.app.models.vendor import Vendor

_client: Optional[AsyncIOMotorClient] = None


def get_client() -> AsyncIOMotorClient:
    if _client is None:
        raise RuntimeError("Mongo client is not initialized")
    return _client


async def init_db(settings: Settings) -> None:
    global _client
    _client = AsyncIOMotorClient(settings.mongodb_uri)
    database = _client[settings.mongodb_db]
    await init_beanie(
        database=database,
        document_models=[
            User,
            Landlord,
            Tenant,
            Property,
            PropertyImage,
            Amenity,
            Lease,
            Payment,
            MaintenanceTicket,
            MaintenanceUpdate,
            Vendor,
            Notification,
            PropertyBooking,
            Review,
            AIConversation,
            AIMessage,
            AIPrediction,
            TenantRiskScore,
            OccupancyPrediction,
            AnalyticsSnapshot,
        ],
    )


async def close_db() -> None:
    global _client
    if _client is not None:
        _client.close()
        _client = None
