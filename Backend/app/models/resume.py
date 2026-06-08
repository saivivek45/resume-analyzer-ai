from sqlalchemy import Column, String, DateTime,ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid
from pydantic import BaseModel, Field
from app.database.base import Base


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False
    )

    filename = Column(String(255), nullable=False)

    file_path = Column(String(500), nullable=False)

    file_size = Column(String(50), nullable=False)

    raw_text = Column(String, nullable=True)

    status = Column(String(50), default="uploaded")

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

class ResumeTextPayload(BaseModel):
    text: str = Field(..., min_length=1)
    file_name: str | None = None
    user_email: str | None = None

