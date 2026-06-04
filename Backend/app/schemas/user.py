from pydantic import BaseModel
from uuid import UUID
import datetime


class User(BaseModel):
    id: UUID
    email: str
    hashed_password:str
    full_name:str
    is_active:bool
    created_at:datetime
    updated_at:datetime