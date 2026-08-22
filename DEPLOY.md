# Deploying Enroute — Vercel (frontend) + Railway (backend)

## Architecture

```
Browser → Vercel (React SPA)  ──HTTPS /api──►  Railway (FastAPI + uvicorn)  ──►  Railway PostgreSQL
```

The frontend talks to the backend via `VITE_API_BASE` at build time.
Tables are auto-created on first backend start (`create_all`) — no migration step needed.

---

## 1. Backend on Railway

1. Push this repo to GitHub (Railway deploys from Git).
2. On [railway.app](https://railway.app): **New Project → Deploy from GitHub repo**.
3. In the service settings set **Root Directory = `server`** (the Procfile lives there).
4. Add a database: **New → Database → PostgreSQL** in the same project.
5. In the backend service → **Variables**, add:

   | Variable | Value |
   |---|---|
   | `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` (reference the Postgres service) |
   | `SECRET_KEY` | long random string, e.g. output of `python -c "import secrets; print(secrets.token_hex(32))"` |
   | `ALGORITHM` | `HS256` |
   | `ACCESS_TOKEN_EXPIRE_MINUTES` | `1440` |
   | `CORS_ORIGINS` | your Vercel URL(s), comma separated — add after step 2 of frontend deploy |

6. Deploy. Railway injects `$PORT`; the Procfile runs
   `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
7. Settings → Networking → **Generate Domain**. Verify `https://<domain>/` returns
   `{"status": "ok", ...}` and `https://<domain>/docs` loads.

Notes:
- `postgres://…` URLs from providers are normalized to `postgresql://…` automatically (`app/database.py`).
- SQLite still works locally for dev — no code change needed between environments.

## 2. Frontend on Vercel

1. On [vercel.com](https://vercel.com): **Add New → Project → import the same GitHub repo**.
2. Configure:
   - **Framework Preset:** Vite (auto-detected)
   - **Root Directory:** `client`
   - Build command `npm run build`, output `dist` (defaults)
3. Environment Variables (Production + Preview):

   | Variable | Value |
   |---|---|
   | `VITE_API_BASE` | your Railway domain, e.g. `https://enroute-api-production.up.railway.app` — **no trailing slash, no `/api` suffix** (the app appends `/api`) |

4. Deploy → you get `https://<project>.vercel.app`.
5. Go back to Railway and make sure that URL is listed in the backend's `CORS_ORIGINS`
   (comma separated). Redeploy the backend if you changed it.

## 3. Local development stays unchanged

```bash
# terminal 1
cd server && .venv\Scripts\activate && uvicorn app.main:app --port 8000

# terminal 2
cd client && npm run dev          # vite proxies /api → 127.0.0.1:8000
```

## Pre-flight checklist

- [ ] Backend `/docs` reachable and health endpoint returns ok
- [ ] Register + login from the deployed site works (check browser console for CORS errors)
- [ ] Create listing as DRIVER, book it as CUSTOMER
- [ ] `CORS_ORIGINS` contains the exact Vercel origin incl. `https://` (and preview URLs if used)
