# arshakil

Portfolio website for **AR. Shakhaouth Hossain Shakil**: architect, photographer, traveller, writer, content creator.

```
frontend/   Next.js (App Router) + TypeScript + Tailwind v4 + Framer Motion + Lenis
backend/    NestJS + TypeScript   (content API + contact form)
```

The two apps are independent: each has its own `package.json`, `node_modules` and scripts.

## Run it

```bash
# 1. backend  (http://localhost:4000/api)
cd backend
cp .env.example .env
npm install
npm run start:dev

# 2. frontend (http://localhost:3000)
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Checks: `npm run lint` (type-check) and `npm run build` in either folder.

## What the page does

| Part | Where |
|---|---|
| Intro: count 1 → 99, roles on the left, number fills grey → mustard, hold with **"AND…"**, 100, **"Say cheeseee!"**, camera, flash, polaroid, **PHOTOGRAPHER** | `frontend/src/components/home/Intro.tsx`, `Camera.tsx` |
| Hero: two-row name in front of a faded portrait, swiping roles, social stack | `Hero.tsx`, `RoleSwipe.tsx` |
| Sections: marquee, fields, approach, selected work (hover preview), services, contact | `components/home/*` |
| Mustard cursor (dot, ring, trail, "VIEW" disc, click ripple) | `components/layout/Cursor.tsx` |
| Intro → header/hero hand-off | `lib/intro.ts` |

Placeholder content lives in `frontend/src/data/` (`site.ts`, `content.ts`). The backend serves the same shape.

## Design system

| Token | Value / use |
|---|---|
| Base | white `#fff`, greys `g50 … g600` |
| Deepest tone | charcoal `#4d4f53` (`ink`), no black anywhere |
| Accent | mustard `#f7b500` (`accent`), `#d49a00` for small text. Used for the cursor, the `.` after AR, the `'` in "Let's", and mild glows / lines |
| Display font | Impact (`.font-display`) |
| Body font | Arial |

Tokens are in `frontend/src/app/globals.css` (`@theme`).

## API (`backend`, prefix `/api`)

| Method | Path | Notes |
|---|---|---|
| GET | `/health` | liveness |
| GET | `/content/site` · `/content/fields` · `/content/projects` · `/content/projects/:slug` · `/content/services` | placeholder content |
| POST | `/contact` | `{ name, email, message }`, validated, max 5 per IP per minute, appended to `backend/storage/messages.jsonl` (gitignored) |

`FRONTEND_URL` (comma-separated) controls CORS. The frontend reads `NEXT_PUBLIC_API_URL` (default `http://localhost:4000/api`).

## Notes

- Replace the placeholder email, social links, project copy and photos with real ones.
- The portrait is a transparent PNG at `frontend/public/images/hero-portrait.png` (used in the hero and the intro polaroid).
- `npm audit` reports 2 moderate findings in `minimatch`, pulled in by `@nestjs/cli` (build tooling only, not shipped).
