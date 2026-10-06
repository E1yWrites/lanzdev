---
name: Lorenz.dev
description: Lanz's house after dark. Every page is a room, lit only by the things in it.
colors:
  paper: "#0D1016"
  paper-elevated: "#161A22"
  ink: "#E8E9EC"
  accent: "#E9673F"
  solar: "#E6B450"
  night: "#181D2C"
  sheet: "#E8EAEE"
  sheet-grey: "#C9CED6"
  on-sheet: "#0D1016"
  plate: "#0B1120"
  plate-lit: "#121A30"
  live: "#3DDC84"
  light-garage: "#F2A54A"
  light-study: "#E6B450"
  light-screening: "#7FB0FF"
  light-about: "#DCE3F0"
  light-front: "#FF9455"
  light-room: "#E9673F"
  light-hall: "#C9CED6"
typography:
  display:
    fontFamily: "Newsreader, Newsreader Fallback, Georgia, serif"
    fontSize: "clamp(3rem, 7vw, 7.5rem)"
    fontWeight: 300
    lineHeight: 0.95
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Newsreader, Newsreader Fallback, Georgia, serif"
    fontSize: "clamp(2.6rem, 4.6vw, 4.75rem)"
    fontWeight: 300
    lineHeight: 0.98
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Newsreader, Newsreader Fallback, Georgia, serif"
    fontSize: "2.4rem"
    fontWeight: 300
    lineHeight: 1
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Instrument Sans, Helvetica Neue, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
  body-small:
    fontFamily: "Instrument Sans, Helvetica Neue, Arial, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0.06em"
  plate:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "clamp(10px, 0.82cqw, 14px)"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.08em"
rounded:
  note: "2px"
  plate: "3px"
  sm: "4px"
  md: "6px"
  lg: "10px"
  tape: "12px"
  xl: "14px"
  card: "18px"
  set: "22px"
  full: "999px"
spacing:
  gutter: "20px"
  gutter-md: "32px"
  gutter-lg: "48px"
  nav: "56px"
  target: "44px"
  container: "1600px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "0 24px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-sheet}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "0 20px"
    height: "48px"
  room-cta:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-sheet}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "0 20px"
    height: "44px"
  room-pin:
    backgroundColor: "{colors.paper-elevated}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: "0 9px"
    height: "28px"
  room-pin-active:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-sheet}"
  room-card:
    backgroundColor: "{colors.paper-elevated}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "24px"
    width: "384px"
  room-tape:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.tape}"
    padding: "13px 14px"
  door-plate:
    backgroundColor: "{colors.plate}"
    textColor: "{colors.ink}"
    typography: "{typography.plate}"
    rounded: "{rounded.plate}"
    padding: "0.5em 0.9em"
  door-plate-lit:
    backgroundColor: "{colors.plate-lit}"
  paper-note:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.on-sheet}"
    rounded: "{rounded.note}"
    padding: "0.8em 1em 0.9em"
  nav-capsule:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    height: "32px"
  vhs-button:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.lg}"
    padding: "0 14px"
    height: "40px"
---

# Design System: Lorenz.dev

## Overview

**Creative North Star: "The House After Dark"**

The site is Lanz's house at night, and every page is a room in it. The home page is two
scenes. First, his room: a hand-built, rounded clay model seen through one long lens,
with the headline painted on its left wall and five objects that act as the index.
Second, the whole house from above with the roof off: five lit rooms off a short hall,
each with an enamel plate over it. You learn the work by walking through it, and every
path ends at the front door marked Say hi.

There is no light that doesn't come from something in the room. The page ground is
midnight paint. Warmth comes from lamps, a monitor, a sodium lamp in the garage, Tala's
brass lamp, the screening room's television and, warmest of all, the open front door.
Interface type is mono, like a stamped plate. Titles are a light, optical-size serif,
like hand lettering on a wall. Reading text, when it needs room to breathe, sits on
paper: a slip pinned under a plate, a card beside an object.

The world was built to avoid one layout: a hero, then a grid of project cards, then a
contact strip. Density is low and the 3D does the talking. Detail waits for hover,
focus or a step through a door.

**Key Characteristics:**
- Two full-screen scenes on desktop, one scroll gesture apiece; the footer scrolls freely after them.
- One accent (ember) for the interface. Each room has its own light colour, used only for that room.
- Procedural 3D, poster first: a transparent render of the same camera paints before WebGL.
- Mono plates and labels, a light Newsreader for titles, Instrument Sans for reading.
- Every internal link is a door that opens in the next room's light.
- Every motion stops under `prefers-reduced-motion`. Phones get stills with real buttons.

