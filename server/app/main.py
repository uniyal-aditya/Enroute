from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, engine
from app import models  # noqa: F401 - ensures models are registered on Base before create_all
from app.routers import auth, listings, bookings, seed

# Creates tables if they don't exist yet
Base.metadata.create_all(bind=engine)

# Auto-seed demo data on startup if fresh database
from app.database import SessionLocal
from app.routers.seed import seed_database
try:
    with SessionLocal() as db_session:
        seed_database(db_session)
except Exception as e:
    print(f"[Enroute DB Startup Notice] {e}")

app = FastAPI(
    title="Enroute Logistics API",
    description="Smart India Hackathon 2026 platform connecting truck drivers with spare cargo capacity to businesses and shippers.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(listings.router)
app.include_router(bookings.router)
app.include_router(seed.router)


@app.get("/", tags=["Health"])
def health_check():
    return {
        "status": "ok",
        "service": "Enroute Logistics API",
        "version": "1.0.0",
        "hackathon": "Smart India Hackathon 2026",
        "theme": "Transportation & Logistics",
        "team": "AAPHAT",
    }
