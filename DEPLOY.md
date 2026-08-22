# Deploying Enroute — Vercel (frontend) + Railway (backend) + Supabase (database)

## Architecture — who does what

```
┌──────────────┐         ┌──────────────────┐          ┌──────────────────┐
│   VERCEL     │  HTTPS  │     RAILWAY       │   SQL    │    SUPABASE      │
│ React build  │ ──────► │ uvicorn (FastAPI) │ ───────► │ PostgreSQL cloud │
│ served on    │ /api/*  │ business logic,   │ over one │ users, listings, │
│ global CDN   │         │ JWT auth          │ URL      │ bookings tables  │
└──────────────┘         └──────────────────┘          └──────────────────┘
```

1. **Vercel** builds the React app once (`npm run build`) and serves the static files from its CDN. The backend URL is baked into the bundle at build time via `VITE_API_BASE`.
2. The visitor's browser then calls the **Railway** API directly (`VITE_API_BASE/api/...`). Railway runs a real, always-on `uvicorn` process — that's why WebSockets/persistent work would live here, not Vercel.
3. Every piece of data lives in **Supabase Postgres**. Railway reaches it using only a connection string (`DATABASE_URL`). On first boot the backend runs `create_all`, so tables appear automatically.
4. **CORS_ORIGINS** on Railway is the security bridge: it lists exactly which frontend origin (your Vercel URL) may call the API.

A booking in motion: browser loads page from Vercel → axios sends `POST /api/bookings` with JWT to Railway → FastAPI validates the token with `SECRET_KEY` → inserts a row into Supabase → returns JSON to the browser.

---

## 1. Supabase (database)

1. Sign up at [supabase.com](https://supabase.com) → **New project**.
2. Pick a name + region, and set a **database password** — save it, you'll paste it into the URI.
3. When ready: **Connect** (top bar) → choose **Session pooler** (works everywhere, IPv4-safe).
   Copy the URI, which looks like:
   ```
   postgresql://postgres.<project-ref>:<YOUR-PASSWORD>@aws-0-<region>.pooler.supabase.com:5432/postgres
   ```
4. Append SSL: add `?sslmode=require` at the end.
5. That full string is your `DATABASE_URL`. No SQL to run by hand — the backend creates
   all tables (`users`, `route_listings`, `bookings`) on first start.

> Tip: "Transaction pooler" (port 6543) also works with psycopg2, but Session pooler
> (5432) is the safest default for SQLAlchemy. The app already normalizes
> `postgres://` → `postgresql://` and enables `pool_pre_ping` for pooled connections.

## 2. Railway (backend)

1. Push this repo to GitHub.
2. [railway.app](https://railway.app) → **New Project → Deploy from GitHub repo**.
3. Service → Settings → **Root Directory = `server`** (the Procfile lives there:
   `uvicorn app.main:app --host 0.0.0.0 --port $PORT`).
4. Variables:

   | Variable | Value |
   |---|---|
   | `DATABASE_URL` | your Supabase session-pooler URI incl. `?sslmode=require` |
   | `SECRET_KEY` | `python -c "import secrets; print(secrets.token_hex(32))"` |
   | `CORS_ORIGINS` | `https://<your-project>.vercel.app` (add after Vercel deploy; comma-separate extra origins) |

   `ALGORITHM` and `ACCESS_TOKEN_EXPIRE_MINUTES` are optional (sane defaults in code).
5. Settings → Networking → **Generate Domain** → verify `https://<domain>/docs`.

## 3. Vercel (frontend)

1. [vercel.com](https://vercel.com) → **Add New Project** → import the same repo.
2. Root Directory = `client`, framework preset Vite (auto).
3. Environment Variables (Production):

   | Variable | Value |
   |---|---|
   | `VITE_API_BASE` | `https://<railway-domain>` — no trailing slash, no `/api` (the app appends `/api`) |

4. Deploy → open `https://<project>.vercel.app`, register, list, book.
5. If you set a different Vercel domain than you guessed in step 4 of Railway,
   update `CORS_ORIGINS` there and redeploy the backend.

## Environment variables — complete reference

| Where | Name | Local dev value | Production value | Purpose |
|---|---|---|---|---|
| server `.env` / Railway | `DATABASE_URL` | `sqlite:///./enroute.db` | Supabase pooler URI | DB connection; SQLite locally, Postgres in prod |
| server `.env` / Railway | `SECRET_KEY` | random hex (already generated in your .env) | fresh random hex | signs/verifies JWTs — leaking it lets anyone forge logins |
| server / Railway | `ALGORITHM` | `HS256` | `HS256` | JWT signing algorithm |
| server / Railway | `ACCESS_TOKEN_EXPIRE_MINUTES` | `1440` | `1440` | token lifetime (24 h) |
| server `.env` / Railway | `CORS_ORIGINS` | `http://localhost:5173,http://localhost:4173` | your Vercel URL(s) | which frontends may call the API |
| client `.env` (optional) / Vercel | `VITE_API_BASE` | unset (Vite proxies `/api` → `127.0.0.1:8000`) | Railway URL | where the built JS sends API calls |

Note: `VITE_*` vars are baked into the JS bundle at build time — changing them means re-deploying the frontend.

## External APIs used (all free, no keys needed)

| API | Used for | Get it |
|---|---|---|
| OpenStreetMap tiles | maps in `RouteMap` / `LocationPicker` | nothing to sign up — public tiles, attribution already shown; fair-use policy: operations.osmfoundation.org/policies/tiles |
| WhatsApp `wa.me` links | post-approval driver↔customer chat | nothing — just crafted URLs |

Everything else is your own internal REST API (auth, routes, bookings) between your two deployments.

## Local development stays unchanged

```bash
# terminal 1
cd server && uvicorn app.main:app --port 8000
# terminal 2
cd client && npm run dev
```