## Colors

A midnight ground of cool neutrals, one ember accent for the interface, and a set of
room lights that belong to the house rather than to the UI.

### Primary
- **Ember** (`accent`): the one interface accent. Used for the logo star, the full stop
  after a title, the active nav dot, focus rings (2px outline, 2px offset), text
  selection, pin chips when hovered or picked, the room card's call to action, and
  links' hover colour. It is also Lanz's room light, so a door back to home glows ember.

### Secondary
- **Tala Gold** (`solar`): Tala's colour. It marks Tala's tape stripe and button swatch,
  and is the study's light.

### Neutral

| Token | Name | Role |
| --- | --- | --- |
| `paper` | Midnight Paint | Page ground. Never pure black. |
| `paper-elevated` | Raised Midnight | Room card (96%), pin chips (92%), menus, palette. |
| `ink` | Cool Bone | Text on dark, hairlines at 10–28% alpha, the primary button's fill. |
| `night` | Tala After Dark | Tala's surfaces once her moon is up (project page). |
| `sheet` | Note Paper | The paper note under a door plate; light surfaces on inner pages. |
| `sheet-grey` | Grey Sheet | The hall's light; the grey car and books in the house. |
| `on-sheet` | Printed Ink | Text on paper and on ember. |
| `plate` / `plate-lit` | Enamel / Lit Enamel | A door plate at rest and while you're at its room. |
| `live` | Live Green | The pulsing dot beside "Open to an internship". Status, never decoration. |

All values are space-separated RGB on `:root` in `src/app/globals.css`, composed as
`rgb(var(--token) / alpha)` and exposed as Tailwind colours. `plate`, `plate-lit` and
`live` are literal values in `globals.css`, not variables. The 3D reads the same site
values from `src/three/palette.ts` (`SITE`), next to PARADA's and Tala's brand palettes.

### Room lights (`src/data/house.ts`)

Each room's light colours its door transition, its lamp in the house model, the floor
plan's "you are here" glow, its plate number and the floor wash on hover.

| Token | Room | Page |
| --- | --- | --- |
| `light-garage` | Garage, sodium amber | `/projects/parada` |
| `light-study` | Study, brass gold | `/projects/tala` |
| `light-screening` | Screening room, TV blue | the films (VHS player) |
| `light-about` | About, soft white | `/about` |
| `light-front` | Front door, warm orange | `/contact` |
| `light-room` | Lanz's room, ember | `/` |
| `light-hall` | Hallway, grey | every other page |

### Wall paint (3D only, `src/three/HouseModel.tsx` `PAINT`)

Deep, desaturated paint so the lamps carry the colour: garage `#4a3826`, study
`#4d4020`, screening `#18234f`, about `#566179`, front `#6b3324`, Lanz's room `#29305a`,
hall `#2f3550`, outside walls `#2a2f45`. Floors are dark planks; the front hall is a
checkerboard (`#3a302c` / `#4a3f39`). Moonlight is `#a9b8e6`.

### Named Rules

**The Light Source Rule.** A colour appears where something in the room gives it off: a
lamp, a screen, a door. A room's light is used only for that room and its door. It never
becomes a general UI colour.

**The One Ember Rule.** Ember is the only interface accent. Status green is the one
exception, and only on the availability dot.

**The Contrast Floor Rule.** Muted text stays at or above `ink/60` on `paper` (6.1:1) and
on `paper-elevated` (5.9:1). `on-sheet/75` on `sheet` is 7.8:1, and `on-sheet` on ember
is 5.9:1. Every room light on `plate` is above 8.5:1.

## Typography

