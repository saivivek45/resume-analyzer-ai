from pydantic import BaseModel
from uuid import UUID
from datetime import datetime


class ResumeCreate(BaseModel):
    user_id: UUID


class ResumeUploadResponse(BaseModel):
    id: UUID
    filename: str
    status: str

    model_config = {
        "from_attributes": True
    }


class ResumeResponse(BaseModel):
    id: UUID
    user_id: UUID
    filename: str
    file_path: str
    file_size: str
    raw_text: str | None
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True
    }