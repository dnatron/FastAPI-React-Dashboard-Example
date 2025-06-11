"""
Hlavní soubor FastAPI aplikace.
"""
import os
from datetime import timedelta
from typing import List

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select

from .models import User, UserCreate, UserRead, Token
from .database import create_db_and_tables, get_session
from .auth import (
    get_password_hash,
    authenticate_user,
    create_access_token,
    get_current_active_user,
    ACCESS_TOKEN_EXPIRE_MINUTES,
)

# Vytvoření FastAPI aplikace
app = FastAPI(title="Dashboard API")

# Nastavení CORS
origins = [
    "http://localhost",
    "http://localhost:3000",  # React vývojový server
    "http://frontend:3000",   # Kontejner frontendu
    os.getenv("FRONTEND_URL", "http://localhost:3000"),  # Proměnná prostředí
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    """
    Akce při startu aplikace - inicializace databáze.
    """
    create_db_and_tables()


@app.post("/register", response_model=UserRead)
def register_user(user: UserCreate, session: Session = Depends(get_session)):
    """
    Registrace nového uživatele.
    """
    # Kontrola, zda uživatel již existuje
    db_user_email = session.exec(select(User).where(User.email == user.email)).first()
    if db_user_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email již existuje v systému",
        )
    
    db_user_username = session.exec(select(User).where(User.username == user.username)).first()
    if db_user_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uživatelské jméno již existuje v systému",
        )
    
    # Vytvoření nového uživatele
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        username=user.username,
        hashed_password=hashed_password
    )
    
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    
    return db_user


@app.post("/token", response_model=Token)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: Session = Depends(get_session)
):
    """
    Přihlášení uživatele a získání JWT tokenu.
    """
    user = authenticate_user(session, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Nesprávné uživatelské jméno nebo heslo",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/users/me", response_model=UserRead)
def read_users_me(current_user: User = Depends(get_current_active_user)):
    """
    Získání informací o přihlášeném uživateli.
    """
    return current_user


@app.get("/dashboard")
def get_dashboard_data(current_user: User = Depends(get_current_active_user)):
    """
    Chráněný endpoint pro dashboard.
    """
    return {
        "message": f"Vítej na dashboardu, {current_user.username}!",
        "user_info": {
            "id": current_user.id,
            "username": current_user.username,
            "email": current_user.email,
            "created_at": current_user.created_at.isoformat()
        }
    }