**Display Font:** Newsreader, variable with the optical-size axis (fallback: "Newsreader
Fallback", a Times New Roman tuned in `globals.css` with size-adjust 98.91%, ascent 74.31%,
descent 26.79%, so the swap doesn't shift; then Georgia).
**Body Font:** Instrument Sans (with Helvetica Neue, Arial).
**Label/Mono Font:** JetBrains Mono 400 and 500.

**Character:** A light serif with optical sizing reads as lettering painted on a wall.
Mono reads as a stamped plate. The sans is there only to be read.

All three load through `next/font` with `display: swap`. Every heading defaults to
Newsreader 300, line-height 1.05, tracking −0.025em, `text-wrap: balance`. Paragraphs use
`text-wrap: pretty`. Kalam is gone.

### Hierarchy
- **Display** (300, clamp(3rem, 7vw, 7.5rem), 0.95, −0.035em): page titles on inner pages
  (`text-display`). On phones the home h1 is set as type at clamp(2.6rem, 11vw, 4rem); from
  md up it is visually hidden (`sr-only`) because it's painted on the room's wall in
  Newsreader Light.
- **Headline** (300, clamp(2.6rem, 4.6vw, 4.75rem), 0.98, −0.03em): "Have a project in
  mind?" beside the front door. In the footer version it's clamp(3rem, 7vw, 6.5rem).
- **Title** (300, 2.4rem, 1, −0.02em): the room card's title. Phone index labels and tape
  names are the same face at 1.25rem.
- **Body** (400, 16px, 1.6): reading text, held to max-w-sm (24rem) in the invitation.
  Card body is 15px, relaxed. The line under the room is 13px, rising to 15px from 1200px,
  line-height 1.4, max 24rem.
- **Label** (400, 11px, 0.06em, uppercase, `.t-label`): nav, buttons, fact keys,
  availability, "Skip the room", the floor plan caption (10px).
- **Plate** (400, clamp(10px, 0.82cqw, 14px), 0.08em, uppercase): door plates. They size
  from the house stage's own width (container query units).

### Named Rules

**The Painted Title Rule.** Titles are Newsreader 300, which the user confirmed. A title
ends on its own punctuation in ember ("people.", "mind?"). Never set titles bold.

**The Stamped Interface Rule.** Interface text (labels, buttons, plates, keys) is mono,
uppercase and tracked. Sentences people read are never mono, except the short facts on
a paper note.

## Layout

- **Scenes.** From md (768px) up, the home page is a stack of `[data-scene]` sections,
  each `100svh`. `SceneScroll` turns one wheel gesture, swipe, Page or arrow key into one
  scene, with a 650ms easeOutQuart glide and a 30px threshold before a gesture counts as a
  step. Trackpad momentum is swallowed until a fresh gesture starts. Past the last scene
  the page scrolls freely. Touch, reduced motion, open dialogs, form fields and
  `[data-scroll-own]` are left alone.
- **The room.** The stage keeps the poster's 4:3 so percentage-placed pins land on the
  render. From md it's `min(100%, 67.45vw, (100svh − 3.5rem − 8.5rem) × 4/3)`, tucked
  under the transparent nav. Under it is a three-column rule (`1fr auto 1fr`, top hairline
  `ink/10`): the greeting line "Hi, I'm Lanz, …" on the left, "Skip the room ↓" in the
  middle, availability on the right. The greeting lives in that line, not as a kicker.
  On phones the stage is drawn at 125% width (the section clips), with a 2-column index of
  five full buttons under it (52px tall, Showreel spanning both columns).
- **The house.** A 16:9 stage centred and fitted to the screen from md
  (`min(100%, 100svh × 16/9)`). The invitation sits absolutely at lower left beside the
  open front door, `min(30rem, 34vw)` wide. On phones the picture is 156% wide, centred on
  the house, and the invitation follows below it. Plates and hit areas are hidden on
  phones because the room's index above already lists the five rooms.
- **Shell.** A fixed 56px nav (`h-14`), a 1600px max container, gutters of 20 / 32 / 48px
  at base / md / lg. The floor plan sits under the logo, from md up, at
  clamp(72px, 9.9vw, 120px) wide.
- **Breakpoints.** 768px is the real split (live 3D, scene scroll, pins, side cards).
  1024px widens gutters, and 1200px raises the hero line.
- **Targets.** Pins are 44px buttons around a 28px chip. CTAs are at least 44px. The text
  link `.link-underline` pads 11px type out to a 24px target.

## Elevation & Depth

Real depth lives in the 3D: one long lens, a moonlit directional light with soft shadows,
a cool hemisphere fill, and a pool of light on the floor under each lamp. The 2D layer is
flat and tonal. Surfaces separate by alpha steps of `ink` (2.5–8%) and inset 1px hairlines
(`inset 0 0 0 1px`), not by borders that change the box. Soft drop shadows appear only on
things that float over the scene. Nothing has a hard offset shadow.

### Shadow Vocabulary
- **Pin lift** (`inset 0 0 0 1px rgb(ink / .28), 0 4px 14px rgb(0 0 0 / .35)`): a resting
  pin chip over the room.
- **Pin glow** (`0 6px 18px rgb(accent / .35)`): a pin that is hovered, focused or picked.
- **Card float** (`inset 0 0 0 1px rgb(ink / .12), 0 24px 60px rgb(0 0 0 / .5)`): the room
  card beside its object.
- **Pinned paper** (`0 10px 24px -8px rgb(0 0 0 / .7)`): the note under a door plate.
- **Set** (`inset 0 0 0 1px rgb(ink / .1), 0 30px 80px rgb(0 0 0 / .6)`): the VHS set's body.
- **Enamel edge** (`inset 0 0 0 1px rgb(255 255 255 / .14)`, lit: `inset 0 0 0 1px` of the
  room light at 55%): door plates.

### Named Rules

**The Lamp, Not the Shadow Rule.** Emphasis on the scene is light, never lift. A room
you're at turns its lamp up (damped) and washes its floor in its light at 12% (screen
blend). A picked object gets an iris vignette. Neither one moves the object.

