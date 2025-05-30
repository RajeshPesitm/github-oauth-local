# About this Commit
### Title: Component-Based + SPA Routing (React Router) deployed on GITHUB codespace
##### Goal: Deploy the App in GITHUB Code Space

## Major Changes
#### Environment Setup for Githuib Codespace:
#### auth.py is Updated:
     *     ✅ Fix Strategy.
     *     1. Strip environment variables before using
     *     We'll ensure to .strip() any newline or whitespace when loading from settings.
     *     2. Add robust logging
     *     - Logs will be added before/after key operations like:
     *     - GitHub token exchange
     *     - User info fetch
     *     - DB insert/select
     *     - JWT generation
     *     - Redirect URL composition
#### .devcontainer/.devcontainer.json Added
#### docker-compose.yml updated to be compatible to read Repo codespace secrets
#### github Oauth App Home URL and Authorization callback URL Updated
#### docker-compose Updated with additional environment seetings for pgadmin4
#### sdgdsg
          window.opener.postMessage({ token: "..." }, window.origin);
          Replaced to
          window.opener.postMessage({{ token: "{token}" }}, "{settings.FRONTEND_URL}");
          and
          GitHub secret FRONTEND_URL is updated to github codespace relative URL
          FRONTEND_URL=http://localhost:5173
          Replaced to
          FRONTEND_URL=https://fantastic-capybara-jj9v694r4qrcqpr4-5173.app.github.dev

## Environment Setup for Githuib Codespace:
- Repo settings --> Secrets --> Codespace

## Github codespace Host setup in github Oauth App:
- In gihub Oauth App Settings i have used 
1. Homepage URL:  https://fantastic-capybara-jj9v694r4qrcqpr4-5173.app.github.dev/
2. Authorization callback URL:  https://fantastic-capybara-jj9v694r4qrcqpr4-8000.app.github.dev/auth/github/callback



## Testing Codespace development
- Is env reading properly to backend from Repo code secrete
```
docker compose exec backend env | grep GITHUB
```

- Does Enc values inside backend matching with Outer env values set in Repo secrets
```
docker compose exec backend python
import os
os.getenv("GITHUB_CLIENT_ID")
from app.config import settings
settings.GITHUB_CLIENT_ID

```
- environment variables
```
✅ Step 1: Check what the host shell sees
printenv | grep FRONTEND_URL
✅ Step 2: See what value Docker Compose is using
docker compose config
✅ Step 3: Check the value inside the container
docker exec -it github-oauth-local-backend-1 env | grep FRONTEND_URL
```


### end of Commit



---

# MyOAuthApp

A **full-stack application** that allows users to **log in with their GitHub account** using **OAuth 2.0**, and manages users with **FastAPI**, **PostgreSQL**, **JWT Authentication**, and a **React Frontend** — all deployed on **Render**.

---

## Features

- 🔒 Login with GitHub OAuth
- 🪪 JWT Token Authentication
- 📚 User data (GitHub ID, username, avatar) saved to PostgreSQL
- 🚪 Logout and Delete Account functionality
- 🌐 CORS enabled for Frontend-Backend communication
- 🚀 Deployed live using Render

---

## Tech Stack

**Frontend:**
- React (Vite setup)
- Axios for HTTP requests
- TailwindCSS
- Updates:
- React Router Replaces window.location.href
  
**Backend:**
- FastAPI
- SQLAlchemy (Async)
- PostgreSQL (asyncpg driver)
- PyJWT for JWT management
- Uvicorn for ASGI server

**Deployment:**
- Render (for both backend and frontend)

---

---

## ✅ What You Need

### 📦 Software Development Technique:

Use **Component-Based Architecture** along with **Client-Side Routing (CSR)** using **React Router v6**. This is a common and scalable approach in modern frontend development.

---

## 🛠️ Step-by-Step Refactor Plan

### 1. 📦 Install React Router

From your `frontend` folder, run:

```bash
npm install react-router-dom
```

---

### 2. 📁 Suggested Project Structure Update

You can refactor your project structure as:

```
src/
├── App.jsx               --> Define routes here
├── api.js
├── main.jsx
├── components/
│   └── Navbar.jsx        --> Top navigation bar
├── pages/
│   ├── Home.jsx          --> "Welcome" page
│   └── Portfolio.jsx     --> "Portfolio of Rajesh" page
```

---

### 3. 🧠 Create Shared Layout: `Navbar.jsx`



### 4. 🏠 Create Home Page: `Home.jsx`

---

### 5. 📂 Create Portfolio Page: `Portfolio.jsx`



---

### 6. 🧭 Set Up Routing in `App.jsx`



---

## ✅ Final Outcome

