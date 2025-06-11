"""
Databázové modely pro aplikaci.
"""
from datetime import datetime
from typing import Optional

from sqlmodel import Field, SQLModel


class UserBase(SQLModel):
    """
    Základní model pro uživatele.
    """
    email: str
    username: str


class User(UserBase, table=True):
    """
    Model pro uživatele v databázi.
    """
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)


class UserCreate(UserBase):
    """
    Model pro vytvoření uživatele.
    """
    password: str


class UserRead(UserBase):
    """
    Model pro čtení uživatele.
    """
    id: int
    is_active: bool
    created_at: datetime


class Token(SQLModel):
    """
    Model pro autentizační token.
    """
    access_token: str
    token_type: str


class TokenData(SQLModel):
    """
    Model pro data tokenu.
    """
    username: Optional[str] = None
