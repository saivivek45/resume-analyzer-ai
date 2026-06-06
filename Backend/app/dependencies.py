from fastapi import Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.models.user import User
from app.services.jwt_service import verify_token


def get_current_user(
    request: Request,
    db: Session = Depends(get_db),
) -> User:
    token = request.cookies.get("access_token")
    credentials_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Not authenticated",
    )

    if not token:
        raise credentials_error

    payload = verify_token(token)
    user_id = payload.get("sub") if payload else None
    if not user_id:
        raise credentials_error

    user = db.query(User).filter(User.id == user_id).first()
    if not user or not user.is_active:
        raise credentials_error

    return user
