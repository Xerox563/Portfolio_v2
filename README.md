# Amit Gangwar — Portfolio

React + TypeScript + Vite frontend with an Express API (`api/index.js`) deployed as a
Vercel serverless function. All data (portfolio content + blogs) lives in **Supabase**.

## Architecture

| Layer | Tech |
| --- | --- |
| Frontend | React 19, Vite, Framer Motion, Lenis |
| API | Express 5 (single Vercel function at `api/index.js`) |
| Storage | **Supabase** (PostgREST, service role key) — used in production |
| Fallbacks | Neon/Postgres (`DATABASE_URL`), Upstash Redis, then local `db.json` / `blogs.db` (local dev) |

Data is kept in a single `portfolio_kv(key, value JSONB)` table with two keys:
`portfolio:content` (the whole `db.json`) and `portfolio:blogs` (the blog list).
All API responses send `Cache-Control: no-store` so every device always fetches fresh data.

### Seeding

On the first request against a fresh database the API seeds it from the bundled
`db.json` / `blogs.db` (so a new deployment automatically gets the latest committed data).
After that, admin edits win. To force a refresh on every deploy, set `RESEED_ON_DEPLOY=1`.

> Why this fixes "old data on phone": serverless filesystems are read-only and each
> invocation is fresh, so without a real database every deploy shows the *old bundled*
> `db.json`. Supabase gives one shared, persistent source of truth for all devices.

## Setup

### 1. Supabase (free, 5 min)

1. Create a project at https://supabase.com (free tier is enough).
2. Open **SQL Editor** and run the setup script from `supabase/schema.sql`
   (creates the `portfolio_kv` table).
3. Copy from **Settings → API**:
   - `SUPABASE_URL` — e.g. `https://xyzcompany.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY` — the service_role key (server-side secret)
4. Add both to `.env` and to **Vercel → Settings → Environment Variables**.

### 2. Env vars

Copy `.env.example` to `.env` and fill in:

| Variable | Required | Purpose |
| --- | --- | --- |
| `SUPABASE_URL` | yes (prod) | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | yes (prod) | Supabase service role key |
| `VITE_WEB3FORMS_KEY` | no | Web3Forms key for the contact form |
| `VITE_ADMIN_USER` / `VITE_ADMIN_PASS` | no | Admin login at `/#admin` (defaults `admin` / `Itsme@portfolio`) |
| `VITE_API_URL` | no | API origin if it is hosted separately (empty = same origin) |
| `RESEED_ON_DEPLOY` | no | `1` = re-seed from bundled files on every deploy |
| `DATABASE_URL` | no | Neon/Postgres fallback when Supabase is unset |
| `UPSTASH_REDIS_REST_URL` / `TOKEN` | no | Redis fallback for local dev |

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
- `GET /api/health` — reports `storage` mode (`supabase` / `postgres` / `redis` / `file`)

## Admin

`/#admin` — edit profile, about, skills, projects, experience, blogs and links, plus
JSON import/export. All edits are persisted to the database (or server files locally).