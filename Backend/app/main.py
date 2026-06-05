from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.db import engine, SessionLocal
from app.database.base import Base

from app.models.user import User
from app.models.resume import Resume
from app.models.resume_analytics import ResumeAnalysis


from app.routers.auth import router as auth_router
# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="CareerPilot AI")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


app.include_router(auth_router)

@app.get("/")
def welcome():
    return {"message": "Welcome"}