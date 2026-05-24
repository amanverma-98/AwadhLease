from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import Settings


def apply_cors(app: FastAPI, settings: Settings) -> None:
    origins = settings.get_allowed_origins()
    allow_credentials = settings.allow_credentials
    allow_origin_regex = settings.allowed_origins_regex

    if "*" in origins:
        if allow_credentials:
            origins = []
            if not allow_origin_regex:
                allow_origin_regex = ".*"
        else:
            origins = ["*"]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_origin_regex=allow_origin_regex,
        allow_credentials=allow_credentials,
        allow_methods=["*"],
        allow_headers=["*"],
    )
