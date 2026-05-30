from __future__ import annotations

from functools import lru_cache
import json
from pathlib import Path
from typing import List

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

_BACKEND_ROOT = Path(__file__).resolve().parents[2]
_ENV_FILE = _BACKEND_ROOT / ".env"


class Settings(BaseSettings):
    app_name: str = "RentPilot AI"
    env: str = "dev"
    log_level: str = "INFO"
    api_prefix: str = "/"
    mongodb_uri: str = Field(..., alias="MONGODB_URI")
    mongodb_db: str = Field("rentpilot", alias="MONGODB_DB")
    groq_api_key: str | None = Field(None, alias="GROQ_API_KEY")
    groq_model: str = Field("llama-3.1-8b-instant", alias="GROQ_MODEL")
    prefer_groq: bool = Field(default=True, alias="PREFER_GROQ")
    gemini_api_key: str | None = Field(None, alias="GEMINI_API_KEY")
    gemini_model: str = Field("gemini-1.5-flash-latest", alias="GEMINI_MODEL")
    system_prompt: str = Field(
        "You are RentPilot AI, an intelligent, enterprise-grade property management assistant built for Indian landlords. "
        "Help manage tenants, automate maintenance workflows, track rent collection velocity, "
        "and deliver clear operational analytics professionally and efficiently.",
        alias="SYSTEM_PROMPT",
    )
    rate_limit_per_minute: int = Field(120, alias="RATE_LIMIT_PER_MINUTE")
    allowed_origins: str = Field(default="*", alias="ALLOWED_ORIGINS")
    allowed_origins_regex: str | None = Field(default=None, alias="ALLOWED_ORIGINS_REGEX")
    allow_credentials: bool = Field(default=False, alias="ALLOW_CREDENTIALS")
    jwt_secret: str = Field("change-me", alias="JWT_SECRET")
    jwt_algorithm: str = Field("HS256", alias="JWT_ALGORITHM")
    access_token_minutes: int = Field(30, alias="ACCESS_TOKEN_MINUTES")
    refresh_token_days: int = Field(7, alias="REFRESH_TOKEN_DAYS")
    cloudinary_url: str | None = Field(None, alias="CLOUDINARY_URL")
    cloudinary_key: str | None = Field(None, alias="CLOUDINARY_KEY")
    cloudinary_name: str | None = Field(None, alias="CLOUDINARY_NAME")
    cloudinary_secret: str | None = Field(None, alias="CLOUDINARY_SECRET")
    vector_store: str = Field("inmemory", alias="VECTOR_STORE")
    mail_server: str | None = Field(None, alias="MAIL_SERVER")
    mail_port: int = Field(587, alias="MAIL_PORT")
    mail_username: str | None = Field(None, alias="MAIL_USERNAME")
    mail_password: str | None = Field(None, alias="MAIL_PASSWORD")
    mail_from: str | None = Field(None, alias="MAIL_FROM")
    mail_from_name: str | None = Field(None, alias="MAIL_FROM_NAME")
    mail_starttls: bool = Field(True, alias="MAIL_STARTTLS")
    mail_ssl_tls: bool = Field(False, alias="MAIL_SSL_TLS")
    mail_validate_certs: bool = Field(True, alias="MAIL_VALIDATE_CERTS")
    tenant_portal_url: str | None = Field(None, alias="TENANT_PORTAL_URL")
    portal_url: str | None = Field(None, alias="PORTAL_URL")
    password_reset_minutes: int = Field(30, alias="PASSWORD_RESET_MINUTES")

    model_config = SettingsConfigDict(
        env_file=str(_ENV_FILE),
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    def get_allowed_origins(self) -> List[str]:
        raw = (self.allowed_origins or "*").strip()
        if not raw:
            return ["*"]
        if raw == "*":
            return ["*"]
        if raw.startswith("["):
            try:
                parsed = json.loads(raw)
                if isinstance(parsed, list):
                    return [
                        str(item).strip().strip('"').strip("'").rstrip("/")
                        for item in parsed
                        if str(item).strip()
                    ]
            except json.JSONDecodeError:
                pass
        return [
            item.strip().strip('"').strip("'").rstrip("/")
            for item in raw.split(",")
            if item.strip()
        ]


@lru_cache
def get_settings() -> Settings:
    return Settings()
