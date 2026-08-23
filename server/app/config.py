"""
Loads secrets/config from the .env file using python-dotenv, exactly as
specified in the implementation plan (Environment layer: python-dotenv).
Validation of request/response data elsewhere in the app uses plain
Pydantic (bundled with FastAPI - no extra package needed for that).
"""

import os

from dotenv import load_dotenv

load_dotenv()  # reads .env into process environment (no-op if it's missing)


class Settings:
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./enroute.db")

    # Auth / JWT
    SECRET_KEY: str = os.getenv("SECRET_KEY", "insecure-dev-key-change-me")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))

    # CORS - comma separated origins in .env, split into a list below
    CORS_ORIGINS: str = os.getenv("CORS_ORIGINS", "http://localhost:5173")

    @property
    def cors_origins_list(self) -> list[str]:
        # Strip surrounding whitespace and trailing slashes so operators can safely
        # copy-paste URLs from browsers (which often include trailing slashes).
        return [
            origin.strip().rstrip("/")
            for origin in self.CORS_ORIGINS.split(",")
            if origin.strip()
        ]


# Single shared instance - import this everywhere else
settings = Settings()
