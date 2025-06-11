"""
Autentizační a bezpečnostní funkce.
"""
from datetime import datetime, timedelta
from typing import Optional
import os

from jose import jwt, JWTError
from passlib.context import CryptContext
from sqlmodel import Session, select
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from .models import User, TokenData
from .database import get_session

# Nastavení algoritmu pro hashování hesel
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 schéma pro token autentizace
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Proměnné pro JWT token
SECRET_KEY = os.getenv("SECRET_KEY", "tajny_klic_pro_vyvoj_nutno_zmenit_v_produkci")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Ověření hesla.
    """
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """
    Vytvoření hash hesla.
    """
    return pwd_context.hash(password)


def authenticate_user(session: Session, username: str, password: str) -> Optional[User]:
    """
    Autentizace uživatele.
    """
    statement = select(User).where(User.username == username)
    user = session.exec(statement).first()
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Vytvoření JWT přístupového tokenu.
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(
    token: str = Depends(oauth2_scheme), 
    session: Session = Depends(get_session)
) -> User:
    """
    Získání aktuálního přihlášeného uživatele.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Neplatné přihlašovací údaje",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    
    statement = select(User).where(User.username == token_data.username)
    user = session.exec(statement).first()
    if user is None:
        raise credentials_exception
    return user


async def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    """
    Ověření, že uživatel je aktivní.
    """
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Neaktivní uživatel")
    return current_user
