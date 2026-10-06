# Handoff — home page redesign ("the house after dark")

Written 2026-10-06. Branch `hero-room`, last commit `b88d3b5` (the hero room). **Nothing
since is committed**: all work below is in the working tree.

## Update 2026-10-06 (latest): perf, native scroll, soft edge, ⌘/Ctrl K, Kenney furniture; uncommitted

- **Perf (ModelStage):** frame watchdog steps `renderScale` (store.ts) 1.75 → 1 → 0 (posters only) when live scenes average < 25 fps; `saveData` / ≤ 2 GB devices skip WebGL; phones no longer prefetch three.js.
- **Scroll:** `SceneScroll` deleted; sections stay `100svh` but scroll natively.
- **Soft edge:** `.room-stage[data-open]` fades its edges (`--fade` 0 → 9 %) while an object is open and the live camera is zoomed (`zoomed` in Hero).
- **Search key:** `useShortcutLabel()` (useCommandPalette.ts) → ⌘K on Apple, Ctrl K elsewhere (Navigation, CommandPalette, DocsSearch).
- **House furniture:** 25 Kenney Furniture Kit GLBs (CC0) in `public/models/furniture/` (symlinked at `art/public/furniture`), loaded by `useFurniture()` / `loadFurniture()` in `src/three/furniture.tsx`, placed with `<Piece>` (sized by `h`/`w` in metres, repainted by material name, rug colourways in `RUG`). Used in every room of `HouseModel.tsx`; hand-built signature pieces (Tala's desk and notebook, the TV and film screen, cars, portrait, door) stay. Poster re-rendered (`ONLY=House node render.mjs`). Also fixed the duplicate-key warning in `Wall`.
- **Room layout (hardened):** every room's furniture is plain data in `src/three/houseLayout.ts` (HouseModel renders it via `<Furnish room>`); `npx tsx scripts/check-house.mts` measures each piece from its GLB and fails on clipping through walls, other furniture, or a doorway (run it after moving anything; currently clean, 61 bodies, 7 doorways). Layout follows the reference render: garage with one car, workbench and shelving; living-room set in the screening room; bedroom with the bed's head to the wall; dining table in About; coat rack and lamp in the entrance.
- Checks: tsc, lint pass.

## Update 2026-10-06 (finish): review, documentation and provenance done; still uncommitted

- **Finish review:**
  - Round 1 returned **fix** (8 findings). The fixes went in as one batch, and two verdict passes later the reviewer said **ship** for the fixes it scored (not a fresh review of the whole surface). It ran in a fresh agent from `degraded/finish-reviewer.md`, because the shipped reviewer agent isn't installed.
  - Fixes:
    - Per-room wall paint (`PAINT` in HouseModel); the front door is the warmest light; the car is toned down.
    - One index across the page: 01 PARADA · 02 Tala · 03 About · 04 Say hi · 05 Showreel. The house's phone list is gone.
    - The PARADA reel plays on the house CRT (`useReel` in scenes.tsx), with a reel frame in the poster.
    - Plates are plain labels.
    - Every internal link is a door (capture-phase handler in DoorTransition, Back clears it, 5 s safety).
    - The "Hi, I'm Lanz" greeting moved into the line under the room. Phones get `room-phone.webp`, which has a blank wall (`RoomPhone` still, `ModelStage posterNarrow`).
  - **User decisions:** the `.room-tape` 6px stripe stays; the logo star keeps its overshoot.
- **DESIGN.md + `.impeccable/design.json`:** rewritten by the documenter for the house world. Open drift it noted, not repaired:
  - the RoomCard kicker;
  - `.section-number` eyebrows on the inner pages;
  - the plate/live colours are literals;
  - `.punch-rail` and the `swiss.*` aliases are unused.
- **Provenance:** `embed-prompt --scan public/art public/images art/public` shows 15 rasters, 0 missing.
- `.impeccable/build/state.json` is marked `superseded` (the comp-led round on comp-c.png).
- **Checks:** tsc, lint and build pass (home first load 129 kB); scroll.mjs passes.
- **Round-4 component review** (session `86bd8d6d…`) is still open for the user's verdict; its screenshots predate the fixes.

## Update 2026-10-06 (later): "the house from above" is built, round 4 awaiting review

- Page is now two scenes: the room → `components/home/House.tsx` (house + invitation), then the footer.
- Model `src/three/HouseModel.tsx`; plan/camera/plates `src/three/housePlan.ts`; room rects now live in
  `src/data/house.ts` (`HOUSE[room].at`), shared with `FloorPlan`. Poster `public/art/house.webp`
  (`ONLY=House node render.mjs` in `art/`, browser `chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell`, `REMOTION_GL=swangle`).
- Live scene `HouseScene` in `components/three/scenes.tsx`; hover store `houseHover`.
- Deleted: WallOfDoors, FrontDoor, Showreel (`ReelItem` moved to VhsOverlay, which gained Pause), Hallway.tsx,
  hallway.ts, hallway/front-door posters, their CSS. `Car`/`useCarGeo` exported from ParadaLot.
- Checks: tsc, lint, build pass; `scroll.mjs` rewritten for two scenes, all pass; no console errors.
- Review session `86bd8d6d…` round 4 captured (`awaiting-review`).
- Still owed: finish reviewer, DESIGN.md + design.json, provenance (`embed-prompt --scan public/art`).
  The CRT shows a still screen, not the films; the films play in the VHS player.

## Start here (original)

1. Run `/home/e1yu/.claude/skills/impeccable/scripts/impeccable context --target src/app/page.tsx`
   (loads PRODUCT.md, DESIGN.md, the surface brief), then read
   `.impeccable/surfaces/src-app-page-tsx.md`, especially the last section, **"Below the
   room (locked 2026-10-06 …)"**. That is the plan the user chose. Build it.
2. Build path is **code-led**: no comp exists for the new plan (image generation is
   unavailable, see Tools). The ambition lives in that brief section; the user reviews
   the running page.
3. The user said: when a question comes up, **take the recommended option and keep going**
   rather than asking.

## What the user approved / rejected (in order)

- **Approved:** the hero room (`src/components/home/Hero.tsx`, `src/three/Room.tsx`), the
  full nav from `md` up, the floor plan under the logo (`layout/FloorPlan.tsx`).
- **Rejected (round 1 review):** the comp-faithful page with a 5-door hallway band, paper
  fact cards, CSS CRT screening room. Notes: Say hi belongs after the films; doors light
  only on hover; needs real shading/shadows; one scroll = one scene; a door-entering
  animation.
- **Rejected (rounds 2–3):** the rework of the above as four full-screen scenes (4-door
  hallway with shadows, screening room, front door). Final note: *"everything looks weird
  all together except the hero."* Hallway "too dark" and scroll "felt wrong" were fixed in
  round 3 but the whole arrangement was still rejected.
- **Asked for along the way, keep:** sharp stage edges instead of a soft feather (room and
  house); the "Have a project in mind?" block on the closing section.
- **Locked (surface round `4dc6757c`):** **"The house from above"**: one roofless clay
  model of the whole house under the room, five lit rooms with enamel plates, hover lights
  a room and shows a paper note, click walks through to its page, closing invitation beside
  the open front door.

## Code map (working tree)

Keep and reuse:
- ~~`src/components/motion/SceneScroll.tsx`~~ (removed): one scroll/key = one `[data-scene]` on desktop
  (650 ms ease-out, 30 px gesture threshold, swallows trackpad momentum, a swipe mid-glide
  goes one further, frees the footer). Tested by `.impeccable/tools/scroll.mjs` (all pass).
- `src/components/motion/DoorTransition.tsx`: `enterDoor({href, rect, light})` grows a
  doorway rect to full screen in the room's light, navigates, fades; mounted in `layout.tsx`.
- `src/components/layout/FooterInvitation.tsx`: `Invitation` (`stacked`, `headingId`) is
  the "Have a project in mind?" block; the footer hides it on `/` and `/contact`.
- `src/components/layout/FloorPlan.tsx` + `src/data/house.ts` (`HOUSE` room names/light
  colours, `roomForPath`).
- `src/components/three/ModelStage.tsx`: new `feather` prop (false = crisp edges) and a
  `hall` scene entry; `scenes.tsx` `Shell` gained `lights`/`shadows` props.
- `src/components/three/store.ts`: `hallDoor` store (hover index) — rename/reuse for rooms.
- `src/components/home/Showreel.tsx`: the films' logic (buffer ahead, hand-over, autoplay
  that never undoes Play, Sound on/off, Pause). Its CRT/cabinet markup was part of the
  rejected look; keep the logic, re-skin into the screening room of the house.
