from __future__ import annotations

from typing import Any

from beanie import PydanticObjectId


def get_link_id(value: Any) -> str | None:
    if value is None:
        return None
    if isinstance(value, str):
        return value
    if isinstance(value, PydanticObjectId):
        return str(value)

    ref = getattr(value, "ref", None)
    if ref is not None:
        ref_id = getattr(ref, "id", None)
        if ref_id is not None:
            return str(ref_id)

    link_id = getattr(value, "id", None)
    if link_id is not None:
        return str(link_id)

    return None
