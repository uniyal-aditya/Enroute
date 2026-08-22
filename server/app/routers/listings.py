from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.dependencies.database import get_db
from app.dependencies.auth import get_current_user_optional, require_driver
from app.models.route_listing import RouteListing, RouteStatus
from app.models.user import User
from app.schemas.listing import RouteListingCreate, RouteListingUpdate, RouteListingOut

router = APIRouter(prefix="/api/routes", tags=["Route Listings"])


def _serialize(listing: RouteListing, viewer: User | None) -> RouteListingOut:
    """Owner sees their own contact number; everyone else gets it stripped."""
    out = RouteListingOut.model_validate(listing)
    is_owner = viewer is not None and viewer.id == listing.driver_id
    out.contact_phone = listing.contact_phone if is_owner else None
    return out


@router.post("/", response_model=RouteListingOut, status_code=status.HTTP_201_CREATED)
def create_listing(
    payload: RouteListingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_driver),
):
    listing = RouteListing(**payload.model_dump(), driver_id=current_user.id)
    db.add(listing)
    db.commit()
    db.refresh(listing)
    return _serialize(listing, current_user)


@router.get("/", response_model=list[RouteListingOut])
def browse_listings(
    origin: str | None = None,
    destination: str | None = None,
    truck_type: str | None = None,
    departure_after: datetime | None = None,
    status_filter: RouteStatus = RouteStatus.ACTIVE,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
):
    """Browse/search active routes. Defaults to ACTIVE listings only so
    completed/cancelled trips don't clutter the customer's search results."""
    query = db.query(RouteListing).options(joinedload(RouteListing.driver))

    if status_filter:
        query = query.filter(RouteListing.status == status_filter)
    if origin:
        query = query.filter(RouteListing.origin.ilike(f"%{origin}%"))
    if destination:
        query = query.filter(RouteListing.destination.ilike(f"%{destination}%"))
    if truck_type:
        query = query.filter(RouteListing.truck_type.ilike(f"%{truck_type}%"))
    if departure_after:
        query = query.filter(RouteListing.departure_date >= departure_after)

    listings = query.order_by(RouteListing.departure_date.asc()).all()
    return [_serialize(l, current_user) for l in listings]


@router.get("/my-listings", response_model=list[RouteListingOut])
def my_listings(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_driver),
):
    listings = (
        db.query(RouteListing)
        .options(joinedload(RouteListing.driver))
        .filter(RouteListing.driver_id == current_user.id)
        .order_by(RouteListing.created_at.desc())
        .all()
    )
    return [_serialize(l, current_user) for l in listings]


@router.get("/{listing_id}", response_model=RouteListingOut)
def get_listing(
    listing_id: int,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
):
    listing = (
        db.query(RouteListing)
        .options(joinedload(RouteListing.driver))
        .filter(RouteListing.id == listing_id)
        .first()
    )
    if not listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Route not found")
    return _serialize(listing, current_user)


def _get_owned_listing(listing_id: int, db: Session, current_user: User) -> RouteListing:
    listing = db.query(RouteListing).filter(RouteListing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Route not found")
    if listing.driver_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only modify your own listings",
        )
    return listing


@router.put("/{listing_id}", response_model=RouteListingOut)
def update_listing(
    listing_id: int,
    payload: RouteListingUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_driver),
):
    listing = _get_owned_listing(listing_id, db, current_user)

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(listing, field, value)

    db.commit()
    db.refresh(listing)
    return _serialize(listing, current_user)


@router.delete("/{listing_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_listing(
    listing_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_driver),
):
    listing = _get_owned_listing(listing_id, db, current_user)
    # "Cancel" per the plan - soft delete by flipping status rather than
    # hard-deleting, so any bookings referencing it keep working.
    listing.status = RouteStatus.CANCELLED
    db.commit()
    return None
