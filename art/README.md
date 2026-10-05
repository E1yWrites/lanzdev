# art/

Remotion source for the site's rendered art. The 3D models themselves live in
[`../src/three`](../src/three) and are shared with the website, which draws them
live; this folder renders the same models into files. Everything lands in
`../public/art/` and is committed, so the site never depends on this folder at
build time (it's excluded from the root `tsconfig.json`).

| Composition  | Output                                        | Used by                                                  |
| ------------ | --------------------------------------------- | -------------------------------------------------------- |
| `Room`       | `room.webp` (transparent, 1600×1200)          | Home hero poster: the room, before the live scene loads  |
| `Parada`     | `parada.webp` (transparent)                   | PARADA `cover` — poster for the live lot                 |
| `Tala`       | `tala.webp` (transparent)                     | Tala `cover` — poster for the live desk                  |
| `ParadaFilm` | `films/parada-3d.{webm,mp4,jpg}`, only with `ONLY=ParadaFilm` | Not on the site: PARADA's film is its motion reel (below) |
| `TalaFilm`   | `films/tala.{webm,mp4,jpg}` — 15 s, 1080p, sound   | Showreel, film dialog, Tala project page            |
| `ShareImage` | `og.jpg` (1200×630)                           | Open Graph / Twitter image (`src/app/layout.tsx`)        |

**PARADA's film** (`films/parada.{mp4,webm,jpg}`) is PARADA's own motion reel, supplied
as footage rather than rendered here. It's 15 s, 1080p, with sound. To replace it:

```bash
node encode.mjs path/to/ParadaShowreel.mp4 parada   # → films/parada.{mp4,webm}
# poster: the closing lockup, taken from the encoded file
ffmpeg -ss 14.5 -i ../public/art/films/parada.mp4 -frames:v 1 -q:v 3 ../public/art/films/parada.jpg
```

## Working on it

```bash
cd art
npm install
npm run studio               # preview and scrub in Remotion Studio
npm run preview Parada Tala  # quick PNGs in out/ (append @frame, e.g. ParadaFilm@150)
python3 audio/compose.py     # regenerate the soundtracks (numpy + scipy) → public/audio/*.mp3
npm run render               # re-render every asset into ../public/art
ONLY=TalaFilm npm run render # just one
```

On a machine without a GPU (CI, containers), point Remotion at a headless
Chrome shell and use software GL:

```bash
REMOTION_BROWSER_EXECUTABLE=/path/to/headless_shell REMOTION_GL=swangle npm run render
```

## Notes

- **Films** are composed at 1280×720 and rendered at 1.5× (1920×1080) into a
  near-lossless master (`out/<name>.master.mp4`, CRF 12). `encode.mjs` then writes the
  served files: H.264 High + AAC and VP9 + Opus, both converted to standard limited-range
  BT.709. Remotion's JPEG frames give full-range BT.601, which some desktop hardware
  decoders reject. To re-encode without re-rendering, run
  `node encode.mjs out/parada.master.mp4 parada`.
- **Soundtracks** come from `audio/compose.py`: a small numpy synthesiser (keys, pads,
  bass, drums, whooshes, beeps, a servo, an engine, pencil grain, bells) with every effect
  placed on the films' own timeline. Deterministic — same seed, same audio.
- **One model, two drivers.** Each model in `src/three` is a pure function of its
  props (`press`, `approach`, `scan`, `write`, `night`…). The films compute those
  props from the frame number; the site's rigs (`src/components/three/scenes.tsx`)
  compute them from the pointer, hover and time.
- **One copy of three.** The shared models import `three`, `@react-three/fiber` and
  `react`; `bundle.mjs` aliases those to this folder's `node_modules` so the bundle
  never holds two copies. `remotion.config.ts` applies the same override to Studio.
- **Same lighting, same framing.** Lighting is `StudioLights` (emissive panels baked
  into a PMREM environment — no HDR download, reproducible offline). Camera framing
  comes from `src/three/views.ts`, so a poster and its live model line up exactly
  when the site swaps one for the other.
- **Text on models** is drawn to canvas textures once the fonts load. Call
  `useFontsReady()` in the composition, *outside* `<ThreeCanvas>` — state changes
  inside the canvas don't trigger a redraw in Remotion's frame loop.
- Fonts in `public/fonts` are OFL-licensed (JetBrains Mono, Newsreader); licence
  texts sit beside them.
- `public/portrait.webp` is a copy of the site's `public/images/portrait.webp`, for the
  frame in the room (Remotion only serves this folder). Replace both together.
- The room brings its own lights, so its still renders with `<Studio lights={false}>`.
