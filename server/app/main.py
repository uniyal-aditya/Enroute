from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, engine
from app import models  # noqa: F401 - ensures models are registered on Base before create_all
from app.routers import auth, listings, bookings

# Creates tables if they don't exist yet. Fine for hackathon/dev speed;
# swap to `alembic upgrade head` once you want real migrations tracked.
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Enroute API",
    description="Connects truck drivers with spare cargo capacity to people who need affordable courier/transport services.",
    version="1.0.0",
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


@app.get("/", tags=["Health"])
def health_check():
    return {"status": "ok", "service": "Enroute API"}
