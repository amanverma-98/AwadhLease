from __future__ import annotations

from typing import Dict


def recommend_rent_update(current_rent: float, occupancy_rate: float) -> Dict[str, float | str]:
    adjustment = 0.0
    if occupancy_rate > 0.9:
        adjustment = 0.05
    elif occupancy_rate < 0.6:
        adjustment = -0.04
    suggested = current_rent * (1 + adjustment)
    return {
        "suggested_rent": round(suggested, 2),
        "adjustment": adjustment,
        "note": "Mock market model - replace with real predictor",
    }
