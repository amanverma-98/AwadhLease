from __future__ import annotations

from pydantic import BaseModel


class TenantRiskRequest(BaseModel):
    tenant_id: str
    context: str


class OccupancyPredictionRequest(BaseModel):
    property_id: str
    context: str
    horizon_days: int = 30


class PaymentDelayRequest(BaseModel):
    tenant_id: str
    context: str


class AIPredictionResponse(BaseModel):
    prediction_id: str
    prediction_type: str
    payload: dict
