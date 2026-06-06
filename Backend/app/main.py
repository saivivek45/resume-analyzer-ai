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
# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="CareerPilot AI")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)

@app.get("/")
def welcome():
    return {"message": "Welcome"}
