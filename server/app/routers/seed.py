from datetime import datetime, timedelta
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies.database import get_db
from app.models.user import User, UserRole
from app.models.route_listing import RouteListing, RouteStatus
from app.models.booking import Booking, BookingStatus
from app.utils.security import hash_password

router = APIRouter(prefix="/api/seed", tags=["Demo Data"])


def seed_database(db: Session):
    # Clear existing demo bookings and routes if needed, or check if already seeded
    existing_driver = db.query(User).filter(User.email == "driver@enroute.com").first()
    if existing_driver:
        # Check count of routes
        route_count = db.query(RouteListing).count()
        if route_count >= 5:
            return {"message": "Demo data already seeded", "routes_count": route_count}

    # 1. Create or get Demo Driver
    driver = existing_driver
    if not driver:
        driver = User(
            name="Rajesh Sharma",
            email="driver@enroute.com",
            password_hash=hash_password("Driver123!"),
            phone="9876543210",
            role=UserRole.DRIVER,
        )
        db.add(driver)
        db.flush()

    # 2. Create or get Demo Driver 2
    driver2 = db.query(User).filter(User.email == "vikram.driver@enroute.com").first()
    if not driver2:
        driver2 = User(
            name="Vikram Singh",
            email="vikram.driver@enroute.com",
            password_hash=hash_password("Driver123!"),
            phone="9811223344",
            role=UserRole.DRIVER,
        )
        db.add(driver2)
        db.flush()

    # 3. Create or get Demo Customer 1
    customer = db.query(User).filter(User.email == "customer@enroute.com").first()
    if not customer:
        customer = User(
            name="Pooja Verma",
            email="customer@enroute.com",
            password_hash=hash_password("Customer123!"),
            phone="9898765432",
            role=UserRole.CUSTOMER,
        )
        db.add(customer)
        db.flush()

    # 4. Create or get Demo Customer 2
    customer2 = db.query(User).filter(User.email == "amit.customer@enroute.com").first()
    if not customer2:
        customer2 = User(
            name="Amit Joshi",
            email="amit.customer@enroute.com",
            password_hash=hash_password("Customer123!"),
            phone="9871122334",
            role=UserRole.CUSTOMER,
        )
        db.add(customer2)
        db.flush()


    now = datetime.utcnow()

    # 5. Create Routes
    sample_routes = [
        RouteListing(
            driver_id=driver.id,
            origin="Dehradun, Uttarakhand",
            destination="Connaught Place, New Delhi",
            origin_lat=30.3165,
            origin_lng=78.0322,
            dest_lat=28.6139,
            dest_lng=77.2090,
            departure_date=now + timedelta(days=1, hours=4),
            distance_km=248.5,
            truck_type="Tata 407",
            truck_capacity="2.5 Tons",
            available_space="1.2 Tons (~60% space available)",
            rate_per_km=18.5,
            flat_rate=4500.0,
            description="Regular morning run from Dehradun Transport Nagar to Azadpur/Okhla. Secure straps and tarp protection available for packaged cartons or electronics.",
            status=RouteStatus.ACTIVE,
            contact_phone="9876543210",
        ),
        RouteListing(
            driver_id=driver2.id,
            origin="New Delhi, Delhi",
            destination="Jaipur, Rajasthan",
            origin_lat=28.6139,
            origin_lng=77.2090,
            dest_lat=26.9124,
            dest_lng=75.7873,
            departure_date=now + timedelta(days=2, hours=2),
            distance_km=280.0,
            truck_type="Eicher Pro 2049",
            truck_capacity="3.0 Tons",
            available_space="1.8 Tons (half container empty)",
            rate_per_km=22.0,
            flat_rate=5800.0,
            description="Covered container truck heading on NH48 directly to Jaipur VKI Industrial Area. Safe for fragile and high-value cargo.",
            status=RouteStatus.ACTIVE,
            contact_phone="9811223344",
        ),
        RouteListing(
            driver_id=driver.id,
            origin="Haridwar, Uttarakhand",
            destination="Chandigarh",
            origin_lat=29.9457,
            origin_lng=78.1642,
            dest_lat=30.7333,
            dest_lng=76.7794,
            departure_date=now + timedelta(days=3, hours=1),
            distance_km=205.0,
            truck_type="Tata 407",
            truck_capacity="2.5 Tons",
            available_space="800 kg spare capacity",
            rate_per_km=19.0,
            flat_rate=3900.0,
            description="Passing via Roorkee, Ambala to Chandigarh Industrial Area Phase 1. Quick drop-offs along highway accommodated.",
            status=RouteStatus.ACTIVE,
            contact_phone="9876543210",
        ),
        RouteListing(
            driver_id=driver.id,
            origin="Rishikesh, Uttarakhand",
            destination="New Delhi, Delhi",
            origin_lat=30.0869,
            origin_lng=78.2676,
            dest_lat=28.6139,
            dest_lng=77.2090,
            departure_date=now + timedelta(days=4, hours=3),
            distance_km=242.0,
            truck_type="Mahindra Bolero Maxi Truck",
            truck_capacity="1.5 Tons",
            available_space="750 kg free capacity",
            rate_per_km=16.0,
            flat_rate=3800.0,
            description="Direct run carrying Ayurvedic herbal goods. 750 kg capacity free in covered cargo bed.",
            status=RouteStatus.ACTIVE,
            contact_phone="9876543210",
        ),
        RouteListing(
            driver_id=driver2.id,
            origin="Mumbai, Maharashtra",
            destination="Pune, Maharashtra",
            origin_lat=19.0760,
            origin_lng=72.8777,
            dest_lat=18.5204,
            dest_lng=73.8567,
            departure_date=now + timedelta(days=2, hours=6),
            distance_km=152.0,
            truck_type="Eicher Pro 2049",
            truck_capacity="3.0 Tons",
            available_space="1.5 Tons",
            rate_per_km=24.0,
            flat_rate=3600.0,
            description="Expressway route from Navi Mumbai to Hadapsar Pune. Delivery on same day afternoon.",
            status=RouteStatus.ACTIVE,
            contact_phone="9811223344",
        ),
    ]

    for r in sample_routes:
        db.add(r)
    db.flush()

    # 6. Create Sample Bookings for judge demo
    # Confirmed booking on Dehradun -> Delhi
    booking1 = Booking(
        customer_id=customer.id,
        route_id=sample_routes[0].id,
        pickup_location="Patel Nagar, Dehradun",
        drop_location="Okhla Industrial Area Phase 3, New Delhi",
        goods_description="4 cartons of handmade handloom shawls & woolens (fragile, keep dry)",
        estimated_weight="~95 kg",
        status=BookingStatus.CONFIRMED,
    )
    db.add(booking1)

    # Pending booking on Delhi -> Jaipur
    booking2 = Booking(
        customer_id=customer.id,
        route_id=sample_routes[1].id,
        pickup_location="Karol Bagh Wholesale Market, New Delhi",
        drop_location="MI Road, Jaipur",
        goods_description="6 boxes of packaged organic spices and herbal tea canisters",
        estimated_weight="~140 kg",
        status=BookingStatus.PENDING,
    )
    db.add(booking2)

    db.commit()
    return {
        "message": "Demo data successfully seeded for Enroute showcase",
        "demo_driver": "driver@enroute.com / Driver123!",
        "demo_customer": "customer@enroute.com / Customer123!",
        "routes_seeded": len(sample_routes),
    }


@router.post("/", tags=["Demo Data"])
def seed_endpoint(db: Session = Depends(get_db)):
    return seed_database(db)
