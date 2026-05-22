from __future__ import annotations

from pydantic import BaseModel


class WebsocketMessage(BaseModel):
    event: str
    payload: dict
