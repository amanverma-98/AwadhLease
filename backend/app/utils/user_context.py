from __future__ import annotations

from typing import Optional, Tuple

from app.models.landlord import Landlord
from app.models.tenant import Tenant
from app.models.user import User
from app.utils.link import get_link_id


async def get_landlord_for_user(user: User) -> Landlord | None:
    if user.role != "landlord":
        return None
    return await Landlord.find(Landlord.user_id.id == user.id).first_or_none()


async def get_tenant_for_user(user: User) -> Tenant | None:
    if user.role != "tenant":
        return None
    return await Tenant.find(Tenant.user_id.id == user.id).first_or_none()


async def resolve_profile_context(
    user: User,
) -> Tuple[Optional[str], Optional[str], Optional[str], Optional[Tenant]]:
    """Returns (landlord_id, tenant_id, property_id, tenant_doc)."""
    landlord_id: str | None = None
    tenant_id: str | None = None
    property_id: str | None = None
    tenant_doc: Tenant | None = None

    if user.role == "landlord":
        landlord = await get_landlord_for_user(user)
        if landlord:
            landlord_id = str(landlord.id)
    elif user.role == "tenant":
        tenant_doc = await get_tenant_for_user(user)
        if tenant_doc:
            tenant_id = str(tenant_doc.id)
            if tenant_doc.property_id:
                property_id = get_link_id(tenant_doc.property_id)

    return landlord_id, tenant_id, property_id, tenant_doc
