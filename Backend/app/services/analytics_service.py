from __future__ import annotations

from typing import Dict

from beanie.operators import In

from app.agents.analytics_agent import AnalyticsAgent
from app.core.config import get_settings
from app.models.landlord import Landlord
from app.models.maintenance import MaintenanceTicket
from app.models.payment import Payment
from app.models.property import Property
from app.models.tenant import Tenant
from app.schemas.analytics import AnalyticsMetrics
from app.schemas.ai import AnalyticsInsight
from app.services.ai.factory import get_ai_client


class AnalyticsService:
    def __init__(self) -> None:
        settings = get_settings()
        self._agent = AnalyticsAgent(get_ai_client(), settings.system_prompt)

    async def compute_metrics(self, user: User) -> AnalyticsMetrics:
        landlord = await Landlord.find(Landlord.user_id.id == user.id).first_or_none()
        if not landlord:
            return AnalyticsMetrics(
                total_collected=0.0,
                total_pending=0.0,
                success_rate=0.0,
                active_tenant_ratio=0.0,
                occupied_property_ratio=0.0,
                open_maintenance_count=0,
            )

        properties = await Property.find(Property.landlord_id.id == landlord.id).to_list()
        property_ids = [prop.id for prop in properties]

        if property_ids:
            payments = await Payment.find(In(Payment.property_id.id, property_ids)).to_list()
            totals: Dict[str, float] = {}
            for payment in payments:
                totals[payment.payment_status] = totals.get(payment.payment_status, 0.0) + float(
                    payment.amount
                )
        else:
            totals = {}

        total_collected = float(totals.get("Success", 0))
        total_pending = float(totals.get("Pending", 0) + totals.get("Failed", 0))
        denominator = total_collected + total_pending
        success_rate = (total_collected / denominator) if denominator > 0 else 0.0

        total_tenants = await Tenant.find(Tenant.landlord_id.id == landlord.id).count()
        active_tenants = await Tenant.find(
            Tenant.landlord_id.id == landlord.id,
            In(Tenant.rent_status, ["Paid", "Pending"]),
        ).count()
        active_ratio = (active_tenants / total_tenants) if total_tenants else 0.0

        total_properties = len(property_ids)
        occupied_properties = await Property.find(
            Property.landlord_id.id == landlord.id,
            Property.occupancy_status == "Occupied",
        ).count()
        occupied_ratio = (
            occupied_properties / total_properties if total_properties else 0.0
        )

        if property_ids:
            open_maintenance = await MaintenanceTicket.find(
                MaintenanceTicket.status == "Open",
                In(MaintenanceTicket.property_id.id, property_ids),
            ).count()
        else:
            open_maintenance = 0

        return AnalyticsMetrics(
            total_collected=total_collected,
            total_pending=total_pending,
            success_rate=round(success_rate, 4),
            active_tenant_ratio=round(active_ratio, 4),
            occupied_property_ratio=round(occupied_ratio, 4),
            open_maintenance_count=open_maintenance,
        )

    async def summarize(self, metrics: AnalyticsMetrics) -> Dict[str, object]:
        metrics_text = metrics.model_dump_json()
        try:
            insight = await self._agent.summarize(metrics_text)
        except Exception:
            insight = AnalyticsInsight(
                summary=(
                    "Summary based on current metrics: rent collection and occupancy are "
                    f"{metrics.success_rate * 100:.1f}% and {metrics.occupied_property_ratio * 100:.1f}% "
                    "respectively."
                ),
                risks=[
                    "Open maintenance tickets may reduce tenant satisfaction.",
                    "Pending rents can impact cash flow.",
                ],
                opportunities=[
                    "Follow up on pending payments to improve cash flow.",
                    "Prioritize closing open maintenance items.",
                ],
            )
        return {"metrics": metrics, "insight": insight}
