import type { Project } from "@/types/project";
import { asset } from "@/lib/constants";

export const projects: Project[] = [
  {
    id: "tala",
    slug: "tala",
    name: "Tala",
    tagline: "Pagtatala, made simple.",
    description:
      "A modern note-taking application inspired by the Filipino concept of pagtatala — the act of recording thoughts, ideas, and things worth remembering. Sun by day, moon by night.",
    status: "released",
    version: "1.0.1",
    releaseDate: "2026-08-25",
    platforms: ["windows", "macos"],
    technologies: ["Tauri", "React", "TypeScript", "Vite", "Tiptap", "Zustand", "Dexie"],
    license: "MIT",
    heroImage: asset("/images/tala-liveapp.png"),
    screenshots: [
      {
        src: asset("/images/tala-liveapp.png"),
        alt: "Tala application interface showing note organization and rich text editing with doodle-inspired design",
        caption: "Tala — pagtatala, made simple",
      },
    ],
    features: [
      { name: "Rich text editing with Tiptap", available: true },
      { name: "Handwriting / ink layer", available: true },
      { name: "Six pen presets", available: true },
      { name: "Day and night themes", available: true },
      { name: "Doodle-inspired visual language", available: true },
      { name: "Folder organization", available: true },
      { name: "Colored tags", available: true },
      { name: "Favorites and pinning", available: true },
      { name: "Archive and trash", available: true },
      { name: "Multi-select batch operations", available: true },
      { name: "Instant search", available: true },
      { name: "Command palette", available: true },
      { name: "Templates", available: true },
      { name: "Focus mode", available: true },
      { name: "Export / import backups", available: true },
      { name: "Responsive design", available: true },
    ],
    githubUrl: "https://github.com/E1yWrites/tala",
    documentationUrl: "/docs",
    downloads: {
      windows: {
        available: true,
        url: "https://github.com/E1yWrites/tala/releases",
        version: "1.0.1",
        architecture: "x64",
        fileSize: "4.0 MB",
      },
      macos: {
        available: true,
        url: "https://github.com/E1yWrites/tala/releases",
        version: "1.0.1",
        architecture: "ARM64",
        fileSize: "5.2 MB",
      },
      linux: {
        available: false,
      },
    },
    featured: true,
    story: {
      whyItExists:
        "Tala began as Notely — a straightforward note-taking app. But the project evolved into something more intentional: a product with its own identity, rooted in Filipino language and a hand-drawn visual world. Most note-taking apps feel clinical. Tala feels like writing in a notebook that actually gets you.",
      content:
        "The name comes from pagtatala — the Filipino act of recording things worth remembering. That idea shaped everything: the doodle-inspired interface, the sun and moon theme system, the warm color palette. Built with Tauri v2 and React, Tala stores notes locally in IndexedDB. The editor uses Tiptap for rich text, with a vector ink layer for handwriting. A custom hand-drawn icon set and the Patrick Hand + Kalam fonts give the whole app its personality. Every detail — from the wobbly border radii to the pencil-shadow system — was designed to feel human.",
    },
    changelog: [
      {
        version: "1.0.1",
        date: "2026-08-25",
        current: true,
        added: [
          "Pen tool presets — six named writing styles",
          "Multi-select mode — batch operations across all surfaces",
          "Long-press preview — floating card with metadata and quick actions",
          "Context menu Share action",
          "Grid card context menu",
          "Inline width dots for pen toolbar",
        ],
        fixed: [
          "Pen toolbar width dots skipping index 3",
          "Pen palette tool switching clobbering active preset",
          "Pen toolbar label showing wrong tool",
          "Long-press timer leak on unmount",
          "Multi-select Escape key not exiting mode",
          "Multi-select stale selection on list change",
          "Note preview positioning on mobile",
          "Dropdown menu clipping near viewport edges",
        ],
      },
      {
        version: "1.0.0",
        date: "2026-08-24",
        added: [
          "Rich text editing with Tiptap",
          "Handwriting/ink layer with pen, pencil, highlighter, eraser",
          "Folder and tag organization",
          "Favorites, pinning, archive, and trash",
          "Search across all notes",
          "Multiple view modes",
          "Light / dark / system theme",
          "Export and import JSON backups",
          "Onboarding flow",
          "Focus mode",
          "Global keyboard shortcuts",
          "Command palette",
        ],
      },
    ],
  },
];
