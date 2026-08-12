from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from app.database.db import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.models.resume import Resume
from app.services.llm_service import match_ats_with_llm

router = APIRouter(prefix="/ats", tags=["ATS"])

class ATSMatchRequest(BaseModel):
    resume_id: Optional[str] = None
    job_description: str

@router.post("/match")
async def match_resume_to_job(
    payload: ATSMatchRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if payload.resume_id:
        resume = db.query(Resume).filter(Resume.id == payload.resume_id, Resume.user_id == current_user.id).first()
    else:
        resume = db.query(Resume).filter(Resume.user_id == current_user.id).order_by(Resume.created_at.desc()).first()
        
    if not resume:
        raise HTTPException(status_code=404, detail="No resume found to match against. Please upload a resume first.")
        
    match_result = match_ats_with_llm(resume.raw_text, payload.job_description)
    return match_result
