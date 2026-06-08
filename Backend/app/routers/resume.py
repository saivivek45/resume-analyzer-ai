from datetime import datetime, timezone
from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, UploadFile, File
from pydantic import BaseModel, Field

from app.models.resume import ResumeTextPayload

from app.services.pdf_service import (
    extract_text_from_pdf
)

STORAGE_DIR = Path(__file__).resolve().parents[1] / "stored_resumes"


router = APIRouter(
    prefix="/resume",
    tags=["Resume"]
)

@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...)
):
    pdf_bytes = await file.read()

    text = extract_text_from_pdf(
        pdf_bytes
    )

    return {
        "text": text
    }


@router.post("/store")
async def store_resume_text(payload: ResumeTextPayload):
    STORAGE_DIR.mkdir(parents=True, exist_ok=True)

    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
    file_path = STORAGE_DIR / f"resume_{timestamp}_{uuid4().hex}.txt"

    content = [
        f"Original file: {payload.file_name or 'unknown'}",
        f"User email: {payload.user_email or 'unknown'}",
        f"Stored at UTC: {datetime.now(timezone.utc).isoformat()}",
        "",
        payload.text,
    ]

    file_path.write_text("\n".join(content), encoding="utf-8")

    return {
        "message": "Resume text stored",
        "file_path": str(file_path),
    }
