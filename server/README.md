# Enroute — Backend (FastAPI)

Full-stack logistics platform backend: connects truck drivers with spare
return-trip cargo capacity to individuals/small businesses needing cheap
courier transport.

## Quick start (local, SQLite — zero setup)

```bash
cd server
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env             # defaults already work with SQLite

uvicorn app.main:app --reload
```

Then open:
- **http://127.0.0.1:8000/docs** — interactive Swagger UI, test every endpoint here
- **http://127.0.0.1:8000/redoc** — ReDoc alternative view

Tables are auto-created on first run (SQLite file `enroute.db` appears in `server/`).

## Switching to Supabase Postgres (production)

1. Create a Supabase project → Settings → Database → copy the **Connection string (URI)**.
2. In `.env`, set:
   ```
   DATABASE_URL=postgresql://postgres:<password>@db.<project-ref>.supabase.co:5432/postgres
   ```
3. Restart the server — tables get created there instead.

## Auth flow

1. `POST /api/auth/register` — create a DRIVER or CUSTOMER account.
2. `POST /api/auth/login` — send `username` (= email) + `password` as form data → get a JWT.
3. Click **Authorize** in `/docs` and paste the token to test protected routes, or send
   `Authorization: Bearer <token>` manually.

## Endpoint summary

| Group | Method | Path | Auth | Notes |
|---|---|---|---|---|
| Auth | POST | `/api/auth/register` | — | driver or customer |
| Auth | POST | `/api/auth/login` | — | returns JWT |
| Auth | GET | `/api/auth/me` | any | current user |
| Routes | POST | `/api/routes/` | driver | create listing |
| Routes | GET | `/api/routes/` | — | browse/search (filters: origin, destination, truck_type, departure_after, status_filter) |
| Routes | GET | `/api/routes/my-listings` | driver | own listings |
| Routes | GET | `/api/routes/{id}` | — | single listing |
| Routes | PUT | `/api/routes/{id}` | driver, owner only | partial update |
| Routes | DELETE | `/api/routes/{id}` | driver, owner only | soft-delete → status CANCELLED |
| Bookings | POST | `/api/bookings/` | customer | book a route (route must be ACTIVE) |
| Bookings | GET | `/api/bookings/my-bookings` | customer | own bookings |
| Bookings | GET | `/api/bookings/driver-requests` | driver | requests on their routes |
| Bookings | PATCH | `/api/bookings/{id}/status` | driver, route owner only | accept (CONFIRMED) / reject (REJECTED) |

## What's deliberately NOT here yet (per the implementation plan's scope decisions)

- Payments — offline (cash/UPI), out of scope
- Real-time chat — WhatsApp deep link (`wa.me/<number>`) on the frontend instead
- Admin panel — out of scope for hackathon
- OTP verification + ratings — flagged as the next milestone after MVP

## Project structure

```
server/
  app/
    main.py            # app instance, CORS, routers
    config.py           # env-driven settings
    database.py          # SQLAlchemy engine/session/Base
    models/              # User, RouteListing, Booking
    schemas/              # Pydantic request/response models
    routers/               # auth, listings, bookings
    dependencies/            # get_db, get_current_user, role guards
    utils/                    # password hashing, JWT, misc helpers
  alembic/                     # migrations (optional — create_all handles dev)
  requirements.txt
  render.yaml                    # Render.com deploy config
  .env.example
```
