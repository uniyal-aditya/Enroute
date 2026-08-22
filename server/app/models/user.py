import enum
from datetime import datetime

from sqlalchemy import Column, Integer, String, DateTime, Enum, Text
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

    # Extended driver & business profile fields
    vehicle_number = Column(String(30), nullable=True)
    truck_type = Column(String(50), nullable=True)
    truck_capacity = Column(String(50), nullable=True)
    company_name = Column(String(100), nullable=True)
    bio = Column(Text, nullable=True)

    # A driver can post many route listings; a customer can make many bookings
    route_listings = relationship(
        "RouteListing", back_populates="driver", cascade="all, delete-orphan"
    )
    bookings = relationship(
        "Booking", back_populates="customer", cascade="all, delete-orphan"
    )
