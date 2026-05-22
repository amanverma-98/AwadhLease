from __future__ import annotations

from beanie import PydanticObjectId
from fastapi import HTTPException

from app.core.config import get_settings
from app.models.ai_prediction import AIPrediction
from app.models.property import Property
from app.models.tenant import Tenant
from app.schemas.ai_ops import (
    AIPredictionResponse,
    OccupancyPredictionRequest,
    PaymentDelayRequest,
    TenantRiskRequest,
)
from app.services.ai.factory import get_ai_client


class AIOpsService:
    def __init__(self) -> None:
        settings = get_settings()
        self._client = get_ai_client()
        self._system_prompt = settings.system_prompt

    async def tenant_risk(self, payload: TenantRiskRequest) -> AIPredictionResponse:
        tenant = await Tenant.get(PydanticObjectId(payload.tenant_id))
        if not tenant:
            raise HTTPException(status_code=404, detail="Tenant not found")
        prompt = (
            "Analyze tenant risk and return JSON with risk_level, score, and reason. "
            f"Context: {payload.context}"
        )
        data = await self._client.generate_json(prompt, self._system_prompt)
        prediction = AIPrediction(prediction_type="tenant_risk", subject_id=str(tenant.id), payload=data)
        await prediction.insert()
        return AIPredictionResponse(
            prediction_id=str(prediction.id),
            prediction_type=prediction.prediction_type,
            payload=prediction.payload,
        )

    async def occupancy_prediction(
        self, payload: OccupancyPredictionRequest
    ) -> AIPredictionResponse:
        prop = await Property.get(PydanticObjectId(payload.property_id))
        if not prop:
            raise HTTPException(status_code=404, detail="Property not found")
        prompt = (
            "Predict occupancy trend and return JSON with predicted_rate and reasoning. "
            f"Horizon days: {payload.horizon_days}. Context: {payload.context}"
        )
        data = await self._client.generate_json(prompt, self._system_prompt)
        prediction = AIPrediction(
            prediction_type="occupancy_prediction",
            subject_id=str(prop.id),
            payload=data,
        )
        await prediction.insert()
        return AIPredictionResponse(
            prediction_id=str(prediction.id),
            prediction_type=prediction.prediction_type,
            payload=prediction.payload,
        )

    async def payment_delay(self, payload: PaymentDelayRequest) -> AIPredictionResponse:
        tenant = await Tenant.get(PydanticObjectId(payload.tenant_id))
        if not tenant:
            raise HTTPException(status_code=404, detail="Tenant not found")
        prompt = (
            "Predict payment delay risk and return JSON with delay_probability and notes. "
            f"Context: {payload.context}"
        )
        data = await self._client.generate_json(prompt, self._system_prompt)
        prediction = AIPrediction(
            prediction_type="payment_delay",
            subject_id=str(tenant.id),
            payload=data,
        )
        await prediction.insert()
        return AIPredictionResponse(
            prediction_id=str(prediction.id),
            prediction_type=prediction.prediction_type,
            payload=prediction.payload,
        )
