from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.schema import User, Progress
from app.schemas.pydantic_models import RegisterRequest, LoginRequest, TokenResponse, UserResponse
from app.auth.security import get_password_hash, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/api/auth", tags=["Auth"])

@router.post("/register", response_model=TokenResponse)
def register_user(req: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == req.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email is already registered")

    user = User(
        name=req.name,
        email=req.email,
        password_hash=get_password_hash(req.password),
        native_language=req.native_language,
        learning_language=req.learning_language,
        level=req.level,
        points=0,
        streak=1
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Initialize default skill progress
    skills = ["Vocabulary", "Grammar", "Reading", "Writing", "Listening", "Speaking", "Pronunciation"]
    for s in skills:
        db.add(Progress(user_id=user.id, skill=s, progress_percentage=15.0))
    db.commit()

    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer", "user": user}

@router.post("/login", response_model=TokenResponse)
def login_user(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer", "user": user}

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
