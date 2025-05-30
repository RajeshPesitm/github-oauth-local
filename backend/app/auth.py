from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi.security import OAuth2PasswordBearer
from fastapi.responses import HTMLResponse
from .database import get_session
from .models import User
import os
import requests
import jwt
from jwt import PyJWTError
from app.config import settings
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="tokenUrl")

GITHUB_CLIENT_ID = settings.GITHUB_CLIENT_ID.strip()
GITHUB_CLIENT_SECRET = settings.GITHUB_CLIENT_SECRET.strip()
JWT_SECRET_KEY = settings.JWT_SECRET_KEY.strip()


@router.get("/auth/github/login")
def github_login():
    github_auth_url = f"https://github.com/login/oauth/authorize?client_id={GITHUB_CLIENT_ID}&scope=user"
    return {"url": github_auth_url}


@router.get("/auth/github/callback", response_class=HTMLResponse)
async def github_callback(code: str, session: AsyncSession = Depends(get_session)):
    try:
        token_res = requests.post(
            "https://github.com/login/oauth/access_token",
            headers={"Accept": "application/json"},
            data={
                "client_id": GITHUB_CLIENT_ID,
                "client_secret": GITHUB_CLIENT_SECRET,
                "code": code
            }
        )
        token_res.raise_for_status()
        token_json = token_res.json()
        access_token = token_json.get("access_token")

        if not access_token:
            logger.error(f"No access_token from GitHub. Response: {token_json}")
            raise HTTPException(status_code=400, detail="Failed to retrieve access token from GitHub")

        user_res = requests.get(
            "https://api.github.com/user",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        user_res.raise_for_status()
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

        return f"""
        <html>
            <body>
                <script>
                    console.log("Running postMessage");
                    console.log("window.opener:", window.opener);
                    window.opener?.postMessage({{ token: "{token}" }}, "{settings.FRONTEND_URL}");
                    window.close();
                </script>
                <p>Logging in... You may close this window.</p>
            </body>
        </html>
        """
    except Exception as e:
        logger.exception("GitHub OAuth callback failed")
        raise HTTPException(status_code=500, detail=str(e))


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
