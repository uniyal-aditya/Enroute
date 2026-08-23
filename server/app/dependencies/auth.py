"""
Authentication dependencies for FastAPI route handlers.

DEMO_MODE behaviour (settings.DEMO_MODE = True):
    - All protected endpoints accept requests WITHOUT a JWT token.
    - The caller signals their role via the  X-Demo-Role  request header:
        X-Demo-Role: DRIVER    → resolves to the seeded driver@enroute.com account
        X-Demo-Role: CUSTOMER  → resolves to the seeded customer@enroute.com account
    - If the header is absent, defaults to CUSTOMER.
    - A valid JWT still takes precedence over the demo fallback, so real login
      continues to work even in DEMO_MODE.

PRODUCTION mode (settings.DEMO_MODE = False):
    - Normal JWT authentication is enforced everywhere.
    - X-Demo-Role header is ignored.
"""
from fastapi import Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.config import settings
from app.dependencies.database import get_db
from app.models.user import User, UserRole
from app.utils.security import decode_access_token

# tokenUrl just points Swagger's "Authorize" button at the login endpoint
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")
oauth2_scheme_optional = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)


def _resolve_user(token: str | None, db: Session) -> User | None:
    if token is None:
        return None
    payload = decode_access_token(token)
    if payload is None:
        return None
    user_id = payload.get("sub")
    if user_id is None:
        return None
    return db.query(User).filter(User.id == int(user_id)).first()


def _demo_user(request: Request, db: Session) -> User | None:
    """
    Resolve the demo user from the X-Demo-Role header.
    Returns None if the demo user account doesn't exist in the database yet.
    """
    role_header = request.headers.get("X-Demo-Role", "CUSTOMER").upper()
    email = (
        settings.DEMO_DRIVER_EMAIL
        if role_header == "DRIVER"
        else settings.DEMO_CUSTOMER_EMAIL
    )
    return db.query(User).filter(User.email == email).first()


# ---------------------------------------------------------------------------
# Public dependency: resolve user from JWT (optional) or demo header
# ---------------------------------------------------------------------------
def get_current_user_optional(
    request: Request,
    token: str | None = Depends(oauth2_scheme_optional),
    db: Session = Depends(get_db),
) -> User | None:
    # JWT always takes precedence
    user = _resolve_user(token, db)
    if user:
        return user
    # Fall back to demo user if DEMO_MODE is on
    if settings.DEMO_MODE:
        return _demo_user(request, db)
    return None


# ---------------------------------------------------------------------------
# Required dependency: must resolve to a user
# ---------------------------------------------------------------------------
def get_current_user(
    request: Request,
    token: str | None = Depends(oauth2_scheme_optional),
    db: Session = Depends(get_db),
) -> User:
    user = _resolve_user(token, db)
    if user:
        return user
    if settings.DEMO_MODE:
        user = _demo_user(request, db)
        if user:
            return user
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )


# ---------------------------------------------------------------------------
# Role-scoped dependencies
# ---------------------------------------------------------------------------
def require_driver(
    request: Request,
    token: str | None = Depends(oauth2_scheme_optional),
    db: Session = Depends(get_db),
) -> User:
    user = _resolve_user(token, db)
    if user:
        if user.role != UserRole.DRIVER:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only drivers can perform this action",
            )
        return user

    if settings.DEMO_MODE:
        demo = _demo_user(request, db)
        if demo:
            # In demo mode, honour the X-Demo-Role header even if the seeded
            # account's DB role doesn't match (graceful fallback)
            if demo.role == UserRole.DRIVER:
                return demo
            # Header said DRIVER but resolved to customer — try driver email directly
            driver = db.query(User).filter(
                User.email == settings.DEMO_DRIVER_EMAIL
            ).first()
            if driver:
                return driver

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )


def require_customer(
    request: Request,
    token: str | None = Depends(oauth2_scheme_optional),
    db: Session = Depends(get_db),
) -> User:
    user = _resolve_user(token, db)
    if user:
        if user.role != UserRole.CUSTOMER:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only customers can perform this action",
            )
        return user

    if settings.DEMO_MODE:
        demo = _demo_user(request, db)
        if demo:
            if demo.role == UserRole.CUSTOMER:
                return demo
            # Header said CUSTOMER — use customer email directly
            customer = db.query(User).filter(
                User.email == settings.DEMO_CUSTOMER_EMAIL
            ).first()
            if customer:
                return customer

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