- `src/components/home/VhsOverlay.tsx`: big film player; delays for the tape animation only
  while the room is on screen.
- `src/three/Hallway.tsx`: reusable parts for the new house model: `Leaf` (joinery door),
  `Frame`, `RoomBehind`, `Shadowed` (cast/receive on solid meshes), `Key` (shadowed
  directional light), `fadeTexture`, `wallGeometry`. Shadow lesson: overlapping lit-room
  planes behind a wall showed through as thin bright lines; keep rooms from overlapping.
- `src/three/house.tsx`: shared palette `C`, `Box`, `Rod`, `Glow`, `Plant`, floor/wall
  textures, `doorwayTexture`, `spillTexture`.
- `art/`: Remotion stills (`npm run render` / `ONLY=Hallway,FrontDoor node render.mjs`);
  `Studio` gained a `shadows` prop; `HallwayStill` takes an `open` prop
  (`npx remotion still src/index.ts Hallway out.png --props='{"open":[0,1,0,0]}'`).

Replace (rejected look): `src/components/home/WallOfDoors.tsx`, `src/components/home/FrontDoor.tsx`,
the hallway/front-door scenes in `src/three/Hallway.tsx` + `hallway.ts`, their CSS in
`globals.css` (`.hall-*`, `.door-*`, `.front-*`, `.crt*`, `.cabinet*`, `.screening*`), and
`public/art/hallway.webp`, `front-door.webp`. Page order is in `src/app/page.tsx`.

