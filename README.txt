# Local development (if needed)

docker-compose up --build

# Frontend - http://localhost:5173
# Backend - http://localhost:8000
# Database - localhost:5432 (Postgres)

# Before pushing to Render:
# 1. Initialize git
# 2. Push this project
# 3. Setup Render Web Service (Backend), Static Site (Frontend), PostgreSQL Service (DB)
# 4. Add Environment Variables from .env.template

# App flow:
# - Login with GitHub (if new, auto register)
# - View welcome page
# - Logout or Delete Account

