import type { DocSection, DocPage, ProjectDocs } from "@/types/doc";

const talaSections: DocSection[] = [
  {
    slug: "getting-started",
    title: "Getting Started",
    project: "tala",
    content: `Tala is a local-first notebook for typed notes, handwriting and PDF markup. No account is required — your notes are stored on your device and remain private.

## Quick Start

1. Open [tala.lorenzmalabanan.com](https://tala.lorenzmalabanan.com/) in your browser, or download the Windows installer from the [releases page](https://github.com/E1yWrites/tala/releases)
2. On an iPad or phone, add it to your home screen so the browser keeps your notes
3. Follow the short onboarding
4. Start a note, then write, draw or import a PDF

## System Requirements

- **Web:** any modern browser with IndexedDB — iPad Safari and Android Chrome are the main targets
- **Windows:** Windows 10 or later (x64) — installer on the releases page
- **Linux:** build from source with Tauri (AppImage, .deb or .rpm)`,
  },
  {
    slug: "installation",
    title: "Installation",
    project: "tala",
    content: `## Web (iPad, Android, desktop browsers)

Open [tala.lorenzmalabanan.com](https://tala.lorenzmalabanan.com/). Notes stay in your browser's IndexedDB and Tala works offline after the first visit.

- **iPad / iPhone (Safari):** Share → Add to Home Screen. Safari can clear storage for sites that are not installed, so do this before you rely on it.
- **Android (Chrome):** menu → Install app.

## Windows

Download the \`.exe\` installer from the [latest release](https://github.com/E1yWrites/tala/releases/latest) and run it.

\`\`\`
Tala_2.0.0_x64-setup.exe
\`\`\`

For a silent or managed install, use the \`.msi\` package: \`msiexec /i Tala_2.0.0_x64_en-US.msi\`.

## Linux

Build the installers yourself with Tauri — see [Developer Setup](/docs/developer-setup). \`npm run app:build\` produces an AppImage, a \`.deb\` and an \`.rpm\`.

The installers aren't code-signed, so verify the checksum before you run them.

## Verifying Downloads

Each release includes SHA-256 checksums. After downloading:

\`\`\`bash
sha256sum -c SHA256SUMS
\`\`\``,
  },
  {
    slug: "features",
    title: "Features",
    project: "tala",
    content: `## Pages

A note is a stack of pages. Each page owns its typed text and its handwriting. A page strip with thumbnails lets you jump around and drag pages into a new order.

## Typing

Tala uses Tiptap: headings, bullet, ordered and task lists, blockquotes, code blocks, links and images. Tick tasks across your whole library from the Tasks view.

## Handwriting

A vector ink layer sits on top of each page.

- Pinch to zoom and pan; the pen paints with no visible lag
- Pen, pencil, highlighter, eraser and a free-form **lasso** to select, recolour and duplicate strokes
- **Snap to shape** — rest the pen at the end of a stroke and a line, circle, rectangle or triangle replaces it
- Palm rejection while the pen is down, and left-handed mirroring

## PDFs

Import a PDF and Tala keeps the original, rendering pages sharply on demand — also offline. Annotate with ink and export a PDF with the ink drawn as vectors over the original pages.

## Lecture audio

Record while you write. Audio is saved in five-second chunks, so a crash costs seconds, not the lecture. Tap a stroke you drew while recording to hear the audio from just before it.

## Bituin, the study coach

A rule-based mascot that never appears over the page while you write. It tracks a weekly goal (a Study day is five minutes of writing) that never resets your progress, leaves a short wrap-up after a session, and resurfaces notes you haven't opened in a while. Quiet mode silences it.

## Organization

- **Folders** and coloured **tags**
- **Favourites** and pins
- **Archive** and **Trash** with restore
- Instant search across titles and text, and a command palette

## Themes and layout

Light and dark themes, applied before first paint. Three panes on desktop, a drawer on tablet portrait, and a Notes / Tasks / New / Search tab bar on phones.`,
  },
  {
    slug: "keyboard-shortcuts",
    title: "Keyboard Shortcuts",
    project: "tala",
    content: `## Global Shortcuts

| Keys | Action |
| --- | --- |
| \`Ctrl/Command + N\` | New note |
| \`Ctrl/Command + K\` / \`Ctrl/Command + Shift + F\` | Search notes |
| \`Ctrl/Command + Shift + P\` | Command palette |
| \`Ctrl/Command + S\` | Force save |
| \`Ctrl/Command + B\` | Show or hide the sidebar |
| \`Ctrl/Command + Shift + D\` | Toggle dark mode |
| \`Ctrl/Command + ,\` | Settings |
| \`/\` | Focus list search |
| \`Esc\` | Close dialog |

## Editor Shortcuts

Standard Tiptap shortcuts apply: \`Ctrl/Command + B/I/U\` for bold, italic and underline while the cursor is in the text.`,
  },
  {
    slug: "pen-tools",
    title: "Pen Tools",
    project: "tala",
    content: `## Tools

- **Pen, Pencil, Highlighter** — draw vector strokes
- **Eraser** — remove strokes
- **Lasso** — loop around strokes to select them, then recolour or duplicate

## Snap to shape

Rest the pen for about half a second at the end of a stroke and a line, circle or ellipse, rectangle or triangle replaces it. If Tala is not sure what you drew, the stroke is left alone.

## Zoom

Pinch with two fingers (or Ctrl + scroll) to zoom a page. Strokes keep their on-screen thickness and stay sharp at any zoom, because they are vectors.

## Apple Pencil

Browsers do not expose Apple Pencil double-tap or squeeze, so Tala does not offer them.`,
  },
  {
    slug: "exporting",
    title: "Exporting",
    project: "tala",
    content: `## .tala backup

The complete format: a zip with a manifest, your notes, pages, ink, folders, tags and imported PDFs. **Settings → Export backup** saves one; on phones and tablets it opens the share sheet so you can send it to Files or iCloud. Restoring can merge into your library or replace it.

Backups include lecture entries and study days but not the audio itself, to keep the file small and safe to build in memory. Each lecture has its own **Save audio** button.

Older \`.json\` backups (versions 1–3) still import.

## PDF

**Export annotated PDF** writes the original pages with your ink drawn on top as vectors. Typed text is added in plain Helvetica, continuing on extra pages if it is long.`,
  },
  {
    slug: "troubleshooting",
    title: "Troubleshooting",
    project: "tala",
    content: `## Notes not saving

Tala uses autosave with debounce. If notes aren't saving:

1. Check the saved indicator in the editor toolbar
2. Try \`Ctrl+S\` to force save
3. Ensure your browser supports IndexedDB

## Theme flashing on load

The theme is applied by an inline script before React renders. If you see a flash:

1. Clear localStorage and reload
2. Ensure JavaScript is enabled

## Desktop app won't launch

On Linux, ensure the following system libraries are installed:

\`\`\`bash
sudo apt install libwebkit2gtk-4.1-dev build-essential
\`\`\`

## Pen strokes not appearing

Make sure a pen, pencil or highlighter is selected in the pen bar. On touch screens, a finger scrolls the page while an active pen draws.`,
  },
  {
    slug: "faq",
    title: "FAQ",
    project: "tala",
    content: `## Is Tala free?

Yes. Tala is open source under the MIT license.

## Does Tala require an account?

No. Tala is local-first. Your notes stay on your device.

## Can I use Tala on multiple devices?

Not with sync — each install keeps its own local database. Move notes between devices with a \`.tala\` backup.

## Where are my notes stored?

Notes are stored in your browser's IndexedDB (web) or the Tauri webview profile (desktop). Data never leaves your device. On iPad, add Tala to your home screen so Safari doesn't clear it.

## Does Tala use AI?

No. Bituin, the study coach, is a fixed set of rules.

## What happened to Word and PowerPoint import?

Version 1.1.0 had it. Version 2.0.0 was rebuilt around pages and PDFs and did not carry it over.

## Can I contribute?

Yes. Tala is open source on GitHub. Pull requests and issues are welcome.`,
  },
  {
    slug: "developer-setup",
    title: "Developer Setup",
    project: "tala",
    content: `## Prerequisites

- Node.js >= 18
- Rust >= 1.77.2 (for Tauri)
- System libraries for Tauri (Linux only)

## Clone & Install

\`\`\`bash
git clone https://github.com/E1yWrites/tala.git
cd tala
npm install
\`\`\`

## Development

\`\`\`bash
npm run dev        # Start Vite dev server on localhost:5173
npm run build      # Typecheck + production build
npm run preview    # Serve production build on localhost:4173
npm run typecheck  # TypeScript check without emit
npm test           # Vitest: migrations, library write path, backups, canvas math
\`\`\`

## Desktop App (Tauri)

\`\`\`bash
npm run app:dev     # Native window with HMR
npm run app:build   # Build release installers
\`\`\`

## Smoke Test

\`\`\`bash
npm i -D playwright-core
npx playwright-core install chromium --only-shell
npm run preview &
node scripts/smoke.mjs
\`\`\`

## Architecture

The codebase uses a clean separation:

- **Components** — React UI components organized by feature
- **Library** — the only code that writes note data (Dexie/IndexedDB), with optimistic updates and rollback
- **Stores** — Zustand stores for state management
- **Types** — Single source of truth for domain models
- **Utils** — Pure utility functions`,
  },
];

