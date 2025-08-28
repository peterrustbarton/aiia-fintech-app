
"""
Score Pydantic Schemas
"""

from pydantic import BaseModel
from decimal import Decimal
from datetime import datetime
from typing import Optional, Dict, Any, List

class FactorBreakdown(BaseModel):
    fundamental: Optional[float] = None
    technical: Optional[float] = None
    sentiment: Optional[float] = None
    momentum: Optional[float] = None
    explanation: Optional[Dict[str, Any]] = None

class ScoreBase(BaseModel):
    symbol: str
    score_value: Decimal

class ScoreResponse(ScoreBase):
    id: int
    calculated_at: datetime
    factor_breakdown_json: Optional[Dict[str, Any]] = None
    score_grade: str
    recommendation: str

    class Config:
        from_attributes = True
