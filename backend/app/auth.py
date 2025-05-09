from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi.security import OAuth2PasswordBearer
from fastapi.responses import RedirectResponse
from .database import get_session
from .models import User
import os
import requests
import jwt
from jwt import PyJWTError
from app.config import settings


router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="tokenUrl")
GITHUB_CLIENT_ID = settings.GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET = settings.GITHUB_CLIENT_SECRET
JWT_SECRET_KEY = settings.JWT_SECRET_KEY

# Uncomment the following lines if you want to load from environment variables
# GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
# GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")
# JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")

@router.get("/auth/github/login")
def github_login():
    return {"url": f"https://github.com/login/oauth/authorize?client_id={GITHUB_CLIENT_ID}&scope=user"}

@router.get("/auth/github/callback")
async def github_callback(code: str, session: AsyncSession = Depends(get_session)):
    token_res = requests.post(
        "https://github.com/login/oauth/access_token",
        headers={"Accept": "application/json"},
        data={
            "client_id": GITHUB_CLIENT_ID,
            "client_secret": GITHUB_CLIENT_SECRET,
            "code": code
        }
    )
    token_json = token_res.json()
    access_token = token_json.get("access_token")

    user_res = requests.get(
        "https://api.github.com/user",
        headers={"Authorization": f"Bearer {access_token}"}
    )
    user_data = user_res.json()

    query = await session.execute(select(User).where(User.github_id == user_data["id"]))
    user = query.scalars().first()

    if not user:
        user = User(
            github_id=user_data["id"],
            username=user_data["login"],
            avatar_url=user_data["avatar_url"]
        )
        session.add(user)
        await session.commit()

    payload = {"sub": str(user.id)}
    token = jwt.encode(payload, JWT_SECRET_KEY, algorithm="HS256")

    # Redirect the user to the frontend with the token in the URL
    frontend_url = settings.FRONTEND_URL
    # Uncomment the following line if you want to set a fallback URL for local development
    # frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
    redirect_url = f"{frontend_url}?access_token={token}"

    return RedirectResponse(url=redirect_url)

async def get_current_user(session: AsyncSession = Depends(get_session), token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(status_code=401, detail="Could not validate credentials")
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=["HS256"])
        user_id = int(payload.get("sub"))
    except PyJWTError:
        raise credentials_exception

    query = await session.execute(select(User).where(User.id == user_id))
    user = query.scalars().first()
    if user is None:
        raise credentials_exception
    return user

@router.get("/auth/me")
async def read_users_me(current_user: User = Depends(get_current_user)):
    return {
        "username": current_user.username,
        "avatar_url": current_user.avatar_url
    }

@router.delete("/auth/delete")
async def delete_account(session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    await session.delete(current_user)
    await session.commit()
    return {"message": "Account deleted"}