const paradaSections: DocSection[] = [
  {
    slug: "parada-overview",
    title: "Overview",
    project: "parada",
    content: `**PARADA** is a mobile and web-based **smart parking system** for zone-based occupancy detection using **OCR-assisted cameras** — a BS Information Technology capstone at Lyceum of the Philippines University — Batangas.

It helps drivers find space and helps administrators run small-to-medium facilities (about 50–100 spaces across several zones). Instead of a sensor on every slot, PARADA counts vehicles at each zone's gate with standard cameras and plate reading.

## One number

Zone-level availability is the authoritative metric:

\`\`\`
available = capacity − occupied
\`\`\`

Slots exist for layout and inventory only. Nothing on screen implies per-slot detection.

## Four words kept apart

- **Recommendation** — a suggestion only
- **Assignment** — a backend-confirmed zone for a vehicle
- **Reservation** — a capacity hold with a time window
- **Session** — actual parking, driven by the cameras

## Status

Phases 0–14 are complete, including full-system integration and a published accuracy evaluation. Phase 15 (deployment) is under way; Phase 16 (documentation and final review) follows. The [landing page](https://parada.lorenzmalabanan.com/) walks through the whole pipeline.`,
  },
  {
    slug: "parada-architecture",
    title: "Architecture",
    project: "parada",
    content: `## Repository

\`\`\`
parada/
├── apps/
│   ├── mobile/     # driver app — React Native + Expo + TypeScript
│   └── admin/      # admin console — Next.js + TypeScript + Tailwind
├── services/
│   ├── api/        # backend — Node.js + Express + TypeScript
│   └── vision/     # plate reading — Python + FastAPI + OpenCV + EasyOCR
├── packages/
│   ├── database/   # Prisma schema + embedded PostgreSQL for development
│   ├── types/      # shared TypeScript types
│   └── config/     # shared configuration
└── docs/
\`\`\`

npm workspaces and Turborepo tie it together.

## Data flow

\`\`\`
Camera → Vision/OCR → API → Domain → PostgreSQL
Mobile → API → Domain → PostgreSQL
Admin  → Next.js proxy → API → Domain → PostgreSQL
Realtime (SSE) → Admin + Mobile
\`\`\`

- **The backend is the only authority** on what an observation means. Vision reports what it saw over HTTP and never touches the database.
- **Clients render backend state.** Mobile and admin never read the database; the admin reaches the API through a server-side proxy that keeps the JWT in an HttpOnly cookie, and mobile keeps its token in SecureStore.
- **Realtime is delivery only.** Server-Sent Events are published after each transaction commits, sequenced, and recovered on reconnect; polling stays as the fallback.

## Roles

USER and ADMIN, enforced by the backend. Unregistered plates can be admitted as guests under an audited admin override.`,
  },
  {
    slug: "parada-vision",
    title: "Vision & OCR",
    project: "parada",
    content: `## Pipeline

A classical OpenCV plate-region detector (blackhat → Sobel-x → Otsu → close → aspect-ratio contour filter) finds candidate plates; **EasyOCR 1.7.2** reads them on the CPU. Camera sources can be USB, RTSP or a video file. A read counts as trusted at confidence ≥ 0.5.

## Phase 14 evaluation

Measured on a seeded, synthetic dataset — **1,250 images**: 50 plate texts under 23 conditions, plus 100 scenes with no plate. It characterises the pipeline; it is not a production accuracy claim.

| Result | Value |
| --- | --- |
| Exact plate reads (misses count as wrong) | 77.4% (890 / 1,150) |
| Character accuracy on detected plates | 93.76% |
| False plates on empty scenes | 0 / 100 |
| Precision of trusted reads | 85.0% |

| Condition | Exact |
| --- | --- |
| Clean, lighting, sensor noise | 100% |
| Rotation and perspective | 98.5% |
| Gaussian and motion blur | 75.0% |
| Distance | 50.5% |
| Partial occlusion | 33.3% |

Most misreads are truncations — a correct part of the plate read with high confidence — which is why the backend never trusts confidence alone. The full method and failure analysis live in the repository's \`docs/vision/phase14-evaluation.md\`.`,
  },
  {
    slug: "parada-local",
    title: "Run it locally",
    project: "parada",
    content: `## Prerequisites

- **Node.js 18+** and **npm 9+**
- **Python 3.11** — only for the vision service
- No PostgreSQL install and no Docker: \`packages/database\` runs an embedded PostgreSQL cluster for development

## Start

\`\`\`bash
git clone https://github.com/E1yWrites/parada.git
cd parada
npm install
npm run dev   # database + API + admin + mobile
\`\`\`

Copy each package's \`.env.example\` to \`.env\` first, and give the seed its own passwords (\`PARADA_SEED_ADMIN_PASSWORD\`, \`PARADA_SEED_USER_PASSWORD\`).

The vision service runs on its own:

\`\`\`bash
npm run setup -w @parada/vision    # creates the virtualenv
npm run dev -w @parada/vision      # FastAPI on port 8001
npm run camera -w @parada/vision   # camera runtime (USB / RTSP / file)
\`\`\`

## Ports

| Service | Port |
| --- | --- |
| API | \`4100\` |
| Admin web | \`3000\` |
| Vision/OCR | \`8001\` |
| Expo / Metro | \`8082\` |
| Embedded PostgreSQL | \`5442\` |

## Tests

The API and database suites run against real PostgreSQL, not mocks.

\`\`\`bash
npm run db:test:setup -w @parada/database
npm run test
\`\`\``,
  },
  {
    slug: "parada-landing",
    title: "Landing page",
    project: "parada",
    content: `The [PARADA landing page](https://parada.lorenzmalabanan.com/) explains the system for the capstone defense and is honest about status: it shows what is built and marks the phases still under evaluation.

## What's on it

- A pinned **hero** with an interactive scan canvas.
- A horizontal **pipeline** — a 900svh sticky section with nine GSAP-animated SVG scenes: vehicle arrival, camera capture, computer vision + OCR, the API hub, vehicle/user/guest resolution, occupancy + session, mobile + admin, exit, and the fee receipt.
- A **registered-vs-guest** comparison with live plate decoding.
- An **architecture** diagram with looping motion-path packets.

## Run it

\`\`\`bash
git clone https://github.com/E1yWrites/parada-landing.git
cd parada-landing
python3 -m http.server 8080
\`\`\`

It must be served over HTTP; React, Babel, GSAP and fonts load from a CDN. Source: [E1yWrites/parada-landing](https://github.com/E1yWrites/parada-landing).`,
  },
];

export const paradaDocs: DocPage = {
  title: "PARADA Docs",
  description: "Smart parking with OCR-assisted gate cameras.",
  navItems: paradaSections.map((s) => ({ slug: s.slug, title: s.title })),
  sections: paradaSections,
};

export const talaDocs: DocPage = {
  title: "Tala Documentation",
  description: "Everything you need to get started with Tala.",
  navItems: talaSections.map((s) => ({ slug: s.slug, title: s.title })),
  sections: talaSections,
};

export const docsByProject: Record<string, ProjectDocs> = {
  parada: paradaDocs,
  tala: talaDocs,
};

export const allDocSections: DocSection[] = [...paradaSections, ...talaSections];

export function getDocBySlug(slug: string): DocSection | undefined {
  return allDocSections.find((s) => s.slug === slug);
}

export function getAllDocSlugs(): string[] {
  return allDocSections.map((s) => s.slug);
}

export function getDocsByProject(project: string): ProjectDocs | undefined {
  return docsByProject[project];
}

export function getAllProjects(): string[] {
  return Object.keys(docsByProject);
}
