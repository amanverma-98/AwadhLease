from __future__ import annotations

from app.core.config import get_settings
from app.models.landlord import Landlord
from app.models.maintenance import MaintenanceTicket
from app.models.payment import Payment
from app.models.property import Property
from app.models.tenant import Tenant
from app.models.ai_conversation import AIConversation
from app.models.ai_message import AIMessage
from app.models.user import User
from app.services.ai.factory import get_ai_client
from beanie.operators import In


class ChatService:
    def __init__(self) -> None:
        settings = get_settings()
        self._system_prompt = settings.system_prompt
        self._client = get_ai_client()

    async def _build_landlord_context(self, user: User | None) -> str:
        if user is None:
            return "Context: No authenticated landlord."

        landlord = await Landlord.find(Landlord.user_id.id == user.id).first_or_none()
        if not landlord:
            return "Context: No landlord profile found for this user."

        properties = await Property.find(Property.landlord_id.id == landlord.id).to_list()
        property_ids = [prop.id for prop in properties]
        tenants = await Tenant.find(Tenant.landlord_id.id == landlord.id).to_list()

        open_maintenance = 0
        if property_ids:
            open_maintenance = await MaintenanceTicket.find(
                MaintenanceTicket.status == "Open",
                In(MaintenanceTicket.property_id.id, property_ids),
            ).count()

        payments = []
        if property_ids:
            payments = await Payment.find(In(Payment.property_id.id, property_ids)).to_list()
        totals = {"Success": 0.0, "Pending": 0.0, "Failed": 0.0}
        for payment in payments:
            totals[payment.payment_status] = totals.get(payment.payment_status, 0.0) + float(
                payment.amount
            )

        top_properties = ", ".join(
            f"{prop.name} ({prop.occupancy_status})" for prop in properties[:5]
        ) or "None"

        return (
            "Context: Use only the data below. If information is missing, say so and ask for it. "
            "Do not invent tenants, properties, or numbers.\n"
            f"Landlord properties count: {len(properties)}.\n"
            f"Landlord tenants count: {len(tenants)}.\n"
            f"Open maintenance tickets: {open_maintenance}.\n"
            f"Payments totals (Success/Pending/Failed): {totals.get('Success', 0.0)}/"
            f"{totals.get('Pending', 0.0)}/{totals.get('Failed', 0.0)}.\n"
            f"Top properties: {top_properties}."
        )

    async def respond(self, message: str, conversation_id: str | None, user: User | None) -> tuple[str, str]:
        conversation = None
        if conversation_id:
            conversation = await AIConversation.get(conversation_id)
        if conversation is None:
            conversation = AIConversation(user_id=user)
            await conversation.insert()

        await AIMessage(conversation_id=conversation, role="user", content=message).insert()
        context = await self._build_landlord_context(user)
        prompt = f"{context}\n\nUser: {message}\nAssistant:"
        response = await self._client.generate_text(prompt, self._system_prompt)
        await AIMessage(conversation_id=conversation, role="assistant", content=response).insert()
        return response, str(conversation.id)
