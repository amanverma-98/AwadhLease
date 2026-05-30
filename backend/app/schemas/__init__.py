from app.schemas.ai import AnalyticsInsight, MaintenanceClassification, RentReminder, TenantOnboardingResult
from app.schemas.analytics import AnalyticsMetrics, AnalyticsResponse
from app.schemas.ai_ops import AIPredictionResponse, OccupancyPredictionRequest, PaymentDelayRequest, TenantRiskRequest
from app.schemas.auth import LoginRequest, RefreshRequest, RegisterLandlordRequest, TokenResponse
from app.schemas.booking import BookingCreate, BookingOut
from app.schemas.chat import ChatRequest, ChatResponse
from app.schemas.conversation import ConversationOut, MessageOut
from app.schemas.landlord import LandlordOut
from app.schemas.maintenance import MaintenanceCreate, MaintenanceOut, MaintenanceUpdate
from app.schemas.notification import NotificationOut
from app.schemas.payment import PaymentCreate, PaymentOut
from app.schemas.property import PropertyCreate, PropertyOut, PropertyUpdate
from app.schemas.tenant import TenantCreate, TenantOut, TenantUpdate
from app.schemas.tenant import TenantCreateResponse
from app.schemas.upload import UploadResponse
from app.schemas.user import UserOut

__all__ = [
    "AnalyticsInsight",
    "MaintenanceClassification",
    "RentReminder",
    "TenantOnboardingResult",
    "AnalyticsMetrics",
    "AnalyticsResponse",
    "TenantRiskRequest",
    "OccupancyPredictionRequest",
    "PaymentDelayRequest",
    "AIPredictionResponse",
    "RegisterLandlordRequest",
    "LoginRequest",
    "RefreshRequest",
    "TokenResponse",
    "BookingCreate",
    "BookingOut",
    "ChatRequest",
    "ChatResponse",
    "ConversationOut",
    "MessageOut",
    "LandlordOut",
    "MaintenanceCreate",
    "MaintenanceOut",
    "MaintenanceUpdate",
    "NotificationOut",
    "PaymentCreate",
    "PaymentOut",
    "PropertyCreate",
    "PropertyOut",
    "PropertyUpdate",
    "TenantCreate",
    "TenantOut",
    "TenantUpdate",
    "TenantCreateResponse",
    "UploadResponse",
    "UserOut",
]
