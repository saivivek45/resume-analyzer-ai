from sqlalchemy import Column, Integer, DateTime, JSON, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid

from app.database.base import Base


class ResumeAnalysis(Base):
    __tablename__ = "resume_analyses"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    resume_id = Column(
        UUID(as_uuid=True),
        ForeignKey("resumes.id"),
        nullable=False
    )

    overall_score = Column(Integer)

    detected_skills = Column(JSON)

    missing_skills = Column(JSON)

    strengths = Column(JSON)

    weaknesses = Column(JSON)

    recommendations = Column(JSON)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )