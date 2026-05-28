from __future__ import annotations

from datetime import datetime, timedelta
from typing import Any, Dict

import bcrypt
import jwt

from app.core.config import get_settings


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(
        plain_password.encode("utf-8"),
        hashed_password.encode("utf-8"),
    )


def create_access_token(subject: str, extra: Dict[str, Any] | None = None) -> str:
    settings = get_settings()
    payload = {"sub": subject, "type": "access"}
    if extra:
        payload.update(extra)
    expire = datetime.utcnow() + timedelta(minutes=settings.access_token_minutes)
    payload["exp"] = expire
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def create_refresh_token(subject: str) -> str:
    settings = get_settings()
    payload = {
        "sub": subject,
        "type": "refresh",
        "exp": datetime.utcnow() + timedelta(days=settings.refresh_token_days),
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def decode_token(token: str) -> Dict[str, Any]:
    settings = get_settings()
    return jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
