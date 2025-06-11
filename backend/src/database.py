"""
Konfigurace a správa databáze.
"""
import os
from sqlmodel import SQLModel, Session, create_engine

# Získání databázového URL z proměnné prostředí nebo použití výchozí hodnoty pro SQLite
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./database.db")

# Vytvoření engine pro SQLModel
engine = create_engine(DATABASE_URL, echo=True, connect_args={"check_same_thread": False})


def create_db_and_tables():
    """
    Vytvoření databáze a tabulek.
    """
    SQLModel.metadata.create_all(engine)


def get_session():
    """
    Vytvoření a poskytnutí databázové session.
    """
    with Session(engine) as session:
        yield session
