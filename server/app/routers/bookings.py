from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.dependencies.database import get_db
from app.dependencies.auth import require_customer, require_driver
from app.models.booking import Booking, BookingStatus
from app.models.route_listing import RouteListing, RouteStatus
from app.models.user import User
from app.schemas.booking import BookingCreate, BookingStatusUpdate, BookingOut

router = APIRouter(prefix="/api/bookings", tags=["Bookings"])


@router.post("/", response_model=BookingOut, status_code=status.HTTP_201_CREATED)
def create_booking(
    payload: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_customer),
):
    route = db.query(RouteListing).filter(RouteListing.id == payload.route_id).first()
    if not route:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Route not found")
    if route.status != RouteStatus.ACTIVE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This route is no longer accepting bookings",
        )

    existing = (
        db.query(Booking)
        .filter(
            Booking.customer_id == current_user.id,
            Booking.route_id == payload.route_id,
            Booking.status.in_([BookingStatus.PENDING, BookingStatus.CONFIRMED]),
        )
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"You already have a {existing.status.value.lower()} request on this route",
        )

    booking = Booking(
        customer_id=current_user.id,
        route_id=payload.route_id,
        pickup_location=payload.pickup_location,
        drop_location=payload.drop_location,
        goods_description=payload.goods_description,
        estimated_weight=payload.estimated_weight,
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking


@router.get("/my-bookings", response_model=list[BookingOut])
def my_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_customer),
):
    bookings = (
        db.query(Booking)
        .options(joinedload(Booking.route).joinedload(RouteListing.driver))
        .filter(Booking.customer_id == current_user.id)
        .order_by(Booking.created_at.desc())
        .all()
    )
    results = []
    for b in bookings:
        out = BookingOut.model_validate(b)
        out.route.contact_phone = None
        # The driver's number travels with the booking only after approval
        out.contact_phone = b.route.contact_phone if b.status == BookingStatus.CONFIRMED else None
        results.append(out)
    return results


@router.get("/driver-requests", response_model=list[BookingOut])
def driver_requests(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_driver),
):
    """All booking requests made against routes this driver posted."""
    bookings = (
        db.query(Booking)
        .join(RouteListing, Booking.route_id == RouteListing.id)
        .options(joinedload(Booking.route).joinedload(RouteListing.driver))
        .filter(RouteListing.driver_id == current_user.id)
        .order_by(Booking.created_at.desc())
        .all()
    )
    results = []
    for b in bookings:
        out = BookingOut.model_validate(b)
        out.route.contact_phone = None
        out.contact_phone = b.route.contact_phone
        results.append(out)
    return results


@router.patch("/{booking_id}/status", response_model=BookingOut)
def update_booking_status(
    booking_id: int,
    payload: BookingStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_driver),
):
    booking = (
        db.query(Booking)
        .options(joinedload(Booking.route).joinedload(RouteListing.driver))
        .filter(Booking.id == booking_id)
        .first()
    )
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")
    if booking.route.driver_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only manage requests on your own routes",
        )
    if booking.status != BookingStatus.PENDING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"This booking is already {booking.status.value}",
        )
    if payload.status not in (BookingStatus.CONFIRMED, BookingStatus.REJECTED):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Drivers can only CONFIRM or REJECT a pending request",
        )

    booking.status = payload.status
    db.commit()
    db.refresh(booking)
    return booking
