# Lorenz.dev — Portfolio & Software Studio

The personal site for Lorenz “Lanz” Malabanan — a spec-sheet portfolio with a
motion layer: live 3D models you can play with, kinetic type and two 15-second
films. Built with **Next.js 14 (App Router)**, **React 18**, **Tailwind CSS**
and **three.js**. See [`DESIGN.md`](DESIGN.md) for the design and motion system.

## Tech

- Next.js 14 App Router (ISR enabled — data revalidates on a schedule)
- React 18 + TypeScript
- Tailwind CSS (tokens in `src/app/globals.css`)
- Newsreader, Instrument Sans, JetBrains Mono (and Kalam once) via `next/font`
- lucide-react icons, and a custom logo mark (`src/components/brand/`)
- Procedural 3D models in `src/three/` (the hero room, macropad, PARADA lot, Tala desk),
  drawn live with `@react-three/fiber` and loaded lazily (`src/components/three/`)
- Posters, films and the share image rendered from the same models with
  Remotion in [`art/`](art/README.md) into `public/art/`

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

Other commands:

```bash
npm run build   # production build (ISR, not a static export)
npm run start   # serve the production build
npm run lint    # eslint
npx tsc --noEmit # type check
```

## Deploying to Vercel

The project is configured for Vercel:

- **Not** a static export — pages use ISR with `revalidate`, so GitHub data is
  fetched on a schedule (default hourly).
- Connect the GitHub repo to Vercel and it deploys automatically on every push.
- Optional: set a `GITHUB_TOKEN` environment variable in Vercel for a higher
  GitHub API rate limit (see `.env.example`). Public data works without it.

## How projects are sourced

The site auto-populates projects from your public GitHub repositories
(`GET /users/{username}/repos`) and refreshes release/download info from the
latest GitHub release of each repo (`revalidate = 3600`).

- New public repos appear as projects automatically. The site repo
  (`lanzdev`), the `e1ywrites` profile repo and `parada-landing` (linked from
  PARADA instead) are excluded.
- Version, release date, and download links track the latest release assets:
  - Windows: `.exe` / `.msi`
  - macOS: `.dmg` / `.app.tar.gz`
  - Linux: `.AppImage` / `.deb` / `.rpm`

Hand-curated data in `src/data/projects.ts` (story, features, changelog,
screenshots, featured flag) merges over the GitHub data by repo/slug, so a
curated project keeps its rich detail while still receiving live release info.

A project with a `demoUrl` gets a live-demo button on its project page (PARADA's
points at its landing page, `https://parada-landing.vercel.app/`).

See `ADDING_PROJECTS.md` for how to curate a project entry.

## Projects

Currently curated on the site, in this order:

1. **PARADA** — smart parking with zone-level availability from OCR-assisted gate
   cameras (Expo, Next.js, Express, FastAPI + OpenCV/EasyOCR, PostgreSQL). Roadmap,
   stats and docs come from [E1yWrites/parada](https://github.com/E1yWrites/parada);
   its landing page is [E1yWrites/parada-landing](https://github.com/E1yWrites/parada-landing).
2. **Tala** — a local-first note-taking app with handwriting (Tauri + React), with a
   live web version at `https://tala-xi.vercel.app/`.

Personal details (education, certifications, organisations) live in
`src/data/config.ts` and are taken from the résumé — email and city only, no phone
number or street address.

## Other pages

- Live release history is served from the GitHub releases API
  (`src/app/releases/page.tsx`).
- Static content lives in `src/data/` (`config.ts`, `docs.ts`, `navigation.ts`).
- Project documentation is served under `/docs/<slug>` and driven by
  `src/data/docs.ts` (`docsByProject` feeds both the docs index and sidebar).