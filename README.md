# arshakil

[![CI](https://github.com/Safayet-shawon/arshakil/actions/workflows/ci.yml/badge.svg)](https://github.com/Safayet-shawon/arshakil/actions/workflows/ci.yml)

Portfolio website for **AR. Shakhaouth Hossain Shakil**: architect, photographer, traveller, author, content creator, social worker.

```
frontend/   Next.js (App Router) + TypeScript + Tailwind v4 + Framer Motion + Lenis
backend/    NestJS + TypeScript + Redis   (content API + contact form)
```

The two apps are independent: each has its own `package.json`, `node_modules` and scripts.

## Run it

```bash
# 0. Redis (optional, powers the contact-form rate limit; needs Docker)
docker compose up -d redis

# 1. backend  (http://localhost:4000/api)
cd backend
cp .env.example .env        # REDIS_URL=redis://localhost:6379
npm install
npm run start:dev

# 2. frontend (http://localhost:3000)
cd frontend
cp .env.example .env.local
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

## API (`backend`, prefix `/api`)

| Method | Path | Notes |
|---|---|---|
| GET | `/health` | liveness + Redis status |
| GET | `/content/site` · `/content/fields` · `/content/projects` · `/content/projects/:slug` · `/content/services` | placeholder content |
| POST | `/contact` | `{ name, email, message }`, validated, max 5 per IP per minute (Redis), appended to `backend/storage/messages.jsonl` (gitignored) |

`FRONTEND_URL` (comma-separated) controls CORS. The frontend reads `NEXT_PUBLIC_API_URL` (default `http://localhost:4000/api`).

## Notes

- Replace the placeholder email, social links, project copy and photos with real ones.
- The portrait is a transparent PNG at `frontend/public/images/hero-portrait.png` (used in the hero, the about page and the intro polaroid).
- `npm audit` reports 2 moderate findings in `minimatch`, pulled in by `@nestjs/cli` (build tooling only, not shipped).
