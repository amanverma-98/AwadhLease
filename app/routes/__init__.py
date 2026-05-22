from app.routes.analytics import router as analytics_router
from app.routes.ai_ops import router as ai_ops_router
from app.routes.auth import router as auth_router
from app.routes.bookings import router as bookings_router
from app.routes.chat import router as chat_router
from app.routes.health import router as health_router
from app.routes.maintenance import router as maintenance_router
from app.routes.notifications import router as notifications_router
from app.routes.payments import router as payments_router
from app.routes.properties import router as properties_router
from app.routes.tenants import router as tenants_router
from app.routes.uploads import router as uploads_router
from app.routes.websocket import router as websocket_router

__all__ = [
    "analytics_router",
    "ai_ops_router",
    "auth_router",
    "bookings_router",
    "chat_router",
    "health_router",
    "maintenance_router",
    "notifications_router",
    "payments_router",
    "properties_router",
    "tenants_router",
    "uploads_router",
    "websocket_router",
]
