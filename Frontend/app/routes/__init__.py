from Frontend.app.routes.analytics import router as analytics_router
from Frontend.app.routes.ai_ops import router as ai_ops_router
from Frontend.app.routes.auth import router as auth_router
from Frontend.app.routes.bookings import router as bookings_router
from Frontend.app.routes.chat import router as chat_router
from Frontend.app.routes.health import router as health_router
from Frontend.app.routes.maintenance import router as maintenance_router
from Frontend.app.routes.notifications import router as notifications_router
from Frontend.app.routes.payments import router as payments_router
from Frontend.app.routes.properties import router as properties_router
from Frontend.app.routes.tenants import router as tenants_router
from Frontend.app.routes.uploads import router as uploads_router
from Frontend.app.routes.websocket import router as websocket_router

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
