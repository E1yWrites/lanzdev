# Adding a New Project

Every project has two data sources: the project definition and the docs entry.

## 1. Define the project

Add an entry to `src/data/projects.ts`. Follow the existing `Project` type:

```ts
{
  id: "my-app",
  slug: "my-app",
  name: "My App",
  tagline: "One line describing what it does.",
  description: "A longer paragraph used on the projects page.",
  status: "in-progress",       // "released" | "in-progress" | "planned"
  version: "0.1.0",
  releaseDate: "2026-01-01",
  platforms: ["windows", "macos"],
  technologies: ["Tauri", "React", "TypeScript"],
  license: "MIT",
  icon: "/images/my-app-icon.png", // optional square icon for the downloads page
  cover: "/art/my-app.webp", // transparent render of the project's 3D model (see art/README.md)
  model: "my-app",            // optional: a live model in src/three + a scene in src/components/three/scenes.tsx
  tone: "sheet",              // folder colour on the home page: "accent" | "sheet" | "solar"
  role: "What it is · Where it runs",
  surfaces: "Mobile · Web",   // shown as "Runs on" when there are no desktop downloads
  film: { webm: "/art/films/my-app.webm", mp4: "/art/films/my-app.mp4", poster: "/art/films/my-app.jpg", duration: 15 },
  stats: [{ value: "801", label: "Tests passing" }], // numbers count up on scroll
  milestones: [{ id: "1", title: "Phase one", status: "done", date: "2026-01-01" }],
  links: [{ label: "Landing page source", href: "https://github.com/..." }],
  heroImage: "/images/my-app.png",
  screenshots: [
    {
      src: "/images/my-app.png",
      alt: "My App interface",
      caption: "My App — what the caption says",
    },
  ],
  features: [
    { name: "Feature name", available: true },
  ],
  githubUrl: "https://github.com/...",
  documentationUrl: "/docs",  // or a full URL
  downloads: {
    windows: { available: false },
    macos: { available: false },
    linux: { available: false },
  },
  featured: false,            // true for the downloadable app /downloads and /releases lead with
  story: { whyItExists: "...", content: "..." },
  changelog: [
    {
      version: "0.1.0",
      date: "2026-01-01",
      current: true,
      added: ["Initial release"],
    },
  ],
}
```

Place hero/screenshot images in `public/images/` and reference them as `/images/filename.png`.

The order of `projects` is the order on the site (folders on the home page, rows on
/projects). `featured: true` marks the one downloadable app that /downloads and
/releases lead with — only one project should have it.

## 2. Add documentation (optional)

In `src/data/docs.ts`:

1. Create a section array using the `DocSection` type.
2. Add an entry to the `docsByProject` record with a key matching the project slug.
3. Append your sections to `allDocSections`.
4. The slug must be unique across all docs — prefix with the project slug to avoid collisions (e.g. `flux-overview`).

```ts
const myAppSections: DocSection[] = [
  {
    slug: "my-app-overview",   // must be globally unique
    title: "Overview",
    project: "my-app",         // must match the project slug
    content: `Markdown content goes here.`
  },
];

export const myAppDocs: DocPage = {
  title: "My App Docs",
  description: "Docs for My App.",
  navItems: myAppSections.map((s) => ({ slug: s.slug, title: s.title })),
  sections: myAppSections,
};

export const docsByProject: Record<string, ProjectDocs> = {
  parada: paradaDocs,
  tala: talaDocs,
  "my-app": myAppDocs,
};

export const allDocSections: DocSection[] = [...paradaSections, ...talaSections, ...myAppSections];
```

The docs sidebar automatically renders all keys in `docsByProject`. Adding a new key to the record is enough — no layout changes needed.

## 3. Add an image

Place the image in `public/images/` and reference it with a leading slash (`/images/filename.png`). Next.js serves everything in `public/` at the root.
