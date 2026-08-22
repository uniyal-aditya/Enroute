import enum
from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    DateTime,
    Enum,
    Text,
    ForeignKey,
    Index,
)
from sqlalchemy.orm import relationship

from app.database import Base


class RouteStatus(str, enum.Enum):
    ACTIVE = "ACTIVE"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"


class RouteListing(Base):
    __tablename__ = "route_listings"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    driver_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)

    origin = Column(String(200), nullable=False, index=True)
    destination = Column(String(200), nullable=False, index=True)
    origin_lat = Column(Float, nullable=False)
    origin_lng = Column(Float, nullable=False)
    dest_lat = Column(Float, nullable=False)
    dest_lng = Column(Float, nullable=False)

    departure_date = Column(DateTime, nullable=False, index=True)
    distance_km = Column(Float, nullable=False)

    truck_type = Column(String(50), nullable=False)
    truck_capacity = Column(String(50), nullable=False)
    available_space = Column(String(100), nullable=False)

    rate_per_km = Column(Float, nullable=False)
    flat_rate = Column(Float, nullable=True)
    description = Column(Text, nullable=True)

    status = Column(Enum(RouteStatus), default=RouteStatus.ACTIVE, nullable=False, index=True)
    contact_phone = Column(String(15), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    driver = relationship("User", back_populates="route_listings")
    bookings = relationship(
        "Booking", back_populates="route", cascade="all, delete-orphan"
    )

    __table_args__ = (
        Index("ix_route_origin_dest", "origin", "destination"),
    )
