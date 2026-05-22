from __future__ import annotations

from pydantic import BaseModel

from Frontend.app.schemas.ai import AnalyticsInsight


class AnalyticsMetrics(BaseModel):
    total_collected: float
    total_pending: float
    success_rate: float
    active_tenant_ratio: float
    occupied_property_ratio: float
    open_maintenance_count: int


class AnalyticsResponse(BaseModel):
    metrics: AnalyticsMetrics
    insight: AnalyticsInsight
