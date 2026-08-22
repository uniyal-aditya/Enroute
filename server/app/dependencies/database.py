from app.database import SessionLocal


def get_db():
    """Yields a DB session per-request and always closes it, even on error."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
