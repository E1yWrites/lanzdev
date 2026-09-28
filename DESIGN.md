# Design — the spec sheet

The site reads like a technical spec sheet for a maker's work: monospace
interface text, a light serif for names and statements, dotted rules, one
accent, and a single tactile object in the hero.

Inspired by the structure of [wildyriftian.com](https://www.wildyriftian.com)
(one object with compass-point labels, project "folders" with tabs, a
spec-card about section). The ideas are borrowed; the object, palette, type
and content are Lorenz.dev's own.

## Tokens (`src/app/globals.css`, `tailwind.config.ts`)

| Token             | Value     | Use                                        |
| ----------------- | --------- | ------------------------------------------ |
| `paper`           | `#0C0C0C` | Page                                       |
| `paper-elevated`  | `#161616` | Menus, palette, raised panels              |
| `ink`             | `#EDEDEA` | Text on dark                               |
| `accent`          | `#FF4C29` | The one colour: eyebrows, markers, one folder |
| `sheet`           | `#EFEEE9` | Light surfaces (folders, spec card)        |
| `sheet-grey`      | `#D3D2CC` | Second light surface                       |
| `on-sheet`        | `#111111` | Text on sheets and on accent               |

Text opacity floors (WCAG AA, 4.5:1): `ink/60` on dark (6.4:1),
`on-sheet/65` on sheet (5.6:1), `on-sheet/85` on accent (4.8:1).

**Type.** Newsreader (light, optical sizing) for titles and statements, in
sentence case. Instrument Sans for reading. JetBrains Mono for interface text
through `.t-label` (11px, uppercase, +0.06em). Kalam, Tala's own handwriting
face, appears once (the About card) and isn't preloaded.

**Shape.** Radius 4 / 6 / 10 / 14px. Surfaces are flat with a 1px hairline:
no blur, glow or drop shadow. Dotted rules (`border-dotted border-ink/30`)
separate sections and cells.

**Motion.** Scroll reveals (12px rise + fade, 600ms), press feedback
(`scale(0.98)`), the hero loop, and the folder ticker. All stop under
`prefers-reduced-motion`; the ticker then wraps instead of clipping.

## Motifs

- `.section-number`: a 6px square, then a mono label, in the accent.
- Project folders (`components/home/WorkFolders.tsx`): sticky from `md` up,
  tabs staggered so every tab stays visible as folders stack.
- Spec card (`components/home/AboutCard.tsx`): binder-hole rails, dotted
  cells, coordinates in the footer row.
- `PageHeader`: eyebrow, `text-display` serif title, lede, mono stats strip.

## Art

Generated with Remotion in [`art/`](art/README.md): the macropad hero loop
(each project is a key), PARADA's parking tile, the Modpack voxels and the
share image. Renders are committed to `public/art/`.

## Dieter Rams audit

Scored against Rams' ten principles of good design, before (commit
`579b679`) and after this redesign.

| # | Principle | Before | After |
|---|-----------|--------|-------|
| 1 | **Innovative** | Trend-driven: a generated "cinematic" hero, glassmorphism, glows. | The hero object *is* the index: each project is a key, pressed in turn. Live GitHub data and OS-aware downloads kept. |
| 2 | **Useful** | Home repeated Tala three times; "How I build" and a closing wordmark did no work; three routes to the same three projects (dropdown, palette, grid). | Home is three things: object, work, person. The dropdown is gone; the projects page is one click away and ⌘K is visible in the nav. |
| 3 | **Aesthetic** | 42 `font-black` uppercase headings, so nothing led. 8 kinds of decorative background, used 22 times. | 0 and 0. Hierarchy comes from the serif/mono contrast and whitespace; colour is the orange folder and small markers. |
| 4 | **Understandable** | Home had **no `<h1>`**. 72 tiny bold tracked labels, many at 3.58:1 (or 2.48:1). | Every page has exactly one `<h1>`. All text pairings pass AA; the labels' minimum is 6.4:1. Active page marked with a square and `aria-current`. |
| 5 | **Unobtrusive** | 77 blur-in reveals, 60s drift, pointer-follow highlights, hover-lift on cards. | 49 plain fade/rise reveals, no pointer effects, no hover lift. The hero loop is silent and slow, and holds still under reduced motion. |
| 6 | **Honest** | The hero implied a physical device; a "Download CV — coming soon" card; a fake 400ms progress bar after every navigation. | Placeholder card and fake loader removed. The About card uses the real portrait. Privacy copy matches what the site stores. |
| 7 | **Long-lasting** | Glass, glow gradients and an AI cinematic render date fast. | Spec-sheet grammar (mono, serif, rules, one accent) is decades old and will stay old. |
| 8 | **Thorough** | No skip link, no share image, no home `<h1>`. | Skip link, Open Graph/Twitter image, ⌘K button, Esc-closable mobile menu, `whitespace-nowrap` coordinates; 14 pages checked at 1440px and 390px with no overflow. |
| 9 | **Environmentally friendly** | A forced 400ms loading overlay on every visit; Inter in six weights; `backdrop-filter` on many surfaces. | Overlay removed. Inter replaced by two variable fonts plus JetBrains Mono; Kalam loads only when used. Blur is on the nav bar only. Home first-load JS: 121 → 114 kB. **Trade-off:** the hero loop is ~450 kB (WebM), versus a 65 kB image before. The poster (41 kB) paints first, with `preload="metadata"`. |
| 10 | **As little design as possible** | 4 surface tiers (30 uses), 4 button variants plus a separate download style, 7 home sections. | Surfaces are flat hairline boxes; buttons share one style function; the home page has 3 sections. `Card`, `TerminalPreview`, `InitialLoader`, `RouteLoader`, `ProjectDropdown` and seven home sections deleted. |

### Still open

- Icons are still Lucide, in a few places (arrows, download, check). They're
  consistent in stroke; swapping the set isn't worth a new dependency yet.
- The hero loop could be served at 720px to halve its weight, at some cost on
  retina screens.
