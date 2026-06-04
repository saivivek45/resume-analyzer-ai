from pydantic import BaseModel
from uuid import UUID
from datetime import datetime


class AnalysisResponse(BaseModel):
    id: UUID
    resume_id: UUID

    overall_score: int

    detected_skills: list[str]
    missing_skills: list[str]

    strengths: list[str]
    weaknesses: list[str]

    recommendations: list[str]

    created_at: datetime

    model_config = {
        "from_attributes": True
    }