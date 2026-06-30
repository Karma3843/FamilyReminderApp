from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.db.models import User
from app.security import hash_password, verify_password, create_access_token
from app.security import get_current_user
from fastapi.security import OAuth2PasswordRequestForm
from app.mail import send_email

router = APIRouter()

def get_db():
    db=SessionLocal()

    try: 
        yield db
    finally:
        db.close()

@router.post("/users")
def create_user(name:str, email: str, password: str, db: Session = Depends(get_db)):
    hashed_pw = hash_password(password)
    user= User(name=name, email=email, password=hashed_pw)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user=db.query(User).filter(
        User.email == form_data.username
    ).first()

    if not user:
        return {
            "error":"Invalid email or password"
        }
    
    if not verify_password(
        form_data.password,
        user.password):
        return {
            "error": "Invalid email or password"
        }
    
    access_token = create_access_token(
        data={
            "user_id": user.id,
            "email": user.email
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.get("/me")
def get_me(
    current_user = Depends(get_current_user)
):
    return{
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email
    }

@router.get("/send-test-mail")
def send_test_mail():

    send_email(

        to_email="ahershantanu04@gmail.com",

        subject="SMTP Test",

        body="SMTP integration is working successfully"
    )

    return {
        "message": "Test mail sent successfully"
    }