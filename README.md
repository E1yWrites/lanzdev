# Lorenz.dev — Portfolio & Software Studio

The personal site for Lorenz Malabanan — a Swiss-design–inspired portfolio built
with **Next.js 14 (App Router)**, **React 18**, and **Tailwind CSS**.

## Tech

- Next.js 14 App Router (ISR enabled — data revalidates on a schedule)
- React 18 + TypeScript
- Tailwind CSS (custom "swiss" design tokens)
- lucide-react icons

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
  (`lanzdev`) and the `e1ywrites` profile repo are excluded.
- Version, release date, and download links track the latest release assets:
  - Windows: `.exe` / `.msi`
  - macOS: `.dmg` / `.app.tar.gz`
  - Linux: `.AppImage` / `.deb` / `.rpm`

Hand-curated data in `src/data/projects.ts` (story, features, changelog,
screenshots, featured flag) merges over the GitHub data by repo/slug, so a
curated project keeps its rich detail while still receiving live release info.

A project with a `demoUrl` gets a "View Demo" button on its project page
(e.g. the PARADA Landing live preview at `https://parada-landing.vercel.app/#demo`).

See `ADDING_PROJECTS.md` for how to curate a project entry.

## Projects

Currently curated on the site:

- **Tala** — a thoughtful, doodle-inspired note-taking workspace (Tauri + React),
  with a live web preview at `https://tala-xi.vercel.app/`.
- **PARADA Landing** — smart parking capstone marketing page, with a live
  demo deployment. Curated in `src/data/projects.ts`, docs in `src/data/docs.ts`.
- **Modpack Development** — a Minecraft Fabric modpack dev environment (Gradle + Java).

## Other pages

- Live release history is served from the GitHub releases API
  (`src/app/releases/page.tsx`).
- Static content lives in `src/data/` (`config.ts`, `docs.ts`, `navigation.ts`).
- Project documentation is served under `/docs/<slug>` and driven by
  `src/data/docs.ts` (`docsByProject` feeds both the docs index and sidebar).