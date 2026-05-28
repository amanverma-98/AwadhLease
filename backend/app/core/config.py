from __future__ import annotations

from functools import lru_cache
from typing import List

from pydantic import Field, computed_field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "RentPilot AI"
    env: str = "dev"
    log_level: str = "INFO"
    api_prefix: str = "/"
    mongodb_uri: str = Field(..., alias="MONGODB_URI")
    mongodb_db: str = Field("rentpilot", alias="MONGODB_DB")
    gemini_api_key: str | None = Field(None, alias="GEMINI_API_KEY")
    gemini_model: str = Field("gemini-1.5-flash", alias="GEMINI_MODEL")
    system_prompt: str = Field(
        "You are RentPilot AI, an intelligent, enterprise-grade property management assistant built for Indian landlords. "
        "Help manage tenants, automate maintenance workflows, track rent collection velocity, "
        "and deliver clear operational analytics professionally and efficiently.",
        alias="SYSTEM_PROMPT",
    )
    rate_limit_per_minute: int = Field(120, alias="RATE_LIMIT_PER_MINUTE")
    allowed_origins_raw: str = Field("*", alias="ALLOWED_ORIGINS")
    jwt_secret: str = Field("change-me", alias="JWT_SECRET")
    jwt_algorithm: str = Field("HS256", alias="JWT_ALGORITHM")
    access_token_minutes: int = Field(30, alias="ACCESS_TOKEN_MINUTES")
    refresh_token_days: int = Field(7, alias="REFRESH_TOKEN_DAYS")
    cloudinary_url: str | None = Field(None, alias="CLOUDINARY_URL")
    cloudinary_key: str | None = Field(None, alias="CLOUDINARY_KEY")
    cloudinary_name: str | None = Field(None, alias="CLOUDINARY_NAME")
    cloudinary_secret: str | None = Field(None, alias="CLOUDINARY_SECRET")
    vector_store: str = Field("inmemory", alias="VECTOR_STORE")
    mail_username: str | None = Field(None, alias="MAIL_USERNAME")
    mail_password: str | None = Field(None, alias="MAIL_PASSWORD")
    mail_from: str | None = Field(None, alias="MAIL_FROM")
    mail_from_name: str = Field("Awadhlease", alias="MAIL_FROM_NAME")
    mail_port: int = Field(587, alias="MAIL_PORT")
    mail_server: str | None = Field(None, alias="MAIL_SERVER")
    mail_starttls: bool = Field(True, alias="MAIL_STARTTLS")
    mail_ssl_tls: bool = Field(False, alias="MAIL_SSL_TLS")
    mail_use_credentials: bool = Field(True, alias="MAIL_USE_CREDENTIALS")
    mail_validate_certs: bool = Field(True, alias="MAIL_VALIDATE_CERTS")
    tenant_portal_url: str = Field("http://localhost:5173/login", alias="TENANT_PORTAL_URL")

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
        populate_by_name=True,
    )

    @computed_field  # type: ignore[prop-decorator]
    @property
    def allowed_origins(self) -> List[str]:
        stripped = self.allowed_origins_raw.strip()
        if stripped == "*":
            return ["*"]
        return [item.strip() for item in stripped.split(",") if item.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
