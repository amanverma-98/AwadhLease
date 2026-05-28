from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.core.config import get_settings
from app.core.exceptions import add_exception_handlers
from app.core.logging import init_logging
from app.database.mongo import close_db, init_db
from app.middleware.cors import apply_cors
from app.middleware.request_logging import RequestLoggingMiddleware
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


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    init_logging(settings)
    await init_db(settings)
    yield
    await close_db()


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(title=settings.app_name, lifespan=lifespan)

    apply_cors(app, settings)
    app.add_middleware(RequestLoggingMiddleware)

    app.include_router(health_router)
    app.include_router(auth_router)
    app.include_router(properties_router)
    app.include_router(tenants_router)
    app.include_router(maintenance_router)
    app.include_router(chat_router)
    app.include_router(analytics_router)
    app.include_router(ai_ops_router)
    app.include_router(bookings_router)
    app.include_router(notifications_router)
    app.include_router(payments_router)
    app.include_router(uploads_router)
    app.include_router(websocket_router)

    add_exception_handlers(app)
    return app


app = create_app()
