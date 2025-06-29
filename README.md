# shortlinker

A minimal full-stack URL shortener built with **Node.js (Express, TypeScript)**, **React**, and **PostgreSQL**.  
Features a stylish UI, redirect/render-in-frontend, and session-based short URL listing.  
**Bonus:** Optional rate-limiting (default 5 URLs/minute/IP).

---

## Backend

### Tech Stack

- Node.js + Express + TypeScript
- PostgreSQL
- RESTful API

### Setup

1. **Install dependencies:**
   ```
   cd backend
   npm install
   ```

2. **Configure Postgres:**
   - Create a database:
     ```
     createdb urlshort
     ```
   - Run the SQL in `db/init.sql` to create the table.

3. **Set environment variables** (see `.env`):
   ```
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/urlshort
   BASE_URL=http://localhost:3000
   ```

4. **Run the backend:**
   ```
   npm run dev
   ```
   (or `npm start` for production)

### API Endpoints

- `POST /api/shorten` `{ url }` → `{ shortUrl, shortId, originalUrl }`
- `GET /api/r/:shortId` → redirects to original URL
- `GET /api/r/:shortId?render=true` → `{ originalUrl }` (for frontend to embed)
- `GET /api/list` → `{ urls: [...] }` — recent session's URLs

---

## Frontend

### Tech Stack

- React + TypeScript
- Material UI

### Setup

1. **Install dependencies:**
   ```
   cd frontend
   npm install
   ```

2. **Set API base** (optional, default = `http://localhost:5000/api`):
   - In `.env`:
     ```
     REACT_APP_API_BASE=http://localhost:5000/api
     ```

3. **Run the frontend:**
   ```
   npm start
   ```

### Features

- Form to shorten URLs (+ shows shortened URL).
- List of all URLs shortened in this session.
- Clicking on a shortened URL "renders" it in an iframe (does not redirect the browser).

---

## Assumptions & Trade-offs

- IP address is used for session tracking and rate limiting.
- Short IDs are 7-char random strings; collision probability is extremely low.
- No login/auth — session is per IP.
- Rate limiting (optional) is per IP (can be removed).
- No analytics/tracking for simplicity.
- Deployment: Vercel (frontend), Railway/Render (backend) recommended.

---

## Deployment

- **Frontend:** Deploy `/frontend` to [Vercel](https://vercel.com)
- **Backend:** Deploy `/backend` to [Railway](https://railway.app) or [Render](https://render.com)
- **Database:** Railway/Render free Postgres

---

## License

MIT