Already deleted (unused after the redesign): WorkFolders, Capabilities, AboutCard,
VelocityMarquee, the Kalam font, folder/cap-row/tilt-card CSS.

## Impeccable build state

- `.impeccable/build/state.json`: comps, spec, plates **closed**; **hero open** (3 records,
  gate fails against the old comp `comp-c.png`, which the user's notes superseded).
- First-viewport review session `86bd8d6df0ce…` (`.impeccable/review/hero.json`, page in
  `.impeccable/review/hero-page/`) ended **changes-requested** in round 3.
- After building the new plan: capture the scenes (`.impeccable/tools/scenes.mjs`), update
  `hero-page/index.html` + `hero.json`, run
  `IMPECCABLE_BROWSER=$HOME/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome impeccable component-review capture --manifest .impeccable/review/hero.json`,
  then `component-review serve --session <id>` in the background and open the URL. The
  review tool needs a static HTML entry, which is why the page shows screenshots.
- Still owed before finish: responsive (phones get stills + tap targets), finish reviewer,
  DESIGN.md + `.impeccable/design.json` via the documenter, provenance on every shipping
  raster (`impeccable embed-prompt --scan public/art`; 6+ older posters lack it).

## Tools and gotchas

- Dev server: `npx next dev -p 3100` (start in background). **Never** `pkill -f "next dev …"`
  in a command line that contains that same string: it kills its own shell (exit 144).
  Stop it with `pgrep -f next-server` + `kill <pid>`.
- Checks: `npx tsc --noEmit -p .`, `npx next lint`, `npx next build` (stop the dev server
  first; they share `.next`). All passed at handoff. Prettier is not configured; ignore it.
- Screenshots: `node .impeccable/tools/cap.mjs <url> <out.png> <w> <h> [full]` and
  `scenes.mjs` (one shot per `[data-scene]`); both use playwright-core from the npx cache
  and `~/.cache/ms-playwright/chromium_headless_shell-1243`. They run with reduced motion
  (posters). Headless WebGL is software (SwiftShader) and seconds per frame: never judge
  timing or scroll with 3D live; `scroll.mjs` launches with WebGL disabled for that.
- Image generation: **unavailable**. Higgsfield CLI (`higgsfield`) is out of credits;
  Gemini API key is in `GEMINI_API_KEY` (in `~/.bashrc`, use `bash -ic`) but the free tier
  for image models is 0; Canva upload was blocked by the permission classifier. If the
  user enables Gemini billing, `.impeccable/tools/gemini_image.py <model> <prompt.txt>
  <ref.png> <out.png> [aspect]` works (`gemini-2.5-flash-image`, ~$0.04/image).
- No image converter on the machine (no cwebp/ffmpeg/PIL); Remotion writes webp directly.
