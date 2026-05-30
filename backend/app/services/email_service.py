from __future__ import annotations

from pathlib import Path
import logging

from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType

from app.core.config import get_settings

_TEMPLATE_DIR = Path(__file__).resolve().parents[1] / "templates"


class EmailService:
	def __init__(self) -> None:
		self.settings = get_settings()
		self.logger = logging.getLogger("app.email")
		self._mail: FastMail | None = None

		if self._is_configured():
			self._mail = FastMail(self._build_config())

	def _is_configured(self) -> bool:
		return all(
			[
				self.settings.mail_server,
				self.settings.mail_from,
				self.settings.mail_username,
				self.settings.mail_password,
			]
		)

	def _build_config(self) -> ConnectionConfig:
		from_name = self.settings.mail_from_name or self.settings.app_name
		return ConnectionConfig(
			MAIL_SERVER=self.settings.mail_server,
			MAIL_PORT=self.settings.mail_port,
			MAIL_USERNAME=self.settings.mail_username,
			MAIL_PASSWORD=self.settings.mail_password,
			MAIL_FROM=self.settings.mail_from,
			MAIL_FROM_NAME=from_name,
			MAIL_STARTTLS=self.settings.mail_starttls,
			MAIL_SSL_TLS=self.settings.mail_ssl_tls,
			USE_CREDENTIALS=True,
			VALIDATE_CERTS=self.settings.mail_validate_certs,
			TEMPLATE_FOLDER=str(_TEMPLATE_DIR),
		)

	async def send_tenant_welcome(
		self,
		tenant_email: str,
		temporary_password: str,
		portal_url: str | None = None,
	) -> bool:
		if not self._mail:
			self.logger.warning("Email is not configured; skipping tenant welcome email.")
			return False

		resolved_portal = portal_url or self.settings.tenant_portal_url or ""
		message = MessageSchema(
			subject="Your Awadhlease tenant account",
			recipients=[tenant_email],
			template_body={
				"tenant_email": tenant_email,
				"temporary_password": temporary_password,
				"portal_url": resolved_portal,
			},
			subtype=MessageType.html,
		)

		try:
			await self._mail.send_message(message, template_name="welcome_email.html")
			return True
		except Exception:  # noqa: BLE001
			self.logger.exception("Failed to send tenant welcome email to %s", tenant_email)
			return False

	async def send_password_reset(self, user_email: str, reset_url: str) -> bool:
		if not self._mail:
			self.logger.warning("Email is not configured; skipping password reset email.")
			return False

		message = MessageSchema(
			subject="Reset your Awadhlease password",
			recipients=[user_email],
			template_body={
				"user_email": user_email,
				"reset_url": reset_url,
			},
			subtype=MessageType.html,
		)

		try:
			await self._mail.send_message(message, template_name="reset_password.html")
			return True
		except Exception:  # noqa: BLE001
			self.logger.exception("Failed to send password reset email to %s", user_email)
			return False
