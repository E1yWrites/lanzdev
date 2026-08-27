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
  featured: false,            // true if this is the hero project
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

To make a project appear as the **Featured Software** on the homepage, set `featured: true`. Only one project should be featured — the rest show in Selected Work.

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
  notely: notelyDocs,
  "my-app": myAppDocs,
};

export const allDocSections: DocSection[] = [...notelySections, ...myAppSections];
```

The docs sidebar automatically renders all keys in `docsByProject`. Adding a new key to the record is enough — no layout changes needed.

## 3. Add an image

Place the image in `public/images/` and reference it with a leading slash (`/images/filename.png`). Next.js serves everything in `public/` at the root.
