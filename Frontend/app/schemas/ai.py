from __future__ import annotations

from typing import List, Optional

from pydantic import BaseModel


class MaintenanceClassification(BaseModel):
    category: str
    priority: str
    estimated_cost: float
    summary: str


class RentReminder(BaseModel):
    reminder_text: str
    risk_level: str
    template: str


class TenantOnboardingResult(BaseModel):
    full_name: str
    phone: str
    email: Optional[str]
    aadhaar_number: Optional[str]
    pan_number: Optional[str]
    summary: str


class AnalyticsInsight(BaseModel):
    summary: str
    risks: List[str]
    opportunities: List[str]
