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

    # CORS origins read from the Railway env var (comma-separated).
    CORS_ORIGINS: str = os.getenv("CORS_ORIGINS", "")

    # These origins are ALWAYS allowed regardless of what CORS_ORIGINS contains.
    # This prevents a misconfigured Railway env var from locking out the frontend.
    _GUARANTEED_ORIGINS: list = [
        "http://localhost:5173",
        "http://localhost:4173",
        "https://enroute-logistics.vercel.app",
    ]

    @property
    def cors_origins_list(self) -> list[str]:
        # Parse env var origins (strip whitespace + trailing slashes)
        from_env = [
            o.strip().rstrip("/")
            for o in self.CORS_ORIGINS.split(",")
            if o.strip()
        ]
        # Merge with guaranteed origins — use dict.fromkeys to deduplicate
        # while preserving order (env-var origins listed first).
        merged = list(dict.fromkeys(from_env + self._GUARANTEED_ORIGINS))
        return merged


# Single shared instance - import this everywhere else
settings = Settings()
