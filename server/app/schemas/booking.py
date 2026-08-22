from datetime import datetime

from pydantic import BaseModel, Field, ConfigDict

from app.models.booking import BookingStatus
from app.schemas.listing import RouteListingOut


class BookingCreate(BaseModel):
    route_id: int
    pickup_location: str = Field(min_length=1, max_length=200)
    drop_location: str = Field(min_length=1, max_length=200)
    goods_description: str = Field(min_length=1, max_length=500)
    estimated_weight: str = Field(max_length=50)


class BookingStatusUpdate(BaseModel):
    status: BookingStatus


class BookingOut(BaseModel):
    id: int
    customer_id: int
    route_id: int
    pickup_location: str
    drop_location: str
    goods_description: str
    estimated_weight: str
    status: BookingStatus
    created_at: datetime
    route: RouteListingOut
    # Driver's phone, set only once the booking is CONFIRMED (for the customer)
    # or when the viewer is the route owner (for the driver).
    contact_phone: str | None = None

    model_config = ConfigDict(from_attributes=True)
