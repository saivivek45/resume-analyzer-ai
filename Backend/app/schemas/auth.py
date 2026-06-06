from typing import Annotated
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field, StringConstraints

Password = Annotated[
    str,
    StringConstraints(min_length=8, max_length=128),
]
FullName = Annotated[
    str,
    StringConstraints(strip_whitespace=True, min_length=2, max_length=255),
]


class SendOTPRequest(BaseModel):
    email: EmailStr
    password: Password
    full_name: FullName


class LoginRequest(BaseModel):
    email: EmailStr
    password: Annotated[str, StringConstraints(min_length=1, max_length=128)]


class VerifyOTPRequest(BaseModel):
    email: EmailStr
    otp: Annotated[str, StringConstraints(pattern=r"^\d{6}$")]


class GoogleLoginRequest(BaseModel):
    credential: Annotated[str, StringConstraints(min_length=20)]


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    email: EmailStr
    full_name: str


class AuthResponse(BaseModel):
    message: str
    user: UserResponse


class MessageResponse(BaseModel):
    message: str
