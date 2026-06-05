from pydantic import BaseModel,EmailStr
from uuid import UUID
import datetime


class User(BaseModel):
    id: UUID
    email: EmailStr
    hashed_password:str
    full_name:str
    is_active:bool
    created_at:datetime
    updated_at:datetime