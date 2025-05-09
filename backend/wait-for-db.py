# backend/wait-for-db.py

import time
import sqlalchemy
from sqlalchemy.ext.asyncio import create_async_engine
import os
from app.config import settings


DATABASE_URL = settings.DATABASE_URL

if not DATABASE_URL:
    print("❌ DATABASE_URL is not set!")
    exit(1)

print(f"⏳ Waiting for the database at {DATABASE_URL}...")

# Replace with sync engine for quick connect check
sync_url = DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://")
engine = sqlalchemy.create_engine(sync_url)

while True:
    try:
        with engine.connect() as conn:
            print("✅ Database is ready!")
            break
    except Exception as e:
        print(f"❌ Still waiting for DB... {e}")
        time.sleep(2)
