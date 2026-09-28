# Design — the spec sheet, in motion

The site reads like a technical spec sheet for a maker's work (monospace interface
text, a light serif for names, dotted rules, one accent), and then it moves: each
project is a small 3D object you can play with, the type reacts to the pointer, and
two 15-second films show the projects doing what they do.

Structure borrowed from [wildyriftian.com](https://www.wildyriftian.com) (an object
in the hero, project "folders" with tabs, a spec-card about section). The objects,
palette, type, motion and content are Lorenz.dev's own.

## Tokens (`src/app/globals.css`, `tailwind.config.ts`)

| Token             | Value     | Use                                            |
| ----------------- | --------- | ---------------------------------------------- |
| `paper`           | `#0C0C0C` | Page                                           |
| `paper-elevated`  | `#161616` | Menus, palette, raised panels                  |
| `ink`             | `#EDEDEA` | Text on dark                                   |
| `accent`          | `#FF4C29` | The accent: eyebrows, markers, PARADA's folder |
| `solar`           | `#E8B84A` | Tala's gold (keycap, pencil, notebook)         |
| `sheet`           | `#EFEEE9` | Light surfaces (Tala's folder, spec card)      |
| `sheet-grey`      | `#D3D2CC` | Second light surface                           |
| `on-sheet`        | `#111111` | Text on sheets and on accent                   |

Text opacity floors (WCAG AA, 4.5:1): `ink/60` on dark (6.4:1), `on-sheet/65` on
sheet (5.6:1), `on-sheet/85` on accent (4.8:1).

**Type.** Newsreader (variable weight + optical size) for titles; Instrument Sans for
reading; JetBrains Mono for interface text via `.t-label`. Kalam appears once (the
About card) and isn't preloaded.

**Mark.** An L cut at a slant like a pen nib, and a four-point star — "tala" is
Filipino for star (`src/components/brand/`). It's the favicon (`src/app/favicon.ico`,
`icon.svg`, `apple-icon.png`), sits in the nav and footer, draws itself in on load,
and the star turns over on hover.

## Motion system

Every moving thing has one job, and all of it stops under `prefers-reduced-motion`.

| Piece | Where | What it does |
| --- | --- | --- |
| **Macropad** (live 3D) | Home hero | The site index as an object: four keys → PARADA, Tala, About, Say hi. Hover a key and it dips and glows and the OLED reads out where it goes; click to open. The pad leans toward the pointer, and the knob turns with the scroll. The list of links beside it is the same index — hovering either lights the other. |
| **PARADA lot** (live 3D) | PARADA folder + page | Hover and the story plays: the waiting car's plate is read, the barrier lifts, it parks, **Zone A drops from 12 to 11 free**, a new car arrives. Drag to turn. |
| **Tala desk** (live 3D) | Tala folder + page | Hover and the pencil writes *tala* in cursive; click (or the Day/Night chip) to flip the sun to the moon. Drag to turn. |
| **Films** (Remotion, 15 s each) | Showreel, film dialog, project pages | Rendered from the same models: PARADA's gate-to-zone pipeline and Tala's writing / day-to-night / v1.1.0 features. Play while on screen, hand over like stories. |
| **Kinetic type** | Hero and every page title | Letters rise in when on screen; near the pointer the variable weight thickens and letters lift. |
| **Velocity marquee** | Under the hero | Drifts on its own, speeds up and leans with scroll velocity, reverses on the way back up. |
| **Cursor ring** | Mouse/trackpad only | Trails the pointer; grows over links; shows a label ("Open", "Play", "Drag · hover to play") over things that do something. The system cursor stays. |
| **Magnetic buttons, rolling links, filling rows, tilting card, colour lens** | Throughout | Small hover rewards that confirm what's interactive. |
| **Scroll progress, page rise, count-ups, roadmap track** | Throughout | Orientation: how far down, which page arrived, which numbers matter. |

### How the 3D works

- **One model, two drivers.** `src/three/*` are procedural models — keycaps, a
  knurled knob, a coiled cable, extruded car profiles, PARADA's ribbon "P", a page
  block that curves into its spine, a handwriting tube, a crescent traced from two
  arcs — and each is a pure function of its props. `src/components/three/scenes.tsx`
  drives them from pointer, hover and time; `art/` drives them from the frame number.
- **Poster first.** `ModelStage` paints a transparent render of the same model and
  camera (`src/three/views.ts`), mounts the WebGL scene when the stage nears the
  viewport — one at a time, in idle time — renders only while visible, and cross-fades
  over the poster once it has drawn. Reduced motion or no WebGL: the poster stays.
- **Weight.** Home first-load JS is 124 kB. three.js and the scenes (~215 kB gzipped)
  load lazily after first paint and never under reduced motion. The films are
  1.3–2 MB each and only download when played or on screen (`preload="none"` until
  then; H.264 first, VP9 as fallback).

## Motifs

- `.section-number`: a 6px square, then a mono label, in the accent.
- Project folders (`components/home/WorkFolders.tsx`): one screen tall from `md` up,
  sticky, tabs staggered so every tab stays visible as folders stack.
- Spec card (`components/home/AboutCard.tsx`): binder-hole rails, dotted cells,
  coordinates in the footer row; it tilts toward the pointer.
- Roadmap (`components/project/Roadmap.tsx`): PARADA's 17 phases as one track, dated
  from the repository history.

## Content

- Projects follow the repositories: PARADA (01) and Tala (02), in that order.
  `parada-landing` is PARADA's landing page, not a separate project; Modpack is gone.
- PARADA's numbers are quoted as published in its repo (Phase 14 evaluation on a
  synthetic dataset — never rounded up, never presented as field accuracy).
- Personal details come from the résumé; the site publishes email and city only.

## Checks

`tsc --noEmit`, `next lint` and `next build` pass. Browser checks (Playwright, 1440 px
and 390 px): one `<h1>` per page, no nested interactive elements, no horizontal
overflow, no images without `alt`, no canvases under reduced motion, no console errors.
Interactions verified: 3D key hover lights its link and a click navigates; film dialog
opens and closes on Esc; Tala's day/night toggle; showreel tabs; command palette;
`/projects/parada-landing` redirects to `/projects/parada`; mobile menu opens and
closes on Esc; no cursor ring on touch.
