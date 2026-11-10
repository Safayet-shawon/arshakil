# arshakil

[![CI](https://github.com/Safayet-shawon/arshakil/actions/workflows/ci.yml/badge.svg)](https://github.com/Safayet-shawon/arshakil/actions/workflows/ci.yml)

Portfolio website for **AR. Shakhaouth Hossain Shakil**: architect, photographer, traveller, author, content creator, social worker.

```
frontend/   Next.js (App Router) + TypeScript + Tailwind v4 + Framer Motion + Lenis
backend/    NestJS + TypeScript + PostgreSQL (TypeORM) + Redis   (content API + inquiries inbox)
```

The two apps are independent: each has its own `package.json`, `node_modules` and scripts.

## Run it

```bash
# 0. Databases (needs Docker): PostgreSQL stores the inquiries, Redis powers the contact-form rate limit (optional)
docker compose up -d postgres redis

# 1. backend  (http://localhost:4000/api)
cd backend
cp .env.example .env        # set ADMIN_API_KEY (openssl rand -hex 32); DATABASE_URL already matches docker-compose
npm install
npm run start:dev           # dev: the inquiries table is created automatically

# 2. frontend (http://localhost:3000)
cd frontend
cp .env.example .env.local  # use the SAME ADMIN_API_KEY; set ADMIN_SECRET / ADMIN_USER / ADMIN_PASS for the admin login
npm install
npm run dev
```

Checks: `npm run lint` (type-check) and `npm run build` in either folder.

## Redis

Redis holds the contact-form rate limit (5 messages per IP per minute, `INCR` + `EXPIRE`), so the limit is shared across server instances and survives restarts.

- Set `REDIS_URL` in `backend/.env`. `GET /api/health` reports `"redis": "up" | "down" | "not configured"`.
- No `REDIS_URL`, or Redis goes down: the API keeps working and uses an in-memory counter instead.
- `docker-compose.yml` starts a local `redis:7-alpine` with a health check and a persistent volume.

## CI

`.github/workflows/ci.yml` runs on every push to `main` and every pull request:

| Job | What it does |
|---|---|
| Frontend | `npm ci`, type-check (`npm run lint`), `npm run build` |
| Backend | `npm ci`, type-check, build, then starts the API against a real Redis service container and smoke-tests it: `/health` says Redis is up, `/content/site` answers, and the 6th contact request in a minute gets `429` |

A newer push to the same branch cancels the older run. Deployment to Vercel is separate (`vercel deploy --prod` from `frontend/`).

## What the page does

| Part | Where |
|---|---|
| Intro: count 1 → 99, roles on the left, number fills grey → mustard, hold with **"AND…"**, 100, **"Say cheeseee!"**, camera, flash, polaroid, **PHOTOGRAPHER**. Click anywhere to skip | `frontend/src/components/home/Intro.tsx`, `Camera.tsx` |
| Hero: two-row name in front of a faded portrait, swiping roles, social stack. Click to skip the entry animation | `Hero.tsx`, `RoleSwipe.tsx` |
| Home sections: fields, approach, selected work (best of each field), services, contact | `components/home/*` |
| Field pages: architecture, photography (gallery + lightbox), content creation (YouTube cards), travel, author (PDF books), social work, about | `frontend/src/app/*` |
| Header dropdowns (Fields, Content), phone menu, footer links | `components/layout/*` |
| Mustard punctuation (`, . - ' &`) on all text | `components/ui/Hl.tsx` |
| Mustard cursor (dot, ring, trail, "VIEW" disc, click ripple) | `components/layout/Cursor.tsx` |

Content lives in `frontend/src/data/` (`site.ts`, `content.ts`). Photos are in `frontend/public/photos/` (stock images from Unsplash; swap file-for-file), the sample book PDF is in `frontend/public/pdfs/`. To show a real YouTube thumbnail, add `youtubeId` to a video in `content.ts`.

## Design system

| Token | Value / use |
|---|---|
| Base | white `#fff`, greys `g50 … g600` |
| Deepest tone | charcoal `#4d4f53` (`ink`), no black anywhere |
| Accent | mustard `#f7b500` (`accent`), `#d49a00` for small text, `#f0c24a` (`accent-soft`) for outlines. Used for the cursor, punctuation, and mild glows / lines |
| Display font | Impact (`.font-display`) |
| Body font | Arial |

Tokens are in `frontend/src/app/globals.css` (`@theme`).

## Inquiries: hire requests and messages

Everything sent through the website's contact form becomes one row in the `inquiries` table (PostgreSQL), so the owner has a
permanent history he can search later. Nothing is trimmed or capped.

```
visitor ─► Next.js /api/contact ─► NestJS POST /api/inquiries ─► PostgreSQL (the record)
                                                            └──► email to the owner (Resend), replies go to the visitor
admin   ─► /ar6061 → Inquiries ─► Next.js /api/admin/messages* (checks the admin login) ─► NestJS /api/admin/inquiries* (x-admin-key)
```

- **Tags.** Each inquiry has a *kind* (`hire` when the visitor picked "Hire me as ...", otherwise `general`) and a *work field*
  (`architecture`, `photography`, `content-creation`, `consulting`, `other`), taken from the service picked. The admin filters by field.
- **Journal.** The admin sets a *status* (`new` → `read` → `replied` → `archived`) and writes a private *note* on each one.
  `new` ones show as a red count. Search covers name, email, phone, message, service and notes; dates can be filtered too.
- **Email.** With `RESEND_API_KEY` + `CONTACT_TO` set in `backend/.env`, each inquiry is also emailed to the owner (reply-to = the visitor).
  The row is saved first; if the email fails, the row records `email_status = failed` and the admin sees a note on the card.
- **Fallback.** If the frontend has no `INQUIRIES_API_URL` it keeps using the old private Blob file (statuses and notes work there too),
  so nothing breaks before the backend is live. Once it is, the admin shows an **Import** button for the older messages (safe to repeat).
- **Schema.** In production (`NODE_ENV=production`) tables come only from migrations in `backend/src/database/migrations`, run on start
  (PostgreSQL 13+). In development TypeORM builds the table from `inquiry.entity.ts`. Add a migration when the entity changes.
- **The work-field list** lives in `backend/src/inquiries/inquiry.constants.ts` and `frontend/src/lib/inquiry.ts`: keep them in step.

## API (`backend`, prefix `/api`)

| Method | Path | Notes |
|---|---|---|
| GET | `/health` | liveness: database + Redis status |
| GET | `/content/site` · `/content/fields` · `/content/projects` · `/content/projects/:slug` · `/content/services` | placeholder content |
| POST | `/inquiries` (alias `/contact`) | `{ name, email?, phone?, message, service?, field?, website? }`: at least one of email / phone; `website` is a bot trap. Max 5 per IP per minute (Redis) |
| GET | `/admin/inquiries` | `?field&kind&status&q&from&to&page&pageSize`, newest first → `{ items, total, page, pageSize }` |
| GET | `/admin/inquiries/summary` | totals and unread counts per field and kind |
| PATCH | `/admin/inquiries/:id` | `{ status?, notes? }` |
| POST | `/admin/inquiries/mark-all-read` | `{ field?, kind? }` |
| POST | `/admin/inquiries/import` | one-time import of messages from the old Blob store |
| DELETE | `/admin/inquiries/:id` | |

`/admin/*` needs the `x-admin-key` header (`ADMIN_API_KEY`). Only the Next.js server holds that key, after checking the admin's login;
the browser never calls these. With the key unset, every admin call is refused. `FRONTEND_URL` (comma-separated) controls CORS.
Behind nginx set `TRUST_PROXY=1` so the rate limit sees the visitor's IP.

## Notes

- Replace the placeholder email, social links, project copy and photos with real ones.
- The portrait is a transparent PNG at `frontend/public/images/hero-portrait.png` (used in the hero, the about page and the intro polaroid).
- `npm audit` reports 2 moderate findings in `minimatch`, pulled in by `@nestjs/cli` (build tooling only, not shipped).
