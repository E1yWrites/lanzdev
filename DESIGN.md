# Design — the spec sheet, in motion

The site reads like a technical spec sheet for a maker's work (monospace interface
text, a light serif for names, dotted rules, one accent), and then it moves: each
project is a small 3D object you can play with, the type reacts to the pointer, and
two 15-second films show the projects doing what they do.

Structure borrowed from [wildyriftian.com](https://www.wildyriftian.com) (an object
in the hero, project "folders" with tabs, a spec-card about section). The objects,
palette, type, motion and content are Lorenz.dev's own.

## Tokens (`src/app/globals.css`, `tailwind.config.ts`)

The palette is borrowed from the projects themselves: PARADA's navy and sunset, Tala's
gold and night sky. One accent, cool neutrals throughout (no warm/cool mixing).

| Token             | Value     | Use                                            |
| ----------------- | --------- | ---------------------------------------------- |
| `paper`           | `#0D1016` | Page (midnight, never pure black)              |
| `paper-elevated`  | `#161A22` | Menus, palette, raised panels                  |
| `ink`             | `#E8E9EC` | Text on dark (cool bone)                       |
| `accent`          | `#E9673F` | Ember, the one accent: markers, links in hover |
| `solar`           | `#E6B450` | Tala's gold (keycap, pencil, notebook)         |
| `night`           | `#181D2C` | Tala's folder after its moon comes up          |
| `sheet`           | `#E8EAEE` | Light surfaces (folders, spec card)            |
| `sheet-grey`      | `#C9CED6` | Second light surface                           |
| `on-sheet`        | `#0D1016` | Text on sheets and on accent                   |

The 3D models read the same values from `src/three/palette.ts`; after changing a
token, re-render the posters (`art/`, `ONLY=Macropad,Parada,Tala,ShareImage`).

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
| **Macropad** (live 3D) | Home hero | The site index as an object, centred under a one-line headline: four keys → PARADA, Tala, About, Say hi. Hover a key and it dips and glows, the OLED reads out where it goes, and the readout under the pad introduces it (with no key under the pointer it introduces Lanz); click to open. A row of four keycap buttons is the same index for touch and keyboard, and hovering either lights the other. The pad leans toward the pointer, and the knob turns with the scroll. |
| **PARADA lot** (live 3D) | PARADA folder + page | Hover and the story plays: the waiting car's plate is read, the barrier lifts, it parks, **Zone A drops from 12 to 11 free**, a new car arrives. Drag to turn. |
| **Tala desk** (live 3D) | Tala folder + page | Hover and the pencil writes *tala* in cursive; click (or the Day/Night chip) to flip the sun to the moon, and the whole folder (sheet, tab, text, buttons) eases to `night` with it. Drag to turn. |
| **Films** (15 s each, 1080p, with sound) | Showreel, film dialog, project pages | PARADA's is its own motion reel: the problem ("Still circling."), the zone picker, Lottie the attendant, the gate camera reading a plate, and one gate event on the driver app and the admin console. Tala's is rendered with Remotion from its 3D model: writing, day to night, and the v1.1.0 features. They buffer before they're on screen and start once they can play through. Auto-play only ever starts a film; only you (or scrolling away) pause it, so Play always sticks, including with reduced motion, where nothing starts on its own. A browser that won't pre-buffer (data saver, iOS, a slow link) gets them after 2.5 s anyway, with the loader covering any stall. H.264 is served first (the most dependable hardware decoding on PCs), VP9 WebM second, and if a file fails to decode the player switches to the other one and keeps going (`useFilmSource`). The showreel buffers only the current film, and the next while it plays. It plays muted (browser policy) with a **Sound on** toggle; the dialog and project pages play with sound. |
| **Soundtracks** | In the films | PARADA's reel brings its own. Tala's is synthesised from scratch (`art/audio/compose.py`, no samples or licences): a music bed plus effects cued to the frame — pencil strokes, a dusk sparkle, a pop per feature chip. |
| **Folder stack** | Home | Each project folder pins under the nav, **holds** for a beat, then the next slides over it while the covered one dims and eases back. Stop scrolling just short of a folder on the way down and it glides the last few pixels into line. It never pulls backwards, so wheels and trackpads scroll freely; CSS scroll-snap was dropped because each wheel notch landed inside its range and snapped back. A folder taller than the screen pins by its bottom edge, so nothing is hidden. Every folder shares one clean sheet, and a soft shadow on the arriving folder's top edge separates the two. The reading text sits on a soft white panel, and each project's colour lives in a small mark on its tab. |
| **Kinetic type** | Hero and every page title | Letters rise into place when on screen. Once settled, the heading becomes a lens: letters near the pointer grow (up to 1.2×) and spread apart. It's transform-only, with no weight change, so nothing reflows or re-wraps. The line masks come off after the entrance, so an enlarged letter is never clipped. Mouse only. |
| **Velocity marquee** | Under the hero | Drifts on its own, speeds up and leans with scroll velocity, reverses on the way back up. |
| **Cursor ring** | Mouse/trackpad only | A small hollow ring that trails the pointer and turns accent over links. Labels ("Open parada", "Colour") appear only where nothing else on screen explains the interaction — the hero keys and the About colour lens — in a small tag beside the pointer. Where a visible hint or button already says it, the ring stays quiet. The system cursor stays. |
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
- **No hard edges.** Every stage fades out over its last 44px (`.stage-feather`, on
  poster and canvas alike), so a road, a car or a cable that runs off the frame
  dissolves instead of being cut. Shadows are sized to stay inside the frame.
