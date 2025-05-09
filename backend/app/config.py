# backend/app/config.py

import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

# Load from .env file and environment
load_dotenv()

class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv("DATABASE_URL", "")
    GITHUB_CLIENT_ID: str = os.getenv("GITHUB_CLIENT_ID", "")
    GITHUB_CLIENT_SECRET: str = os.getenv("GITHUB_CLIENT_SECRET", "")
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "")
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "")

settings = Settings()
