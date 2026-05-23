from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import Settings


def apply_cors(app: FastAPI, settings: Settings) -> None:
    origins = settings.get_allowed_origins()
    # Credentials cannot be used with wildcard origins in browsers.
    allow_credentials = "*" not in origins
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=allow_credentials,
        allow_methods=["*"],
        allow_headers=["*"],
    )
