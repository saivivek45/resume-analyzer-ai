# Deployment Guide - CareerPilot AI

This guide covers deploying CareerPilot AI to **Vercel** (frontend) and **Render** (backend + database).

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Database Setup (Render PostgreSQL)](#database-setup-render-postgresql)
3. [Backend Deployment (Render)](#backend-deployment-render)
4. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
5. [Environment Configuration](#environment-configuration)
6. [Google OAuth Setup](#google-oauth-setup)
7. [Local Development](#local-development)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- A Vercel account (https://vercel.com)
- A Render account (https://render.com)
- GitHub repository connected to both Vercel and Render
- Google OAuth credentials (for authentication)
- Gemini API key (for resume analysis)
- SMTP credentials (for email notifications)

---

## Database Setup (Render PostgreSQL)

### Step 1: Create PostgreSQL Database on Render

1. Log in to [Render Dashboard](https://dashboard.render.com)
2. Click **New +** and select **PostgreSQL**
3. Configure:
   - **Name**: `careerpilot-db`
   - **Database**: `careerpilot`
   - **User**: `postgres`
   - **Region**: Choose closest to your users
   - **Plan**: Select appropriate tier (start with free/development)
4. Click **Create Database**
5. Wait for the database to initialize (usually 2-3 minutes)

### Step 2: Get Database Connection URL

1. After creation, copy the **External Database URL**
2. Format: `postgresql://user:password@host:port/dbname`
3. Save this as `DATABASE_URL` for backend configuration

---

## Backend Deployment (Render)

### Step 1: Prepare Repository

The backend code in `Backend/` directory is ready for Render deployment:
- Uses environment variables for all configuration
- No hardcoded credentials
- Includes health check endpoints for Render to monitor

### Step 2: Deploy to Render

1. Log in to [Render Dashboard](https://dashboard.render.com)
2. Click **New +** and select **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `careerpilot-backend`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Region**: Same as database (or closest)
   - **Plan**: Select appropriate tier

### Step 3: Environment Variables

In Render dashboard, go to **Environment** and add these variables:

```
DATABASE_URL=postgresql://user:pass@host:port/dbname
SECRET_KEY=<generate a strong random key>
JWT_EXPIRE_DAYS=7
GOOGLE_CLIENT_ID=<your-google-client-id>
GEMINI_API_KEY=<your-gemini-api-key>
SMTP_USERNAME=<your-email@gmail.com>
SMTP_PASSWORD=<your-app-specific-password>
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_FROM_EMAIL=<your-email@gmail.com>
SMTP_USE_TLS=true
FRONTEND_URL=https://<your-vercel-domain>
DEBUG=false
COOKIE_SECURE=true
```

### Step 4: Health Checks

Render will automatically detect health check endpoints:
- Endpoint: `/health`
- Render will use this to monitor your service

### Step 5: Deploy

1. Click **Create Web Service**
2. Render will automatically deploy when you push to `main` branch
3. Monitor deployment in the **Logs** tab

---

## Frontend Deployment (Vercel)

### Step 1: Prepare Repository

The frontend code in `frontend/` directory is ready for Vercel deployment:
- Uses Next.js 16.2.7
- Build command: `npm run build`
- No environment variables needed at build time (uses runtime configuration)

### Step 2: Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com)
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend/`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm ci` (auto-detected)

### Step 3: Environment Variables

In Vercel project settings, go to **Environment Variables** and add:

```
NEXT_PUBLIC_API_URL=https://<your-render-backend-domain>
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<your-google-client-id>
NEXT_PUBLIC_APP_URL=https://<your-vercel-domain>
```

**Important**: All variables must start with `NEXT_PUBLIC_` to be accessible in the browser.

### Step 4: Deploy

1. Click **Deploy**
2. Vercel will automatically build and deploy
3. Monitor deployment in the **Deployments** tab

---

## Environment Configuration

### Required Environment Variables

**Backend (Render)**:
- `DATABASE_URL`: PostgreSQL connection string from Render
- `SECRET_KEY`: Generate with: `python -c "import secrets; print(secrets.token_urlsafe(32))"`
- `GOOGLE_CLIENT_ID`: From Google Cloud Console
- `GEMINI_API_KEY`: From Google AI Studio
- `SMTP_USERNAME`: Your email address
- `SMTP_PASSWORD`: Gmail app-specific password
- `SMTP_HOST`: smtp.gmail.com
- `SMTP_PORT`: 587
- `SMTP_FROM_EMAIL`: Your email address
- `FRONTEND_URL`: Your Vercel domain (https://...)
- `JWT_EXPIRE_DAYS`: 7 (or your preference)
- `COOKIE_SECURE`: true (production)
- `DEBUG`: false (production)

**Frontend (Vercel)**:
- `NEXT_PUBLIC_API_URL`: Your Render backend URL (https://...)
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`: Same as backend
- `NEXT_PUBLIC_APP_URL`: Your Vercel domain (https://...)

---

## Google OAuth Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable **Google+ API** and **Credentials API**

### Step 2: Create OAuth Credentials

1. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client IDs**
2. Application type: **Web application**
3. Add authorized JavaScript origins:
   - `https://<your-vercel-domain>`
   - `http://localhost:3000` (for local dev)
4. Add authorized redirect URIs:
   - `https://<your-vercel-domain>/auth/google/callback`
   - `http://localhost:3000/auth/google/callback` (for local dev)
5. Copy the **Client ID** and save as:
   - Backend: `GOOGLE_CLIENT_ID` on Render
   - Frontend: `NEXT_PUBLIC_GOOGLE_CLIENT_ID` on Vercel

### Step 3: Verify OAuth Configuration

1. Users should be able to click "Sign in with Google"
2. Redirect should return to your app
3. Check backend logs if authentication fails

---

## Local Development

### Using Docker Compose (Optional)

For local development with PostgreSQL:

```bash
# Start database and backend
docker-compose up -d

# In another terminal, start frontend
cd frontend
npm run dev
```

Access: http://localhost:3000

### Without Docker

1. **Start PostgreSQL** (manually or with your preferred method)
2. **Backend**:
   ```bash
   cd Backend
   python -m venv venv
   source venv/bin/activate  # or `venv\Scripts\activate` on Windows
   pip install -r requirements.txt
   uvicorn app.main:app --reload
   ```
   Access: http://localhost:8000

3. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Access: http://localhost:3000

### Local Environment File

Create `.env` in root directory:

```
# Database (local)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/careerpilot

# Secrets
SECRET_KEY=dev-secret-key-change-in-production

# Google OAuth (from Google Cloud Console)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com

# Gemini API
GEMINI_API_KEY=your-gemini-key

# SMTP (optional for local dev)
SMTP_USERNAME=
SMTP_PASSWORD=
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_FROM_EMAIL=

# URLs
FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Troubleshooting

### Backend Issues

**Problem**: "Database connection refused"
- **Solution**: Verify `DATABASE_URL` is correct and database is running
- Check Render PostgreSQL status in dashboard

**Problem**: "NEXT_PUBLIC_API_URL not accessible"
- **Solution**: Verify Render backend is deployed and running
- Check backend logs: `Render Dashboard → Logs → View Logs`
- Verify CORS is configured: `settings.frontend_url` matches `FRONTEND_URL` env var

**Problem**: "Google OAuth fails"
- **Solution**: 
  - Verify `GOOGLE_CLIENT_ID` is set correctly
  - Check OAuth redirect URI in Google Cloud Console matches your Vercel domain
  - Check backend logs for error details

**Problem**: "Gemini API key error"
- **Solution**:
  - Verify `GEMINI_API_KEY` is set in Render environment
  - Check key is valid in Google AI Studio
  - Check backend logs: `Render Dashboard → Logs → View Logs`

### Frontend Issues

**Problem**: "NEXT_PUBLIC_API_URL is undefined"
- **Solution**: Set `NEXT_PUBLIC_API_URL` in Vercel environment variables
- Redeploy after setting variable

**Problem**: "Build fails"
- **Solution**: 
  - Check `npm run build` works locally
  - Verify Node.js version (18+ required)
  - Check Vercel deployment logs

**Problem**: "Google login button not working"
- **Solution**:
  - Verify `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is set
  - Check Google OAuth configuration (origins and redirect URIs)
  - Check browser console for errors

### General Issues

**Problem**: "503 Service Unavailable"
- **Solution**: Service is still spinning up or crashed
- Check Render logs for errors
- Verify all required environment variables are set

**Problem**: "CORS errors in browser"
- **Solution**: 
  - Backend CORS is set to `FRONTEND_URL`
  - Verify `FRONTEND_URL` on Render matches your Vercel domain
  - Redeploy backend after changing `FRONTEND_URL`

---

## Monitoring & Logs

### Render Backend Logs
1. [Render Dashboard](https://dashboard.render.com)
2. Select your backend service
3. Click **Logs** tab
4. View real-time logs or search history

### Vercel Frontend Logs
1. [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Click **Deployments** → select deployment
4. View build logs and server logs

### Health Check Status
- Backend: Navigate to `https://<your-backend-url>/health`
- Should return: `{"status": "healthy"}`

---

## Performance Tips

1. **Database**: Add indexes as needed after monitoring query performance
2. **Backend**: Monitor CPU and memory usage in Render dashboard
3. **Frontend**: Check Vercel analytics for performance metrics
4. **CORS**: Only allow your specific frontend domain in backend

---

## Scaling

### Backend Scaling
- Render: Upgrade plan or enable auto-scaling if available
- Monitor "Restart count" in Render dashboard

### Database Scaling
- Render PostgreSQL: Upgrade plan for more compute/storage
- Consider connection pooling if hitting connection limits

### Frontend Scaling
- Vercel: Automatically scales, no action needed
- Monitor bandwidth usage in Vercel analytics

---

## Security Checklist

- [ ] All environment variables are set on Vercel and Render (not in code)
- [ ] `COOKIE_SECURE=true` on Render
- [ ] `DEBUG=false` on Render
- [ ] Google OAuth origins configured correctly
- [ ] CORS whitelist is strict (only your domain)
- [ ] Database backups enabled on Render
- [ ] SMTP credentials secured (use app-specific passwords for Gmail)
- [ ] No secrets in git history (use `.env.example` for templates)

---

## Additional Resources

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [Next.js Documentation](https://nextjs.org/docs)
- [PostgreSQL on Render](https://render.com/docs/databases)

---

**Last Updated**: 2024
**Deployment Architecture**: Vercel (Frontend) + Render (Backend + PostgreSQL)
