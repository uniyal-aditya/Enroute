"""
SQLAlchemy engine + session factory + declarative Base.
Works against SQLite locally (zero setup) and Supabase Postgres in production -
same code, just a different DATABASE_URL in .env.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from app.config import settings

_raw_url = settings.DATABASE_URL

# Some providers (Railway, Supabase, Heroku) hand out postgres:// URLs;
# SQLAlchemy 2.x only accepts the postgresql:// scheme.
if _raw_url.startswith("postgres://"):
    _raw_url = _raw_url.replace("postgres://", "postgresql://", 1)

# SQLite needs this connect_arg when used with FastAPI's threaded requests;
# Postgres doesn't need it and ignores extra kwargs it doesn't recognize.
connect_args = {"check_same_thread": False} if _raw_url.startswith("sqlite") else {}

engine = create_engine(_raw_url, connect_args=connect_args, pool_pre_ping=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
