from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, ConfigDict

from app.models.user import UserRole


class UserRegister(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(min_length=6, max_length=100)
    phone: str = Field(min_length=6, max_length=15)
    role: UserRole
    # Optional fields for drivers & businesses
    vehicle_number: str | None = Field(default=None, max_length=30)
    truck_type: str | None = Field(default=None, max_length=50)
    truck_capacity: str | None = Field(default=None, max_length=50)
    company_name: str | None = Field(default=None, max_length=100)
    bio: str | None = Field(default=None, max_length=1000)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserProfileUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=100)
    phone: str | None = Field(default=None, min_length=6, max_length=15)
    vehicle_number: str | None = Field(default=None, max_length=30)
    truck_type: str | None = Field(default=None, max_length=50)
    truck_capacity: str | None = Field(default=None, max_length=50)
    company_name: str | None = Field(default=None, max_length=100)
    bio: str | None = Field(default=None, max_length=1000)


class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    phone: str
    role: UserRole
    created_at: datetime
    vehicle_number: str | None = None
    truck_type: str | None = None
    truck_capacity: str | None = None
    company_name: str | None = None
    bio: str | None = None

    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut | None = None


class TokenData(BaseModel):
    user_id: int | None = None