* You now have **clean separation of concerns**: UI split across `Navbar`, `Home`, and `Portfolio`.
* Only `App.jsx` knows about routing.
* Navigation logic is handled by React Router, not `window.location.href`.
* You can add more pages later (like `/about`, `/settings`, etc.) easily.

---

## 🚀 Summary: Why This Is a Best Practice

| Feature                | Technique Used            |
| ---------------------- | ------------------------- |
| Shared layout (Navbar) | Component Composition     |
| Dynamic page rendering | React Router (CSR)        |
| Code separation        | Component-based structure |
| Easy to scale          | Yes ✅                     |

---

### ✅ Software Architecture Technique Used:

#### Component-Based + SPA Routing (React Router):

    * Encapsulation: Each page is isolated in pages/.

    * Reusability: Navbar can be reused across pages.

    * Maintainability: Business logic is separated from layout.

    * Scalability: You can add /dashboard, /settings, etc. easily.



## Setup Instructions: Not required when you clone this as all depndendencies are recorder in vite.config and Backend uvicorn

### Backend Setup (FastAPI)

1. Install dependencies:
    ```bash
    pip install fastapi uvicorn sqlalchemy asyncpg python-jose[cryptography] python-multipart requests python-dotenv
    ```

2. Create a `.env` file (Render manages env variables separately but locally you can do this):

    ```
    GITHUB_CLIENT_ID=your_github_client_id
    GITHUB_CLIENT_SECRET=your_github_client_secret
    JWT_SECRET_KEY=your_jwt_secret_key
    DATABASE_URL=postgresql+asyncpg://user:password@host:port/database
    FRONTEND_URL=http://localhost:3000
    ```

3. Run backend server locally:
    ```bash
    uvicorn app.main:app --reload
    ```

4. Make sure `/db-check` endpoint is called once to create necessary tables.

---

### Frontend Setup (React)

1. Install dependencies:
    ```bash
    npm install
    ```

2. Create a `.env` file:

    ```
    VITE_REACT_APP_BACKEND_URL=https://your-backend-service.onrender.com
    ```

3. Run the app locally:
    ```bash
    npm run dev
    ```

---

## Core Backend Endpoints

| Method | Endpoint                  | Description                     |
|--------|----------------------------|---------------------------------|
| GET    | `/auth/github/login`        | Returns GitHub OAuth URL        |
| GET    | `/auth/github/callback`     | Handles GitHub OAuth callback, registers/logins user, returns JWT |
| GET    | `/auth/me`                  | Returns logged-in user details |
| DELETE | `/auth/delete`              | Deletes user account           |
| GET    | `/ping`                     | Health check                   |
| GET    | `/db-check`                 | Creates DB tables if missing   |

---

## How the GitHub OAuth Flow Works

1. **User clicks** "Login with GitHub" button on frontend.
2. **Redirected** to GitHub authorization page.
3. **After approval**, GitHub redirects back to `/auth/github/callback?code=...`.
4. **Backend**:
    - Exchanges code for GitHub access token
    - Fetches user info
    - Checks if user exists in PostgreSQL
    - Creates user if not
    - Generates a JWT
5. **Frontend**:
    - Stores JWT
    - Displays user info (username, avatar)
    - Allows logout / account deletion

---

## Deployment on locally

- Backend: Deployed as a **FastAPI** web service with PostgreSQL database add-on.
- Frontend: Deployed as a **Static Site**.
- Both are connected via environment variables.

---


## Deployment locally
- Clean Slate:
```
docker compose down -v
docker volume prune -f
docker system prune -a --volumes
```

- Biuld/Start:
```
docker compose build --no-cache
docker compose up -d
```
---

- See Server logs:
```
docker compose logs -f frontend
```
---


## URLs
- Frontend: 
```
http://localhost:5173/
```

- pgadmin: 
```
http://localhost:5050/
```

## Local Host setup in github Oauth App:
- In gihub Oauth App Settings i have used 
1. Homepage URL:  http://localhost:5173/
2. Authorization callback URL:  http://localhost:8000/auth/github/callback







## Future Improvements (Optional Ideas)

- Refresh tokens for longer sessions
- Better error handling (e.g., GitHub errors, token expiry)
- Rate limiting for security
- Support login with other OAuth providers (Google, Twitter)
- ✅ Frontend: Use npm ci in CI/CD for exact, lockfile-based installs (optional but great)

---

## License

This project is licensed under the **Apache 2.0 License**.  
Feel free to use, modify, and distribute!

---

## Author

- Built with ❤️ by Rajesh PESITM

---

### Badge of Honor 🏅

> Took 5 days of pure dedication, step-by-step learning, and determination to build and deploy this full-stack project.  
> Proof that perseverance beats everything. 🚀

---

# 🎉 Congrats again!!

---

🎯


