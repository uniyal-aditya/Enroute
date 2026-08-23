from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, ConfigDict, field_validator

from app.models.user import UserRole


class UserRegister(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(min_length=6, max_length=100)
    phone: str = Field(min_length=6, max_length=20)
    role: UserRole
    # Optional fields for drivers & businesses
    vehicle_number: str | None = Field(default=None, max_length=50)
    truck_type: str | None = Field(default=None, max_length=100)
    truck_capacity: str | None = Field(default=None, max_length=50)
    company_name: str | None = Field(default=None, max_length=150)
    bio: str | None = Field(default=None, max_length=2000)

    @field_validator("email", mode="before")
    @classmethod
    def clean_email(cls, v: str) -> str:
        if isinstance(v, str):
            return v.strip().lower()
        return v

    @field_validator("name", "phone", mode="before")
    @classmethod
    def clean_strings(cls, v: str) -> str:
        if isinstance(v, str):
            return v.strip()
        return v

    @field_validator("vehicle_number", "truck_type", "truck_capacity", "company_name", "bio", mode="before")
    @classmethod
    def empty_str_to_none(cls, v: str | None) -> str | None:
        if isinstance(v, str):
            trimmed = v.strip()
            return trimmed if trimmed else None
        return v


class UserLogin(BaseModel):
    email: str = Field(min_length=1)
    password: str = Field(min_length=1)

    @field_validator("email", mode="before")
    @classmethod
    def clean_email(cls, v: str) -> str:
        if isinstance(v, str):
            return v.strip().lower()
        return v


class UserProfileUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=100)
    phone: str | None = Field(default=None, min_length=6, max_length=20)
    vehicle_number: str | None = Field(default=None, max_length=50)
    truck_type: str | None = Field(default=None, max_length=100)
    truck_capacity: str | None = Field(default=None, max_length=50)
    company_name: str | None = Field(default=None, max_length=150)
    bio: str | None = Field(default=None, max_length=2000)

    @field_validator("name", "phone", "vehicle_number", "truck_type", "truck_capacity", "company_name", "bio", mode="before")
    @classmethod
    def clean_fields(cls, v: str | None) -> str | None:
        if isinstance(v, str):
            trimmed = v.strip()
            return trimmed if trimmed else None
        return v


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
