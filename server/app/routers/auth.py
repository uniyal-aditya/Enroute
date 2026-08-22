from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.dependencies.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.user import UserRegister, UserLogin, UserProfileUpdate, UserOut, Token
from app.utils.security import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
@router.post("/register/", response_model=Token, status_code=status.HTTP_201_CREATED, include_in_schema=False)
def register(payload: UserRegister, db: Session = Depends(get_db)):
    clean_email = payload.email.lower().strip()
    existing = db.query(User).filter(User.email.ilike(clean_email)).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists",
        )

    user = User(
        name=payload.name.strip(),
        email=clean_email,
        password_hash=hash_password(payload.password),
        phone=payload.phone.strip(),
        role=payload.role,
        vehicle_number=payload.vehicle_number.strip() if payload.vehicle_number and payload.vehicle_number.strip() else None,
        truck_type=payload.truck_type.strip() if payload.truck_type and payload.truck_type.strip() else None,
        truck_capacity=payload.truck_capacity.strip() if payload.truck_capacity and payload.truck_capacity.strip() else None,
        company_name=payload.company_name.strip() if payload.company_name and payload.company_name.strip() else None,
        bio=payload.bio.strip() if payload.bio and payload.bio.strip() else None,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    access_token = create_access_token(data={"sub": str(user.id)})
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=UserOut.model_validate(user),
    )


@router.post("/login", response_model=Token)
@router.post("/login/", response_model=Token, include_in_schema=False)
async def login(
    request: Request,
    db: Session = Depends(get_db),
):
    email = None
    password = None

    # Handle both JSON body and form-urlencoded
    content_type = request.headers.get("content-type", "")
    if "application/json" in content_type:
        try:
            body = await request.json()
            email = body.get("email") or body.get("username")
            password = body.get("password")
        except Exception:
            pass
    else:
        try:
            form = await request.form()
            email = form.get("username") or form.get("email")
            password = form.get("password")
        except Exception:
            pass

    if not email or not password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email and password are required",
        )

    clean_email = str(email).lower().strip()
    user = db.query(User).filter(User.email.ilike(clean_email)).first()

    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(data={"sub": str(user.id)})
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=UserOut.model_validate(user),
    )


@router.get("/me", response_model=UserOut)
@router.get("/me/", response_model=UserOut, include_in_schema=False)
def read_current_user(current_user: User = Depends(get_current_user)):
    return current_user


@router.put("/profile", response_model=UserOut)
@router.put("/profile/", response_model=UserOut, include_in_schema=False)
def update_profile(
    payload: UserProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    for field, value in payload.model_dump(exclude_unset=True).items():
        if value is not None:
            if isinstance(value, str):
                setattr(current_user, field, value.strip() or None)
            else:
                setattr(current_user, field, value)

    db.commit()
    db.refresh(current_user)
    return current_user
