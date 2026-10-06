---
version: 1
slug: "src-app-page-tsx"
primary_target: "src/app/page.tsx"
related_targets: ["src/app/layout.tsx","src/app/projects","src/app/about","src/app/contact","src/app/downloads","src/app/docs"]
---

## Scope

The whole site, led by the home page. Visitor mode: Experience (the work leads; the
interface recedes), with every room ending one step from contact.

Audience: internship recruiters, hiring managers and faculty, about a minute each.
Action: write to Lanz. Proof: PARADA and Tala running, the two 15 s films, the résumé
facts in `src/data/config.ts`. Constraints: the two films stay; phones get stills;
everything off under reduced motion; no invented proof.

## Direction contract

THESIS: The site is Lanz's house at night, and every page is a room in it, so you learn
the work by walking through it. It refuses the category default: a hero, then a grid of
project cards, then a contact strip.

OWN-WORLD: Painted night walls (each room its own deep paint) as page grounds, dark
plank floors, light only from things in the room: lamp amber, monitor glow, a sodium
lamp in PARADA's garage, Tala's gold turning to night. Enamel door plates set in mono
(number · name · status · stack) label every room. Reading text sits on paper:
printouts, notebook pages. Hand-built, rounded 3D, one long lens, the same lighting rig.

STORY: The visitor sees the room, picks an object, walks through a door into a
project's room, sees it working, and every room ends at a door marked Say hi.

FIRST VIEWPORT: The room, full height and centred, headline painted on the left wall,
pins 01–05 on its objects, and the door ajar on the right (Say hi) as the warmest light
on the screen. Under the room: one line about Lanz, "Skip the room", "Open to an
internship".

FORM: "The house, after dark", candidate 7 of the ordered list; seed 95a0cad7.
Signature interaction: every link is a door — the doorway's rectangle grows to fill the
screen in the next room's light, and that room arrives.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Borrowed from the alternatives

- Door plate: one strict label grid per room (number · name · status · stack).
- Sightlines: the hallway shows every doorway before you choose.
- Each room takes its project's colour; Tala's room turns to night.
- A small floor plan with "you are here" lit.
- Every path ends at the Say hi door.

## Approved comp

`.impeccable/mocks/comp-c.png` — "Wall of doors", approved 2026-10-05, with comp B's
front door as the page's finale.

Composition: the room (first viewport) → one flat hallway wall spanning the page, five
doors in a row (01 PARADA amber, 02 Tala gold, 03 Films cool blue, 04 About soft white,
05 Say hi warm orange, open widest), an enamel plate over each, a pool of the room's
light on the plank floor under each door with a sheet of facts lying in it → the
screening room: two CRTs on a long cabinet playing the films → the front door standing
open, email and an orange "Say hi →". A small floor plan sits under the logo in the nav
with the current room lit.

Not to literalize: the comp's lettering (approximations; real copy and links replace
it), the fact sheets as unreadable paper (they ship as real text, set on paper), the
CRT screens as pictures (they ship as the real `<video>` films inside a CRT frame).

PARADA's room: `.impeccable/mocks/comp-garage.png`, approved 2026-10-05 — the lot under
one sodium lamp, title painted on the concrete wall, the roadmap as seventeen lane
dashes, a "Why it exists" printout with the four published figures as ticket stubs, the
reel on a CRT on a workbench, the Say hi door. Not to literalize: its lane numbers
(they repeat "10") and the tilted plate.

## Decided

- Titles stay Newsreader; revisit at the finish review.
- First build: shared pieces, home (wall of doors, screening room, front door), the
  garage (PARADA) and the study (Tala). Then review before the other rooms.

## Unresolved

- A résumé PDF door plate: no résumé file exists in the repo.

## Below the room (locked 2026-10-06, surface round 4dc6757c, code-led)

Replaces the hallway / screening room / front door scenes the user rejected in review
("everything looks weird all together except the hero"). The hero room stays as built.

STRUCTURE: "The house from above". Scroll past the room and the whole house appears roof
off, one large clay model in the room's own isometric angle, models and night lighting
(procedural 3D, poster first, live on md+). Off a short hall: PARADA's garage (cars,
sodium lamp, Zone A sign, amber), Tala's study (notebook with "tala", brass lamp, gold),
the screening room (cabinet + CRT playing the real films, cool blue), the about room
(portrait, lanyards, soft white), the front entrance with its door open (warm orange).
An enamel plate over each room: number · name · status. Hover/focus lights that room
brighter and shows a paper note (stack + "Open … →"); click walks through
(DoorTransition) to its page; Films opens the VHS player.
CLOSE: "Have a project in mind?" (layout/FooterInvitation.tsx Invitation, stacked) beside
the open front door, then the footer.
KEEP from the rejected build: one scroll = one scene on desktop (SceneScroll, 650 ms
ease-out, gesture threshold), crisp stage edges (feather off for room/house), the
DoorTransition, the floor plan under the logo, the films' Sound on / Pause controls.
DROP: the flat hallway wall of doors (WallOfDoors, Hallway 3D), the CSS CRT/cabinet
screening room, the standalone front-door scene.
RISK the user accepted: rooms are small in one view; detail waits for hover or entry.
NO COMP: image generation unavailable (Higgsfield out of credits, Gemini API free tier
is 0 for image models); ambition lives in this block and the build gets reviewed in behavior.
