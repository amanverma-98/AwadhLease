from __future__ import annotations

import logging
from pathlib import Path

from fastapi import BackgroundTasks
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType

from app.core.config import get_settings

logger = logging.getLogger("app.email")
TEMPLATE_FOLDER = Path(__file__).resolve().parent.parent / "templates"


def _build_mail_config() -> ConnectionConfig:
    settings = get_settings()
    missing = []
    if not settings.mail_username:
        missing.append("MAIL_USERNAME")
    if not settings.mail_password:
        missing.append("MAIL_PASSWORD")
    if not settings.mail_from:
        missing.append("MAIL_FROM")
    if not settings.mail_server:
        missing.append("MAIL_SERVER")
    if missing:
        raise RuntimeError(f"Missing mail settings: {', '.join(missing)}")
    return ConnectionConfig(
        MAIL_USERNAME=settings.mail_username,
        MAIL_PASSWORD=settings.mail_password,
        MAIL_FROM=settings.mail_from,
        MAIL_FROM_NAME=settings.mail_from_name,
        MAIL_PORT=settings.mail_port,
        MAIL_SERVER=settings.mail_server,
        MAIL_STARTTLS=settings.mail_starttls,
        MAIL_SSL_TLS=settings.mail_ssl_tls,
        USE_CREDENTIALS=settings.mail_use_credentials,
        VALIDATE_CERTS=settings.mail_validate_certs,
        TEMPLATE_FOLDER=str(TEMPLATE_FOLDER),
    )


async def _send_welcome_email(email: str, password: str) -> None:
    settings = get_settings()
    try:
        config = _build_mail_config()
        message = MessageSchema(
            subject="Welcome to Awadhlease",
            recipients=[email],
            template_body={
                "portal_url": settings.tenant_portal_url,
                "tenant_email": email,
                "temporary_password": password,
            },
            subtype=MessageType.html,
        )
        fm = FastMail(config)
        await fm.send_message(message, template_name="welcome_email.html")
    except Exception:
        logger.exception("Failed to send welcome email to %s", email)


async def send_welcome_email(
    email: str, password: str, background_tasks: BackgroundTasks
) -> None:
    background_tasks.add_task(_send_welcome_email, email, password)