**The Crisp Frame Rule.** The room and house stages keep hard edges (`feather={false}`).
Only project models that run off their frame fade over their last 44px (`.stage-feather`).

## Shapes

Rounded, hand-built forms. The 3D is made of bevelled boxes and rods. In the interface:
pills (999px) for anything you press (CTAs, nav capsule, pins, copy), 18px for the room
card (18px 18px 0 0 when it becomes a bottom sheet), 12px for tapes, 10px for VHS buttons
and the phone index (rounded-xl, 14px). The paper itself is nearly square: plates are 3px
and notes 2px, tilted −1.5°. The CRT screen is `16px / 22px` inside a 22px set. The
`.room-tape` has a 6px left stripe in its film's colour (ember for PARADA, gold for Tala),
which the user kept from the approved hero.

## Components

### Buttons
- **Primary (pill):** `ink` fill, `paper` text, mono label, 48px tall, 24px side padding.
  On hover it fills ember with `on-sheet` text (240ms). Used for the email in the
  invitation, and at 32px for Contact in the nav.
- **Ghost:** transparent with an `ink/25` ring, rising to `ink/60` on hover. Used for Copy,
  which reads "Copied" for 1.8s and falls back to `mailto:`.
- **Room CTA:** ember pill, 44px, `on-sheet` text, lifts 1px on hover. With the live room,
  the camera pushes in first and then it navigates. Modifier-clicks go straight through.
- **Magnetic:** the invitation's primary leans toward the pointer (strength 0.35, 450ms
  ease-out).

### Navigation
- **Bar:** fixed, 56px, transparent over the room. After 8px of scroll it becomes
  `paper/85` with backdrop blur and an `ink/10` bottom hairline.
- **Logo:** the L mark with the ember star, then "Lorenz.dev" as a rolling link (an ember
  copy slides up from below). On first load the L draws up (900ms) and the star pops with
  overshoot (1000ms, `cubic-bezier(.34,1.56,.64,1)`). On hover the star turns 180° and
  grows to 1.3×, and the L skews −7°. The user confirmed the star keeps its overshoot.
- **Index capsule:** centred, with an `ink/10` ring. A highlight pill (`ink/8`) slides to
  the hovered link and rests on the current page (420ms ease-out, no animation on first
  paint). The current page gets a 4px ember dot.
- **Right:** Search ⌘K (ghost) and Contact (primary pill).
- **Mobile:** "Menu" / "Close" as a mono label. A full sheet under the bar with numbered
  rows (01–) on dotted `ink/25` rules, titles in Newsreader at 2.25rem, and rows that rise
  in with a 55ms stagger. Esc closes it.

### Room pins (signature)
Numbered chips 01–05 on the room's objects, in tab order: 01 PARADA (monitor), 02 Tala
(notebook), 03 About (portrait), 04 Say hi (the door ajar, the warmest light), 05
Showreel (VHS deck). Hover or focus fills the chip ember and slides the name out (320ms).
Click opens the card and moves the camera there (600ms), dims the room behind an iris,
and sets `?focus=<id>`. Pins hide while a card is open and return 450ms after the camera
comes home. On phones they are `aria-hidden` markers, and the index under the room does
the work.

### Room card (signature)
A native modal `<dialog>`, 24rem wide, beside the object on the side the camera leaves
free. It slides in from that side over 320ms. Inside: a title, one line, fact rows on
dotted rules (mono key, 6rem wide; sans value), and one CTA. For the reel, it shows two
tapes instead. Esc, Close, a click outside, Back or 48px of scroll closes it, and focus
returns to its pin. On phones it becomes a bottom sheet (max 78svh) over a `paper/55`
backdrop.

