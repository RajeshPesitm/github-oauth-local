from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .auth import router as auth_router
from app.config import settings
import os


app = FastAPI()

# Ensure tables are created when the app starts
@app.on_event("startup")
async def on_startup():
    async with engine.begin() as conn:
        # Creates the tables if they don't exist
        await conn.run_sync(Base.metadata.create_all)

FRONTEND_URL = settings.FRONTEND_URL
# Uncomment the following line if you want to set a fallback URL for local development
# FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")  # fallback for local dev

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)

@app.get("/ping")
def ping():
    return {"ping": "pong"}

@app.get("/db-check")
async def db_check():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    return {"message": "Database connected and tables ensured."}
