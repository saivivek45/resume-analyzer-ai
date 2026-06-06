from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, Response, status
from google.auth.exceptions import GoogleAuthError
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.config import settings
from app.database.db import get_db
from app.dependencies import get_current_user
from app.models.otp import OTPVerification
from app.models.user import User
from app.schemas.auth import (
    AuthResponse,
    GoogleLoginRequest,
    LoginRequest,
    MessageResponse,
    SendOTPRequest,
    UserResponse,
    VerifyOTPRequest,
)
from app.services.auth_service import (
    generate_otp,
    hash_otp,
    hash_password,
    verify_otp,
    verify_password,
)
from app.services.email_service import send_otp_email
from app.services.jwt_service import create_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])
COOKIE_NAME = "access_token"


def normalize_email(email: str) -> str:
    return email.strip().lower()


def set_auth_cookie(response: Response, user: User) -> None:
    token = create_access_token({"sub": str(user.id), "email": user.email})
    response.set_cookie(
        key=COOKIE_NAME,
        value=token,
        httponly=True,
        secure=settings.cookie_secure,
        samesite="lax",
        max_age=60 * 60 * 24 * settings.jwt_expire_days,
        expires=60 * 60 * 24 * settings.jwt_expire_days,
        path="/",
    )


@router.post(
    "/send-otp",
    response_model=MessageResponse,
    status_code=status.HTTP_202_ACCEPTED,
)
def send_otp(payload: SendOTPRequest, db: Session = Depends(get_db)):
    email = normalize_email(str(payload.email))
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists",
        )

    db.query(OTPVerification).filter(
        OTPVerification.email == email,
        OTPVerification.is_used.is_(False),
    ).update({"is_used": True}, synchronize_session=False)

    otp = generate_otp()
    verification = OTPVerification(
        email=email,
        otp_code=hash_otp(otp),
        pending_full_name=payload.full_name,
        pending_hashed_password=hash_password(payload.password),
        expires_at=datetime.utcnow() + timedelta(minutes=10),
    )
    db.add(verification)

    try:
        send_otp_email(email, otp)
        db.commit()
    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Unable to send verification email. Please try again later.",
        )

    return {"message": "Verification code sent"}


@router.post(
    "/verify-otp",
    response_model=AuthResponse,
    status_code=status.HTTP_201_CREATED,
)
def verify_signup_otp(
    payload: VerifyOTPRequest,
    response: Response,
    db: Session = Depends(get_db),
):
    email = normalize_email(str(payload.email))
    verification = (
        db.query(OTPVerification)
        .filter(
            OTPVerification.email == email,
            OTPVerification.is_used.is_(False),
        )
        .order_by(OTPVerification.created_at.desc())
        .with_for_update()
        .first()
    )

    if not verification or not verify_otp(payload.otp, verification.otp_code):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid verification code",
        )
    if verification.expires_at <= datetime.utcnow():
        verification.is_used = True
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Verification code has expired",
        )
    if db.query(User).filter(User.email == email).first():
        verification.is_used = True
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists",
        )

    user = User(
        email=email,
        full_name=verification.pending_full_name,
        hashed_password=verification.pending_hashed_password,
        auth_provider="local",
    )
    verification.is_used = True
    db.add(user)

    try:
        db.commit()
        db.refresh(user)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists",
        )

    set_auth_cookie(response, user)
    return {"message": "Account created successfully", "user": user}


@router.post("/login", response_model=AuthResponse)
def login(
    payload: LoginRequest,
    response: Response,
    db: Session = Depends(get_db),
):
    email = normalize_email(str(payload.email))
    user = db.query(User).filter(User.email == email).first()

    if not user or not user.is_active or not verify_password(
        payload.password, user.hashed_password
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    set_auth_cookie(response, user)
    return {"message": "Login successful", "user": user}


@router.post("/google", response_model=AuthResponse)
def google_login(
    payload: GoogleLoginRequest,
    response: Response,
    db: Session = Depends(get_db),
):
    if not settings.google_client_id:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Google authentication is not configured",
        )

    try:
        token_data = id_token.verify_oauth2_token(
            payload.credential,
            google_requests.Request(),
            settings.google_client_id,
        )
    except (ValueError, GoogleAuthError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google credential",
        )

    email_value = token_data.get("email")
    if not email_value or not token_data.get("email_verified"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Google account email is not verified",
        )

    email = normalize_email(email_value)
    user = db.query(User).filter(User.email == email).first()
    if user and not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account is disabled",
        )

    if not user:
        user = User(
            email=email,
            full_name=(token_data.get("name") or email.split("@")[0])[:255],
            hashed_password=None,
            auth_provider="google",
        )
        db.add(user)
        try:
            db.commit()
            db.refresh(user)
        except IntegrityError:
            db.rollback()
            user = db.query(User).filter(User.email == email).first()
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Unable to create account",
                )

    set_auth_cookie(response, user)
    return {"message": "Google login successful", "user": user}


@router.post("/logout", response_model=MessageResponse)
def logout(response: Response):
    response.delete_cookie(
        key=COOKIE_NAME,
        path="/",
        secure=settings.cookie_secure,
        httponly=True,
        samesite="lax",
    )
    return {"message": "Logged out"}


@router.get("/me", response_model=UserResponse)
def me(current_user: User = Depends(get_current_user)):
    return current_user
