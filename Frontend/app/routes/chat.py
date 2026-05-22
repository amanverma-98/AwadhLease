from __future__ import annotations

from fastapi import APIRouter, Depends

from Frontend.app.auth.dependencies import get_optional_user
from Frontend.app.middleware.rate_limit import rate_limit_dependency
from Frontend.app.schemas.chat import ChatRequest, ChatResponse
from Frontend.app.services.chat_service import ChatService

router = APIRouter(prefix="/chat", tags=["chat"], dependencies=[Depends(rate_limit_dependency)])
service = ChatService()


@router.post("", response_model=ChatResponse)
async def chat(payload: ChatRequest, user=Depends(get_optional_user)):
    response_text, conversation_id = await service.respond(
        payload.message, payload.conversation_id, user
    )
    return ChatResponse(response=response_text, conversation_id=conversation_id)
