import enum
from datetime import datetime

from sqlalchemy import Column, Integer, String, DateTime, Enum
from sqlalchemy.orm import relationship

from app.database import Base


class UserRole(str, enum.Enum):
    DRIVER = "DRIVER"
    CUSTOMER = "CUSTOMER"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    email = Column(String(120), unique=True, index=True, nullable=False)
    password_hash = Column(String(256), nullable=False)
    phone = Column(String(15), nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # NOTE: Extended profile fields (vehicle_number, truck_type, truck_capacity,
    # company_name, bio) are intentionally NOT in this model because they do not
    # exist in the live Supabase PostgreSQL schema.
    # In demo/hackathon mode these details are stored in localStorage on the
    # frontend. Add a proper DB migration before re-enabling them in production.

    # A driver can post many route listings; a customer can make many bookings
    route_listings = relationship(
        "RouteListing", back_populates="driver", cascade="all, delete-orphan"
    )
    bookings = relationship(
        "Booking", back_populates="customer", cascade="all, delete-orphan"
    )
