from datetime import datetime

from pydantic import BaseModel, Field, ConfigDict

from app.models.route_listing import RouteStatus
from app.schemas.user import UserOut


class RouteListingCreate(BaseModel):
    origin: str = Field(min_length=1, max_length=200)
    destination: str = Field(min_length=1, max_length=200)
    origin_lat: float
    origin_lng: float
    dest_lat: float
    dest_lng: float
    departure_date: datetime
    distance_km: float = Field(gt=0)
    truck_type: str = Field(max_length=50)
    truck_capacity: str = Field(max_length=50)
    available_space: str = Field(max_length=100)
    rate_per_km: float = Field(ge=0)
    flat_rate: float | None = None
    description: str | None = None
    contact_phone: str = Field(min_length=6, max_length=15)


class RouteListingUpdate(BaseModel):
    """All fields optional - only the ones sent get updated (PUT semantics kept simple)."""

    origin: str | None = None
    destination: str | None = None
    origin_lat: float | None = None
    origin_lng: float | None = None
    dest_lat: float | None = None
    dest_lng: float | None = None
    departure_date: datetime | None = None
    distance_km: float | None = None
    truck_type: str | None = None
    truck_capacity: str | None = None
    available_space: str | None = None
    rate_per_km: float | None = None
    flat_rate: float | None = None
    description: str | None = None
    status: RouteStatus | None = None
    contact_phone: str | None = None


class RouteListingOut(BaseModel):
    id: int
    driver_id: int
    origin: str
    destination: str
    origin_lat: float
    origin_lng: float
    dest_lat: float
    dest_lng: float
    departure_date: datetime
    distance_km: float
    truck_type: str
    truck_capacity: str
    available_space: str
    rate_per_km: float
    flat_rate: float | None
    description: str | None
    status: RouteStatus
    # Only populated for the route's owner; hidden from public browsing so the
    # driver's number is revealed exclusively through a confirmed booking.
    contact_phone: str | None = None
    created_at: datetime
    driver: UserOut

    model_config = ConfigDict(from_attributes=True)
