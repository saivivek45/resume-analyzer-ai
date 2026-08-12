from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from app.database.db import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.models.resume import Resume
from app.services.llm_service import generate_interview_questions, evaluate_interview_answer

router = APIRouter(prefix="/interview", tags=["Interview"])

class InterviewGenerateRequest(BaseModel):
    role: str
    level: str
    difficulty: str
    resume_id: Optional[str] = None

class InterviewEvaluateRequest(BaseModel):
    question: str
    answer: str

@router.post("/generate")
async def generate_questions(
    payload: InterviewGenerateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    resume_context = ""
    if payload.resume_id:
        resume = db.query(Resume).filter(Resume.id == payload.resume_id, Resume.user_id == current_user.id).first()
    else:
        resume = db.query(Resume).filter(Resume.user_id == current_user.id).order_by(Resume.created_at.desc()).first()
        
    if resume:
        resume_context = resume.raw_text
            
    questions = generate_interview_questions(
        role=payload.role, 
        level=payload.level, 
        difficulty=payload.difficulty, 
        resume_context=resume_context
    )
    return {"questions": questions}

@router.post("/evaluate")
async def evaluate_answer(
    payload: InterviewEvaluateRequest,
    current_user: User = Depends(get_current_user)
):
    feedback = evaluate_interview_answer(payload.question, payload.answer)
    return {"feedback": feedback}
