# Amit Gangwar — Portfolio

React + TypeScript + Vite frontend with an Express API (`api/index.js`) deployed as a
Vercel serverless function. Content lives in PostgreSQL (fallback: Upstash Redis → local files).

## Architecture

| Layer | Tech |
| --- | --- |
| Frontend | React 19, Vite, Framer Motion, Lenis |
| API | Express 5 (single Vercel function at `api/index.js`) |
| Storage | PostgreSQL (`pg`) via `DATABASE_URL` — used in production |
| Fallbacks | Upstash Redis (`UPSTASH_*`), then local `db.json` / `blogs.db` (local dev) |

Data is kept in a single `portfolio_kv(key, value JSONB)` table with two keys:
`portfolio:content` (the whole `db.json`) and `portfolio:blogs` (the blog list).

### Seeding

On the first request against a fresh database the API seeds it from the bundled
`db.json` / `blogs.db` (so a new deployment automatically gets the latest committed data).
After that, admin edits win. To force a refresh on every deploy, set `RESEED_ON_DEPLOY=1`.

> Why this fixes "old data on phone": serverless filesystems are read-only and each
> invocation is fresh, so without a real database every deploy shows the *old bundled*
> `db.json`. PostgreSQL gives one shared, persistent source of truth for all devices.

## Setup

### 1. Env vars

Copy `.env.example` to `.env` and fill in:

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | yes (prod) | Postgres connection string, e.g. `postgres://…?sslmode=require` |
| `VITE_WEB3FORMS_KEY` | no | Web3Forms key for the contact form |
| `VITE_ADMIN_USER` / `VITE_ADMIN_PASS` | no | Admin login at `/#admin` (defaults `admin` / `Itsme@portfolio`) |
| `VITE_API_URL` | no | API origin if it is hosted separately (empty = same origin) |
| `RESEED_ON_DEPLOY` | no | `1` = re-seed from bundled files on every deploy |
| `UPSTASH_REDIS_REST_URL` / `TOKEN` | no | Redis fallback when `DATABASE_URL` is unset |

### 2. PostgreSQL (free, 5 min)

Any Postgres works (Neon, Supabase, Render, …). In Vercel:

1. Go to **Storage → Create database** (or create one on Neon/Supabase).
2. Copy the connection string into the `DATABASE_URL` env var:
   - Vercel: **Project → Settings → Environment Variables**
   - also add `VITE_WEB3FORMS_KEY`, `VITE_ADMIN_USER`, `VITE_ADMIN_PASS`
3. Redeploy. The table and seed data are created automatically on first API request.

### 3. Local development

```bash
npm install
npm run dev      # Vite on :5173
npm run server   # API on :3001 (uses db.json / blogs.db locally)
```

Open http://localhost:5173 (admin at http://localhost:5173/#admin).

### 4. Deploy

```bash
vercel
```

Push `db.json` / `blogs.db` changes to the repo and deploy — the API re-seeds the
database only if the keys are missing (or with `RESEED_ON_DEPLOY=1`).

## API

- `GET/PUT /api/content` — portfolio content
- `GET /api/blogs` · `POST /api/blogs` · `GET/PUT/DELETE /api/blogs/:id`
- `POST /api/blogs/:id/like`
- `GET /api/health` — reports `storage` mode (`postgres` / `redis` / `file`)

## Admin

`/#admin` — edit profile, about, skills, projects, experience, blogs and links, plus
JSON import/export. All edits are persisted to the database (or server files locally).