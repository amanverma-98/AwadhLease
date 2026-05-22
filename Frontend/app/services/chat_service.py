from __future__ import annotations

from Frontend.app.core.config import get_settings
from Frontend.app.models.ai_conversation import AIConversation
from Frontend.app.models.ai_message import AIMessage
from Frontend.app.models.user import User
from Frontend.app.services.ai.factory import get_ai_client


class ChatService:
    def __init__(self) -> None:
        settings = get_settings()
        self._system_prompt = settings.system_prompt
        self._client = get_ai_client()

    async def respond(self, message: str, conversation_id: str | None, user: User | None) -> tuple[str, str]:
        conversation = None
        if conversation_id:
            conversation = await AIConversation.get(conversation_id)
        if conversation is None:
            conversation = AIConversation(user_id=user)
            await conversation.insert()

        await AIMessage(conversation_id=conversation, role="user", content=message).insert()
        prompt = f"User: {message}\nAssistant:"
        response = await self._client.generate_text(prompt, self._system_prompt)
        await AIMessage(conversation_id=conversation, role="assistant", content=response).insert()
        return response, str(conversation.id)