- **Weight.** Home first-load JS is 124 kB. three.js and the scenes (~215 kB gzipped)
  are prefetched in idle time after first paint (never under reduced motion), with a
  "Loading 3D" tag over the poster until the live model has drawn. The films are
  1080p with audio in standard limited-range BT.709 (`art/encode.mjs`): about 5–6 MB
  as H.264/AAC (served first) and 3–3.5 MB as VP9/Opus. They only start downloading as
  they near the screen.

## Motifs

- `.section-number`: a 6px square, then a mono label, in the accent.
- Project folders (`components/home/WorkFolders.tsx`): one screen tall from `md` up,
  sticky, tabs set edge to edge so every tab stays visible as folders stack. Each tab
  has rounded corners and curved shoulders that flow into its sheet, and neighbouring
  tabs share a shoulder, so the row has no gaps or wedges. A covered folder's tab dims
  with its sheet (the same mix toward `paper`); nothing scales, so tabs never drift out
  of line. The stack is a
  still "Built with" line (up to eight, then "+N"), never a marquee.
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

`tsc --noEmit`, `next lint` and `next build` pass. A Playwright audit runs against the
production build at 1440 px and 390 px (touch), about 1,100 checks, all passing:

- **Every page:** axe-core with no serious or critical violations, and text contrast
  at or above AA. One `<h1>` per page, with headings in order. A meta description of
  real length. No horizontal overflow, broken images, missing `alt`, nested
  interactive elements or duplicate ids. Tap targets of at least 24 px on phones. No
  console errors or failed requests.
- **Keyboard:** the skip link comes first. Every focus stop shows the accent ring, and
  focus never sticks. Ctrl+K opens the palette.
- **Type:** kinetic letters settle inside their masks, with no clipped glyphs, and
  keep one weight under the pointer.
- **Folders:** each folder snaps flush under the nav, holds, and dims as the next one
  covers it. Its call to action stays visible while pinned (1440×900 and 1366×768).
- **Macropad:** hovering a key never flickers (0 hover flips while the pointer is still),
  and a click navigates.
- **Films:** the showreel autoplays muted once it can play through, Sound on unmutes
  it, the tabs keep sound on, and Pause works. The dialog and project films are
  buffered by the time they are on screen.
- **Phone:** there's no cursor ring. The menu opens, navigates and closes, and the hero
  hint reads "Tap a key".
