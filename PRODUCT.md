# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: people deciding on an internship — hiring managers, recruiters and faculty —
who give the site about a minute to answer "can this student build and ship real
software, and how do I reach him?". Secondary: people curious about PARADA or Tala who
arrive from a link.

## Product Purpose

Lorenz.dev (lorenzmalabanan.com) is the portfolio of Lorenz "Lanz" Malabanan, a
3rd-year BSIT student at LPU-Batangas. It shows two real projects working — PARADA
(smart parking, capstone, in progress) and Tala (a released notes app for Windows and
the web) — and turns interest into contact. Success is an email about an internship
or a project.

## Positioning

The projects are shown doing what they do, not described: live 3D models that act out
each product, and two 15-second films. The home page is Lanz's own room at night, and
the room is the site's index.

## Capabilities and Constraints

- Next.js 14 (App Router, Vercel ISR), React 18, TypeScript, Tailwind 3, three.js with
  @react-three/fiber, GSAP; Remotion in `art/` renders posters and films.
- 3D is procedural (no downloaded models); posters paint first, WebGL swaps in.
- Phones (< 768 px) get the room as a still image with tap targets; reduced motion and
  no-WebGL keep the still.
- Must stay: the two 15-second films (PARADA's motion reel, Tala's Remotion film).
  Everything else below the hero room is open to change.

## Brand Commitments

- Name and mark: Lorenz.dev; an L cut like a pen nib and a four-point star ("tala" is
  Filipino for star).
- Line: "Software for curious people." Greeting: "Hi, I'm Lanz · Batangas, PH".
- Voice: plain, short, specific; no hype.
- Availability line: "Open to an internship".

## Evidence on Hand

- PARADA: repository, roadmap (17 phases), Phase 14 evaluation figures on a synthetic
  dataset (quote as published, never as field accuracy), its motion reel.
- Tala: v1.1.0 release, downloads, docs, source (MIT), its film.
- Résumé facts in `src/data/config.ts`: BSIT LPU-Batangas, INSECOM 2025 finalist,
  Visual Graphic Design NC III, Cisco CCNA 1–3 training, student-org roles.
- Portrait: `public/images/profilepic.png`.
- No testimonials, clients or employer endorsements exist; do not invent them.

## Product Principles

1. Show the work running before saying anything about it.
2. Every path ends one step from writing to Lanz.
3. Real numbers only, quoted the way the source states them.
4. The room is the index: anything on the site should be reachable from an object in it.

## Accessibility & Inclusion

WCAG 2.2 AA: text contrast, keyboard access to every 3D affordance through real
buttons, focus kept inside dialogs, tap targets ≥ 44 px on phones, and all motion off
under `prefers-reduced-motion`.
