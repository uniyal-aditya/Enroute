import os
import sys

# Ensure server root is in python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal, Base, engine
from app.routers.seed import seed_database
from app import models  # noqa: F401

if __name__ == "__main__":
    print("Creating database tables if not present...")
    Base.metadata.create_all(bind=engine)

    print("Seeding demo data for Enroute (Smart India Hackathon 2026)...")
    db = SessionLocal()
    try:
        result = seed_database(db)
        print("Success:", result)
    finally:
        db.close()
