from datetime import datetime, timezone
from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.models.resume import ResumeTextPayload, Resume
from app.models.resume_analytics import ResumeAnalysis
from app.models.user import User
from app.database.db import get_db
from app.dependencies import get_current_user

from app.services.pdf_service import extract_text_from_pdf

router = APIRouter(
    prefix="/resume",
    tags=["Resume"]
)
from app.services.llm_service import analyze_resume_with_llm

@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    pdf_bytes = await file.read()

    text = extract_text_from_pdf(
        pdf_bytes
    )

    return {
        "text": text
    }


@router.post("/analyze")
async def analyze_resume(
    payload: ResumeTextPayload,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Create Resume record
    resume = Resume(
        user_id=current_user.id,
        filename=payload.file_name or "Unknown File",
        file_path="db_only",
        file_size="Unknown",
        raw_text=payload.text,
        status="analyzed"
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)

    # Analyze
    analysis_results = analyze_resume_with_llm(payload.text)

    # Create ResumeAnalysis record
    analysis = ResumeAnalysis(
        resume_id=resume.id,
        overall_score=analysis_results["overall_score"],
        detected_skills=analysis_results["detected_skills"],
        missing_skills=analysis_results["missing_skills"],
        strengths=analysis_results["strengths"],
        weaknesses=analysis_results["weaknesses"],
        recommendations=analysis_results["recommendations"]
    )
    db.add(analysis)
    db.commit()

    return {
        **analysis_results,
        "file_name": payload.file_name,
        "user_email": current_user.email
    }


@router.get("/latest")
async def get_latest(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    latest_analysis = (
        db.query(ResumeAnalysis)
        .join(Resume)
        .filter(Resume.user_id == current_user.id)
        .order_by(ResumeAnalysis.created_at.desc())
        .first()
    )
    if not latest_analysis:
        raise HTTPException(status_code=404, detail="No analysis found")
    
    resume = db.query(Resume).filter(Resume.id == latest_analysis.resume_id).first()
    return {
        "overall_score": latest_analysis.overall_score,
        "ats_score": latest_analysis.overall_score,
        "content_score": latest_analysis.overall_score,
        "detected_skills": latest_analysis.detected_skills or [],
        "missing_skills": latest_analysis.missing_skills or [],
        "strengths": latest_analysis.strengths or [],
        "weaknesses": latest_analysis.weaknesses or [],
        "recommendations": latest_analysis.recommendations or [],
        "file_name": resume.filename if resume else "Unknown",
        "user_email": current_user.email
    }

@router.get("/history")
async def get_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    analyses = (
        db.query(ResumeAnalysis)
        .join(Resume)
        .filter(Resume.user_id == current_user.id)
        .order_by(ResumeAnalysis.created_at.desc())
        .limit(12)
        .all()
    )
    
    history = []
    for a in analyses:
        resume = db.query(Resume).filter(Resume.id == a.resume_id).first()
        history.append({
            "id": str(a.id),
            "resumeName": resume.filename if resume else "Unknown",
            "uploadDate": a.created_at.isoformat(),
            "atsScore": a.overall_score, # Using overall score as fallback
            "overallScore": a.overall_score
        })
    return history
