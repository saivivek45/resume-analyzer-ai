from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database.db import engine
from app.database.base import Base

from app.models.user import User
from app.models.otp import OTPVerification
from app.models.resume import Resume
from app.models.resume_analytics import ResumeAnalysis


from app.routers.auth import router as auth_router
from app.routers.resume import router as resume_router
from app.routers.ats import router as ats_router
from app.routers.interview import router as interview_router
from app.routes_health import router as health_router

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CareerPilot AI",
    description="AI-powered career assistant for resume analysis, skill-gap detection, assessments, and interview preparation",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(auth_router)
app.include_router(resume_router)
app.include_router(ats_router)
app.include_router(interview_router)

@app.get("/")
def welcome():
    return {
        "message": "Welcome to CareerPilot AI",
        "docs": "/docs",
        "health": "/health"
    }
