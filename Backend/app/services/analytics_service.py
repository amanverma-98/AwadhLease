from __future__ import annotations

from typing import Dict

from beanie.operators import In

from app.agents.analytics_agent import AnalyticsAgent
from app.core.config import get_settings
from app.models.maintenance import MaintenanceTicket
from app.models.payment import Payment
from app.models.property import Property
from app.models.tenant import Tenant
from app.schemas.analytics import AnalyticsMetrics
from app.services.ai.factory import get_ai_client


class AnalyticsService:
    def __init__(self) -> None:
        settings = get_settings()
        self._agent = AnalyticsAgent(get_ai_client(), settings.system_prompt)

    async def compute_metrics(self) -> AnalyticsMetrics:
        payment_collection = Payment.get_motor_collection()
        pipeline = [
            {"$group": {"_id": "$payment_status", "total": {"$sum": "$amount"}}}
        ]
        payments = await payment_collection.aggregate(pipeline).to_list(length=None)
        totals = {item["_id"]: item["total"] for item in payments}
        total_collected = float(totals.get("Success", 0))
        total_pending = float(totals.get("Pending", 0) + totals.get("Failed", 0))
        denominator = total_collected + total_pending
        success_rate = (total_collected / denominator) if denominator > 0 else 0.0

        total_tenants = await Tenant.find().count()
        active_tenants = await Tenant.find(
            In(Tenant.rent_status, ["Paid", "Pending"])
        ).count()
        active_ratio = (active_tenants / total_tenants) if total_tenants else 0.0

        total_properties = await Property.find().count()
        occupied_properties = await Property.find(
            Property.occupancy_status == "Occupied"
        ).count()
        occupied_ratio = (
            occupied_properties / total_properties if total_properties else 0.0
        )

        open_maintenance = await MaintenanceTicket.find(
            MaintenanceTicket.status == "Open"
        ).count()

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
        insight = await self._agent.summarize(metrics_text)
        return {"metrics": metrics, "insight": insight}
