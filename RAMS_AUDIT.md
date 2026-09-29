# Rams audit — September 2026

Lorenz.dev measured against Dieter Rams' ten principles for good design. For each
principle: what was wrong, what changed, and what's still open. The checks were run in
a browser against the production build (Playwright, 1920×900, 1440×900 and 390×844 touch).

## 1. Good design is innovative

**Holds.** The site index is an object you can use: four keys on a 3D macropad. Each
project is a live model that acts out what the software does, and the films are rendered
from the same models. Nothing to change.

## 2. Good design makes a product useful

**Fixed.** The films are the most direct way to see what PARADA and Tala do, and on some
PCs they wouldn't play: pressing Play flipped straight back to Pause.

- The files were full-range BT.601 video (`yuvj420p`), inherited from Remotion's JPEG
  frames. Phones play that, but some desktop hardware decoders reject it. The films are
  now standard limited-range BT.709 (H.264 High and VP9 profile 0), encoded by
  `art/encode.mjs` as part of every render.
- H.264 is served first. It has the most dependable hardware decoding on PCs; VP9 WebM
  is the fallback.
- A browser never moves on to the next `<source>` after a decode error. The players
  (`useFilmSource`) now switch to the other file themselves and keep playing.
  Verified with a simulated broken decoder: both the showreel and the dialog recover.
- Earlier in this PR: Play is never undone under reduced motion, and a load can no longer
  abort a pending play.

## 3. Good design is aesthetic

**Fixed.** PARADA's folder was full-bleed orange, then stone grey, while Tala sat on a
clean off-white sheet. The two folders read as two different sites.

- Both folders now share one sheet, one panel style and one type scale. Each project's
  colour is carried by a small mark on its tab: PARADA orange, Tala gold.
- When folders stack, a soft shadow on the arriving folder's top edge separates the two
  identical surfaces.
- PARADA's camera is pulled back (`src/three/views.ts`) so the lot has the margin Tala
  has, instead of touching the frame.

## 4. Good design makes a product understandable

**Fixed.** Every interaction had two explanations: a visible hint ("Hover to play · drag
to turn") and a cursor tag saying the same thing. The showreel had a Play button and a
"Play" cursor tag. The duplicate cursor tags are gone. Tags remain only where nothing on
screen explains the interaction: the hero keys and the About colour lens. Hints stay
touch-aware ("Tap a key to open", "Plays on its own").

## 5. Good design is unobtrusive

**Fixed.**
- The orange folder was the loudest thing on the site and hurt to read. It's gone (see 3).
- The technology marquee scrolled forever in the corner of the eye. It's now a still line
  (see 8).
- Motion that remains has a job: the entrance rise, the heading lens, the folder stack
  and the live models. All of it stops under reduced motion.

## 6. Good design is honest

**Holds.** PARADA's figures are quoted as published in its repository (a Phase 14
evaluation on a synthetic dataset, labelled as such). "0 accounts or servers" and "MIT"
are literal. The count-ups end on the real value, and screen readers get the real value
from the start.

## 7. Good design is long-lasting

**Holds.** The design has one accent, a neutral sheet, serif titles and mono labels, with
no trend-dependent effects. The films' look is set by the models' code, not by a
filter.

## 8. Good design is thorough down to the last detail

**Fixed.** Several hard edges, where something was cut off rather than designed:

- **Technology ticker.** It always showed words cut off at both ends ("STGRESQL", "'T
  NATIVE"). It's now a still "Built with" line that wraps, shows up to eight items, then
  "+N". Separators stay with the word before them, so no line starts with a stray dot.
- **3D stage edges.** Anything reaching the canvas edge was cut with a straight line:
  PARADA's road, the arriving car. Stages now fade out over their last 44px on every
  side (`.stage-feather`, on both the poster and the live canvas).
- **Macropad shadow.** It was wider than the frame, so its falloff was cut off at the
  left and bottom. It's now sized to stay inside.
- **Macropad cable.** It ended in mid-air. It now runs on out of frame and fades through
  the feathered edge. The poster and share image were re-rendered to match.

## 9. Good design is environmentally friendly

**Fixed.** The showreel pre-buffered both films as it came near, about 11 MB with H.264,
whether or not anyone watched. Now only the current film buffers ahead, and the next one
loads only while the current one is playing. 3D scenes still mount one at a time, in
idle time, and render only while on screen.

## 10. Good design is as little design as possible

**Improved.** Removed:
- the marquee;
- three duplicate cursor tags;
- the stone tone;
- the ticker animation from the Tailwind config.

**Open:** the hero still presents the index twice, as the macropad and as the list beside
it. This is deliberate: the list is the accessible, keyboard- and touch-friendly version
of the keys, and hovering one lights the other.

## Checks

- `tsc`, `next lint` and `next build` pass.
- The Playwright audit (axe, contrast, headings, tap targets, keyboard, flows) passes
  1,118 of 1,118 checks.
- Films play in every case: native WebM, a simulated broken H.264 decoder, reduced
  motion, a 4 Mbps link, and a browser that refuses to pre-buffer.
