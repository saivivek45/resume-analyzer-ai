"""Health check and status endpoints."""

from fastapi import APIRouter, HTTPException, status
from sqlalchemy import text

from app.database.db import SessionLocal

router = APIRouter(prefix="/health", tags=["health"])


@router.get("")
async def health_check():
    """
    Health check endpoint for monitoring.
    
    Returns:
        dict: Status of the application
    """
    return {
        "status": "healthy",
        "service": "careerpilot-api",
        "version": "1.0.0"
    }


@router.get("/ready")
async def readiness_check():
    """
    Readiness check endpoint.
    Verifies that all critical dependencies are available.
    
    Returns:
        dict: Readiness status and dependency checks
    """
    checks = {
        "database": False,
    }
    
    # Check database connection
    try:
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db.close()
        checks["database"] = True
    except Exception as e:
        checks["database"] = False
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Database check failed: {str(e)}"
        )
    
    return {
        "status": "ready",
        "checks": checks
    }


@router.get("/live")
async def liveness_check():
    """
    Liveness check endpoint.
    Indicates if the service is running and responsive.
    
    Returns:
        dict: Liveness status
    """
    return {
        "status": "live",
        "service": "careerpilot-api"
    }
