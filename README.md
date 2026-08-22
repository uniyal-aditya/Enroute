# 🚚 Enroute — Smart Shared Freight & Spare Truck Capacity Platform

> **Smart India Hackathon 2026**  
> **Theme:** Transportation & Logistics  
> **Team:** AAPHAT  
> **Repository:** [https://github.com/uniyal-aditya/Enroute](https://github.com/uniyal-aditya/Enroute)

![Enroute Banner](/client/public/hero_light.png)

---

## 📖 Product Concept

**Enroute** is a two-sided logistics marketplace that connects truck drivers travelling with unused cargo capacity to individuals, small businesses, and shippers needing affordable goods transportation.

Traditional courier companies charge expensive standalone rates and deploy dedicated vehicles. Enroute monetizes empty return journeys and partially loaded trucks along existing highway corridors (e.g. Dehradun ⇄ Delhi, Delhi ⇄ Jaipur, Haridwar ⇄ Chandigarh), reducing freight costs by **40% to 60%** while cutting carbon emissions from empty backhauls.

```
Driver publishes planned route → Route saved in PostgreSQL → Senders discover on Map → Customer requests space → Driver reviews & accepts → Direct WhatsApp / Phone coordination unlocks!
```

---

## ⚡ Core Features

- 🔐 **Unified Role-Based Authentication:** Single auth system supporting `DRIVER` and `CUSTOMER` with JWT tokens, bcrypt password hashing, and role-protected pages.
- 🗺️ **Interactive Route Marketplace:** React-Leaflet + OpenStreetMap integration with synchronized split map view, polyline route paths, and distance calculations.
- 📍 **Dual Location Picker:** Interactive map pin picker with auto-estimated route distance and Indian city presets (Delhi, Dehradun, Jaipur, Haridwar, Chandigarh, Rishikesh, Mumbai, Pune).
- 📦 **End-to-End Booking Lifecycle:** Customers submit cargo details (pickup, drop, goods, weight) with a 5-step status pipeline (`Request Sent` → `Driver Reviewing` → `Confirmed` → `Pickup` → `Delivery`).
- 🔒 **Privacy-First Contact Unlocking:** Driver phone number and WhatsApp actions remain masked until the driver explicitly confirms the booking request.
- 📱 **One-Click WhatsApp & Voice Coordination:** Verified international `wa.me` links and `tel:` links automatically formatted for instant driver-to-customer communication.
- 📊 **Dual Command Center Dashboards:** Role-tailored dashboards with real-time KPI metrics, active trips, and booking request approval workflows.
- ⚖️ **Direct Offline Payments:** Eliminates payment gateway lock-in; cash / UPI arrangements are handled directly offline between driver and sender.
- 🎯 **Hackathon Judge Mode:** One-click Demo Account filler for instant judging and evaluation.

---

## 🏗️ Architecture & Technology Stack

```mermaid
graph TD
    Client["React 18 + Vite SPA<br/>(Vercel)"] -->|REST API / JWT| Server["FastAPI + Uvicorn<br/>(Railway)"]
    Server -->|SQLAlchemy 2.x ORM| DB[("PostgreSQL Database<br/>(Supabase)")]
    Server -->|Alembic| Migrations["Schema Migrations"]
    Client -->|On Confirmed Status| Contact["WhatsApp / Phone Coordination"]
```

### Frontend (`client/`)
- **Core:** React 18, Vite 5, React Router v6
- **Styling:** Tailwind CSS, Custom Dark Navy Logistics Theme, Google Fonts (Inter & Outfit)
- **Maps:** React Leaflet 4, Leaflet 1.9, Carto Voyager / OpenStreetMap tiles
- **Networking & State:** Axios (centralized interceptors), React Context (`AuthContext`)
- **Feedback:** React Hot Toast, Lucide Icons

### Backend (`server/`)
- **Framework:** Python 3.12+, FastAPI, Uvicorn
- **ORM & Database:** SQLAlchemy 2.0, PostgreSQL (Supabase) & SQLite for zero-config local dev
- **Migrations:** Alembic
- **Security:** PyJWT / python-jose, direct bcrypt password hashing
- **Validation:** Pydantic v2, email-validator, python-dotenv

### Deployment
- **Frontend:** Vercel (`vercel.json` SPA routing)
- **Backend:** Railway (`railway.json`, `Procfile`)
- **Database:** Supabase Managed PostgreSQL

---

## 🚀 Quick Local Setup

### Prerequisites
- Node.js 18+ and npm
- Python 3.10+ and pip

### 1. Clone the Repository
```bash
git clone https://github.com/uniyal-aditya/Enroute.git
cd Enroute
```

### 2. Backend Setup
```bash
cd server
python -m venv venv

# Windows:
venv\Scripts\activate
# macOS/Linux:
# source venv/bin/activate

pip install -r requirements.txt

# Seed realistic demo routes, drivers, and customers:
python seed.py

# Start the FastAPI server:
uvicorn app.main:app --reload --port 8000
```
API will be live at: `http://127.0.0.1:8000`  
Swagger Documentation: `http://127.0.0.1:8000/docs`

### 3. Frontend Setup
```bash
# In a separate terminal:
cd client
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🧑‍⚖️ Hackathon Judge Demo Flow

To test the complete end-to-end user journey in under 2 minutes:

1. Navigate to `http://localhost:5173/login`.
2. Click **"Quick Fill: Demo Customer"** (Pooja Verma — `customer@enroute.com` / `Customer123!`).
3. Click **Sign In**.
4. Browse available routes on the Marketplace (e.g. *Dehradun → Delhi* or *Delhi → Jaipur*).
5. Click **"View Route"** and submit a booking request (e.g., *"4 cartons of textiles, ~85 kg"*).
6. Log out, then click **"Quick Fill: Demo Driver"** (Rajesh Sharma — `driver@enroute.com` / `Driver123!`).
7. Open the **Driver Dashboard** → go to **Booking Requests**.
8. Review the incoming request and click **Accept Request**.
9. The status becomes `CONFIRMED` and customer contact details unlock.
10. Log back in as the Customer → Go to **My Bookings** → Notice the **"WhatsApp Driver"** and **"Call Driver"** buttons are now unlocked!

---

## 🔑 Demo Accounts Reference

| Role | Name | Email | Password | Details |
|---|---|---|---|---|
| **DRIVER** | Rajesh Sharma | `driver@enroute.com` | `Driver123!` | Tata 407 (2.5 Tons), UK-07-TA-4521 |
| **DRIVER** | Vikram Singh | `vikram.driver@enroute.com` | `Driver123!` | Eicher Pro 2049 (3.0 Tons), DL-1L-AA-9988 |
| **CUSTOMER** | Pooja Verma | `customer@enroute.com` | `Customer123!` | Verma Handicrafts & Textiles |
| **CUSTOMER** | Amit Joshi | `amit.customer@enroute.com` | `Customer123!` | Himalayan Organic Spices |

---

## 🌐 Deployment Configuration

### Railway (Backend)
1. Link your GitHub repository in Railway.
2. Set Root Directory to `server/`.
3. Configure Environment Variables:
   - `DATABASE_URL`: Your Supabase PostgreSQL URI (e.g. `postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres?sslmode=require`)
   - `SECRET_KEY`: A secure 32-byte hex key (`python -c "import secrets; print(secrets.token_hex(32))"`)
   - `CORS_ORIGINS`: `https://your-vercel-app.vercel.app`

### Vercel (Frontend)
1. Import the repository in Vercel.
2. Set Root Directory to `client/` and build command to `npm run build`.
3. Configure Environment Variables:
   - `VITE_API_URL`: `https://your-railway-backend.up.railway.app`

---

## 👥 Team AAPHAT — Smart India Hackathon 2026

* **Project:** Enroute (Transportation & Logistics)
* **Status:** Complete, Tested, Production & Showcase Ready 🚀