### VHS player (signature)
A modal CRT: a rounded set, a 16:9 screen with scanlines, a vignette, a tracking band
that wobbles once per tape, and a green-cyan "▶ PLAY" readout with an ember fringe. Below
it are mono controls (tapes with colour swatches, Pause, Sound on, Eject), 40px tall,
with a 10px radius. It opens after the tape slides into the deck (550ms) and starts
muted with Sound on.

### Door plate and paper note (signature)
An enamel plate over each room in the house: number in the room's light · name · status
(`ink/60`, after a "·"). Being at the room (hover or focus) lights its plate edge, turns
its lamp up, washes its floor, and drops a paper note (`sheet`, mono, `on-sheet/75`,
tilted −1.5°) with the stack and "Open … →". The whole room is one link. Focus shows a 2px
ember ring around the plate. Showreel opens the VHS player, and the CRT in the house plays
PARADA's reel muted on loop while the house is on screen.

### Door transition (signature)
Every internal link to another page is a door. A capture-phase click handler takes the
link's own box (the house's rooms pass their floor instead) and grows it to fill the screen
in the destination room's light: clip-path inset to full, 620ms
`cubic-bezier(.16,1,.3,1)`. Then it navigates, and the light fades off over 520ms
(80ms delay). Back mid-walk clears it. A 5s safety clears it if the page never arrives.
Modifier-clicks, new tabs, downloads, same-page anchors, files and reduced motion are
plain navigations.

### Floor plan
A small blueprint SVG of the house: non-scaling 1px `ink/28` strokes, furniture at
`ink/16`, the outline at `ink/45`, the front door cut in `paper`. The current room is filled
with a radial glow and stroked in its own light. Caption: "You are here · <room>".

### Invitation
"Have a project in mind?" as kinetic Newsreader (letters rise in, then lens toward the
pointer), followed by availability, one sentence, the email pill, Copy and "GitHub ↗". On
home it's stacked beside the front door and is the section's h2. Elsewhere it closes the
page above the footer. It's hidden on `/` (the front door says it) and on `/contact`.

### 3D stage (`ModelStage`)
Poster first: a transparent render from the same camera (`art/render.mjs`: Room,
RoomPhone, House, Parada, Tala, ShareImage, plus films). `posterNarrow` swaps in a phone
poster below 768px. The room uses `room-phone.webp`, whose wall is blank because the
headline is set as type there. WebGL mounts near the viewport (700px margin), one scene at
a time in idle time, renders only while visible, and cross-fades over the poster after its
first frame. A loader shows until then, and it gives up after 20s. Reduced motion, no
WebGL or `live={false}` (phones) keep the poster. three.js is prefetched in idle time
after first paint, but never under reduced motion. After changing a colour token,
re-render the posters (`ONLY=Room,RoomPhone,House,Parada,Tala,ShareImage`).

### Films
Two 15s films with sound. PARADA's is its own supplied motion reel. Tala's is rendered
with Remotion from its model, composed at 1280×720 and rendered at 1.5× (1080p). A
near-lossless master is encoded by `art/encode.mjs` to H.264 High CRF 18 + AAC 192k
(served first) and VP9 CRF 31 + Opus 128k, in limited-range BT.709. `useFilmSource` falls
back to the other file if one fails to decode. Muted autoplay always comes with a Sound on
control.

## Do's and Don'ts

### Do:
- **Do** take colour from a light source in the scene. A room's light belongs to that room, its door and its plate number.
- **Do** keep ember as the only interface accent, and end titles on ember punctuation.
- **Do** set plates and labels in uppercase, tracked JetBrains Mono, and titles in Newsreader 300.
- **Do** paint the poster first, from the same camera as the live model, and place overlays (pins, plates, hit areas) with the render's own projection so they land before WebGL.
- **Do** give every 3D affordance a real button or link, 44px targets on phones, and a 2px ember focus ring.
- **Do** make every internal link a door in the next room's light, and end every path one step from Say hi.
- **Do** stop all motion under `prefers-reduced-motion`. Posters stay, scenes scroll natively, and doors become plain navigation.
- **Do** quote PARADA's figures as published (Phase 14, synthetic dataset), never rounded up or presented as field accuracy. Publish email and city only.

### Don't:
- **Don't** fall back to a hero, then a grid of project cards, then a contact strip.
- **Don't** light the scene from nowhere: no gradient washes or glows without a lamp, screen or door behind them.
- **Don't** use pure black for the page, or hard offset shadows anywhere.
- **Don't** feather the room or house stages; keep their frames crisp.
- **Don't** run a film's sound without a visible control, or autoplay anything under reduced motion.
- **Don't** invent proof: no testimonials, clients or endorsements.
