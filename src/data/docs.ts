import type { DocSection, DocPage, ProjectDocs } from "@/types/doc";

const talaSections: DocSection[] = [
  {
    slug: "getting-started",
    title: "Getting Started",
    project: "tala",
    content: `Tala is a local-first note-taking app built with Tauri and React. No account is required — your notes are stored on your device and remain private.

## Quick Start

1. Download Tala from the [releases page](https://github.com/E1yWrites/tala/releases)
2. Install the application for your platform
3. Open Tala and follow the onboarding wizard
4. Start creating notes

## System Requirements

- **Windows:** Windows 10 or later (x64) — installer on the releases page
- **Linux:** build from source with Tauri (AppImage, .deb or .rpm)
- **Web:** any modern browser with IndexedDB — [tala-xi.vercel.app](https://tala-xi.vercel.app/)`,
  },
  {
    slug: "installation",
    title: "Installation",
    project: "tala",
    content: `## Windows

Download the \`.exe\` installer from the [latest release](https://github.com/E1yWrites/tala/releases/latest) and run it.

\`\`\`
Tala_1.1.0_x64-setup.exe
\`\`\`

For a silent or managed install, use the \`.msi\` package: \`msiexec /i Tala_1.1.0_x64_en-US.msi\`.

## Linux

Build the installers yourself with Tauri — see [Developer Setup](/docs/developer-setup). \`npm run app:build\` produces an AppImage, a \`.deb\` and an \`.rpm\`.

## Web

Open [tala-xi.vercel.app](https://tala-xi.vercel.app/). Notes stay in your browser's IndexedDB.

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
    content: `## Rich Text Editing

Tala uses Tiptap for a fast, responsive editing experience. Supported formatting includes:

- Headings (H1, H2, H3)
- Bullet, ordered, and task lists
- Blockquotes
- Code blocks with syntax copy
- Links and images (upload, paste, or drag)
- Inline markdown shortcuts
- Word count and save indicator

## Handwriting & Ink Layer

A vector-based drawing layer sits on top of the editor. Draw with:

- Pen, Pencil, Highlighter, Eraser and Lasso
- Six named presets: Marker, Brush Pen, Ballpoint, Pencil, Fine Pencil, Highlighter
- Colours, six sizes and per-stroke opacity for pencil and highlighter
- **Gestures** — hold the pen still to turn a stroke into a straight line, arrow, circle, rectangle, triangle or polygon; scribble over ink to erase it
- **Editable shapes** — recognised shapes get resize and rotate handles, outline width and fill
- **Apple Pencil & stylus** — pressure, tilt shading, a hover ring and palm rejection

## Documents

Import PDF, Word (.docx) and PowerPoint (.pptx) files as notes. PDFs open as a page stack you can zoom, reorder, rotate, annotate with ink and text, and export again with the annotations baked in. Word and PowerPoint files become editable text when the conversion is faithful, or a preserved-layout view when it isn't. Legacy .doc and .ppt files are kept as attachments.

## Organization

- **Folders** — hierarchical note organization
- **Tags** — colored labels for cross-cutting categorization
- **Favorites & Pins** — quick access to important notes
- **Archive** — soft archive with one-keystroke restore
- **Trash** — soft delete with restore capability

## Templates

Eight built-in templates: Lecture Notes, Meeting Notes, To-Do List, Project Planning, Daily Journal, Study Notes, Brain Dump, Code Notes.

## Search

Instant client-side search across titles, body text, tags, and folders. Results update per keystroke with match highlighting.

## Command Palette

Press \`Ctrl+Shift+P\` to open the command palette for quick navigation and actions.

## Focus Mode

Collapse the sidebar and note list to show only the editor for distraction-free writing.

## Themes

Light ("sunlight") and dark ("moonlight") themes with a hand-drawn visual identity. Applied before React renders to prevent flash.

## Responsive Design

Three-pane desktop layout, drawer sidebar on tablet, single-pane with bottom navigation on mobile.`,
  },
  {
    slug: "keyboard-shortcuts",
    title: "Keyboard Shortcuts",
    project: "tala",
    content: `## Global Shortcuts

| Keys | Action |
| --- | --- |
| \`Ctrl/Command + N\` / \`Alt + N\` | New note (template picker) |
| \`Ctrl/Command + K\` / \`Ctrl/Command + Shift + F\` | Search notes |
| \`Ctrl/Command + Shift + P\` | Command palette |
| \`Ctrl/Command + S\` | Force save |
| \`Ctrl/Command + Shift + D\` | Toggle dark mode |
| \`Ctrl/Command + ,\` | Settings |
| \`/\` | Focus list search |
| \`Ctrl/Command + .\` | Toggle drawing in the open note |
| \`Esc\` | Close dialog / exit focus mode / exit multi-select / stop drawing |

## Editor Shortcuts

| Keys | Action |
| --- | --- |
| \`Ctrl/Command + B\` | Bold |
| \`Ctrl/Command + I\` | Italic |
| \`Ctrl/Command + U\` | Underline |
| \`Ctrl/Command + E\` | Inline code |

## Drawing Shortcuts

| Keys | Action |
| --- | --- |
| \`1\` / \`2\` / \`3\` | Pen / pencil / highlighter |
| \`E\` · \`L\` | Eraser · lasso |
| \`[\` / \`]\` | Thinner / thicker stroke |
| \`Ctrl + C\` / \`X\` / \`V\` / \`D\` | Copy / cut / paste / duplicate selected ink |`,
  },
  {
    slug: "pen-tools",
    title: "Pen Tools",
    project: "tala",
    content: `## The Draw popover

Every handwriting control lives in one anchored panel: tools, style presets, colours, six sizes, opacity, eraser mode, recently used combinations and stylus settings. Right-click the canvas to open it at the cursor.

## Pen Presets

Six named writing styles:

1. **Marker** — bold, high-contrast strokes
2. **Brush Pen** — variable-width calligraphic strokes
3. **Pencil** — medium-weight sketching
4. **Fine Pencil** — thin, precise lines
5. **Highlighter** — semi-transparent overlay
6. **Ballpoint** — consistent thin strokes

## Stroke Widths

Six width levels from Hairline to Marker. Select using the inline dot indicators in the toolbar.

## Colors

Ten preset ink colors: Black, Dark Gray, Red, Orange, Yellow, Green, Blue, Purple, Pink, White. A custom color picker is also available.

## Tools

- **Pen, Pencil, Highlighter** — draw vector strokes
- **Eraser** — remove strokes
- **Lasso** — loop around strokes to select them, then duplicate, copy, cut, rotate or recolour

All strokes are vector-based and scale losslessly at any zoom level.`,
  },
  {
    slug: "exporting",
    title: "Exporting",
    project: "tala",
    content: `## Tala packages (.zip)

The complete format. **Share → Tala package** exports one note with its handwriting, documents and annotations; **Settings → Export library** exports everything.

Import checks the manifest, entry paths, referenced files and SHA-256 hashes before writing anything, and never overwrites a local note unless you choose to — keep both, replace or skip.

## JSON backup (legacy)

Text only: notes, folders, tags and settings, without imported documents. Import it in **Merge** mode (alongside existing notes) or **Replace** mode.`,
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

Turn drawing on for the open note with the Draw control in the header, or press \`Ctrl + .\`. On touch screens, check the "finger draws or scrolls" setting in the Draw popover.`,
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

Not with sync — each install keeps its own local database. Move notes between devices with a Tala package (.zip), which carries handwriting and documents too.

## Where are my notes stored?

Notes are stored in your browser's IndexedDB (web) or the Tauri webview profile (desktop). Data never leaves your device.

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
npm test           # Vitest: lists, documents, gestures, packages
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
- **Database** — Dexie schema with a repository pattern (swappable for REST)
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

Phases 0–14 are complete, including full-system integration and a published accuracy evaluation. Phase 15 (deployment) is under way; Phase 16 (documentation and final review) follows. The [landing page](https://parada-landing.vercel.app/) walks through the whole pipeline.`,
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
    content: `The [PARADA landing page](https://parada-landing.vercel.app/) explains the system for the capstone defense and is honest about status: it shows what is built and marks the phases still under evaluation.

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
