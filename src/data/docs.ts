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

- **Windows:** Windows 10 or later (x64)
- **macOS:** Apple Silicon (ARM64)
- **Web:** Any modern browser with IndexedDB support`,
  },
  {
    slug: "installation",
    title: "Installation",
    project: "tala",
    content: `## Windows

Download the \`.exe\` installer from the latest release and run it.

\`\`\`
Tala_1.0.1_x64-setup.exe
\`\`\`

Alternatively, download the \`.msi\` package for silent installation.

## macOS

Download the \`.dmg\` file for Apple Silicon.

\`\`\`
Tala_1.0.1_aarch64.dmg
\`\`\`

Open the DMG and drag Tala to your Applications folder.

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

- Pen, Pencil, Highlighter, Eraser, Selection tool
- Six named presets: Marker, Brush Pen, Pencil, Fine Pencil, Highlighter, Ballpoint
- Ten ink colors
- Six stroke widths

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
| \`Esc\` | Close dialog / exit focus mode / exit multi-select |

## Editor Shortcuts

| Keys | Action |
| --- | --- |
| \`Ctrl/Command + B\` | Bold |
| \`Ctrl/Command + I\` | Italic |
| \`Ctrl/Command + U\` | Underline |
| \`Ctrl/Command + E\` | Inline code |`,
  },
  {
    slug: "pen-tools",
    title: "Pen Tools",
    project: "tala",
    content: `## Pen Presets

Six named writing styles are available in the pen toolbar:

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

- **Pen** — draw vector strokes
- **Eraser** — remove strokes
- **Select** — move and transform strokes

All strokes are vector-based and scale losslessly at any zoom level.`,
  },
  {
    slug: "exporting",
    title: "Exporting",
    project: "tala",
    content: `## JSON Backup

Export all notes, folders, tags, and settings as a single JSON file.

1. Open Settings
2. Navigate to Data
3. Click Export

The backup includes SHA-256 verification for integrity checking.

## Import

Import a JSON backup to restore notes. Two modes:

- **Merge** — adds imported notes alongside existing ones
- **Replace** — replaces all data with the backup

Import includes referential repair for broken folder and tag references.`,
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

Ensure the ink layer is toggled on in the editor. The ink layer toggle is in the editor toolbar.`,
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

Currently, Tala does not support cross-device sync. Each instance maintains its own local database. You can transfer notes using JSON export/import.

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
    project: "parada-landing",
    content: `## What is PARADA?

**PARADA** is a mobile and web-based **smart parking management system** that detects zone-based occupancy using OCR-assisted cameras. This landing page is a faithful 1:1 reproduction of the original design file — a marketing showcase built for the capstone defense at Lyceum of the Philippines University — Batangas (BS Information Technology program).

The page intentionally reflects the honest status of the project: the implemented features are shown alongside the OCR / computer-vision phases that are still under evaluation.

## Live preview

A [live demo](https://parada-landing.vercel.app/#demo) is deployed to Vercel and can be previewed directly from the portfolio.`,
  },
  {
    slug: "parada-runtime",
    title: "Runtime & Scripts",
    project: "parada-landing",
    content: `The page uses a small component runtime and must be served over HTTP (fetch/relative files). On first load it pulls React, Babel, GSAP and fonts from a CDN.

## Run locally

\`\`\`bash
python3 -m http.server 8080
# open http://localhost:8080
\`\`\`

## Files

- \`index.html\` — the full landing page (the design file copied verbatim)
- \`support.js\` — dc-runtime boot (auto-loads React/Babel and mounts the page)
- \`image-slot.js\` — \`<image-slot>\` placeholder custom element`,
  },
  {
    slug: "parada-animations",
    title: "Animations",
    project: "parada-landing",
    content: `Every animation is reproduced exactly as designed:

- Pinned **hero** with an interactive scan-canvas, poster auto-fit, and word/atom reveal.
- A horizontal cinematic **pipeline** (a 900svh sticky section) with nine individually-animated SVG scenes driven by GSAP \`MotionPathPlugin\` — vehicle arrival, camera capture, computer-vision + OCR, the PARADA API hub, vehicle/user/guest resolution, occupancy + session, mobile + admin, exit, and fee receipt.
- The animated **registered-vs-guest** compare flow with live plate decoding and policy pulses.
- The **architecture pipeline** SVG with looping motion-path packets.
- Zone-occupancy cards, module cards, config/stack/status grids, admin dashboard, and security rules.`,
  },
  {
    slug: "parada-related",
    title: "Related",
    project: "parada-landing",
    content: `Source code and architecture live in the companion repository: [E1yWrites/parada](https://github.com/E1yWrites/parada).

This repo is the standalone landing page at [E1yWrites/parada-landing](https://github.com/E1yWrites/parada-landing).`,
  },
];

export const paradaDocs: DocPage = {
  title: "PARADA Landing Docs",
  description: "Smart parking capstone — landing page details.",
  navItems: paradaSections.map((s) => ({ slug: s.slug, title: s.title })),
  sections: paradaSections,
};

const modpackSections: DocSection[] = [
  {
    slug: "modpack-overview",
    title: "Overview",
    project: "modpack-development",
    content: `## Modpack Development

A modern **Minecraft Fabric modpack development environment** with Gradle, a complete project structure, and git integration. It ships with:

- A Java main entry point (\`FabricModMain.java\`)
- Client-side hook scaffolding (\`FabricModClient.java\`)
- Fabric mod metadata (\`fabric.mod.json\`)
- Mixin configuration (\`fabricmod.mixins.json\`)`,
  },
  {
    slug: "modpack-setup",
    title: "Setup",
    project: "modpack-development",
    content: `## Prerequisites

- **Java 17 or higher**
- **Git**

## Initial setup

\`\`\`bash
git clone <your-repo-url>
cd Minecraft\ Mods

# Build (downloads dependencies automatically)
./gradlew build      # macOS/Linux
gradlew build        # Windows

# Run in development environment
./gradlew runClient  # macOS/Linux
gradlew runClient    # Windows
\`\`\``,
  },
  {
    slug: "modpack-structure",
    title: "Project Structure",
    project: "modpack-development",
    content: `\`\`\`
fabric-modpack/
├── gradle/
│   └── wrapper/
│       ├── gradle-wrapper.jar
│       └── gradle-wrapper.properties
├── src/
│   └── main/
│       ├── java/
│       │   └── com/example/fabricmod/
│       │       ├── FabricModMain.java
│       │       └── client/
│       │           └── FabricModClient.java
│       └── resources/
│           ├── fabric.mod.json
│           └── fabricmod.mixins.json
└── build.gradle
\`\`\``,
  },
];

export const modpackDocs: DocPage = {
  title: "Modpack Development Docs",
  description: "Minecraft Fabric modpack development environment.",
  navItems: modpackSections.map((s) => ({ slug: s.slug, title: s.title })),
  sections: modpackSections,
};

export const talaDocs: DocPage = {
  title: "Tala Documentation",
  description: "Everything you need to get started with Tala.",
  navItems: talaSections.map((s) => ({ slug: s.slug, title: s.title })),
  sections: talaSections,
};

export const docsByProject: Record<string, ProjectDocs> = {
  tala: talaDocs,
  "parada-landing": paradaDocs,
  "modpack-development": modpackDocs,
};

export const allDocSections: DocSection[] = [
  ...talaSections,
  ...paradaSections,
  ...modpackSections,
];

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
