from __future__ import annotations

from typing import Any, Dict

from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pymongo.errors import PyMongoError


def _error_payload(code: str, message: str, details: Any | None = None) -> Dict[str, Any]:
    payload: Dict[str, Any] = {"error": {"code": code, "message": message}}
    if details is not None:
        payload["error"]["details"] = details
    return payload


def add_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(HTTPException)
    async def http_exception_handler(_: Request, exc: HTTPException):
        return JSONResponse(
            status_code=exc.status_code,
            content=_error_payload("http_error", str(exc.detail)),
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(_: Request, exc: RequestValidationError):
        return JSONResponse(
            status_code=422,
            content=_error_payload("validation_error", "Invalid request", exc.errors()),
        )

    @app.exception_handler(PyMongoError)
    async def mongo_exception_handler(_: Request, exc: PyMongoError):
        return JSONResponse(
            status_code=500,
            content=_error_payload("mongo_error", "Database operation failed", str(exc)),
        )

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(_: Request, exc: Exception):
        return JSONResponse(
            status_code=500,
            content=_error_payload("internal_error", "Unexpected error", str(exc)),
        )
