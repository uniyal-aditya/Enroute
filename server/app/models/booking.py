import enum
from datetime import datetime

from sqlalchemy import Column, Integer, String, DateTime, Enum, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class BookingStatus(str, enum.Enum):
    PENDING = "PENDING"
    CONFIRMED = "CONFIRMED"
    REJECTED = "REJECTED"
    COMPLETED = "COMPLETED"


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    route_id = Column(Integer, ForeignKey("route_listings.id"), nullable=False)

    pickup_location = Column(String(200), nullable=False)
    drop_location = Column(String(200), nullable=False)
    goods_description = Column(String(500), nullable=False)
    estimated_weight = Column(String(50), nullable=False)

    status = Column(Enum(BookingStatus), default=BookingStatus.PENDING, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    customer = relationship("User", back_populates="bookings")
    route = relationship("RouteListing", back_populates="bookings")
