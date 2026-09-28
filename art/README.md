# art/

Remotion source for the site's generated art. Everything it renders lands in
`../public/art/` and is committed, so the website never depends on this folder
at build time (it's excluded from the root `tsconfig.json`).

| Composition  | Output                                 | Used by                                                    |
| ------------ | -------------------------------------- | ---------------------------------------------------------- |
| `Hero`       | `hero.webm`, `hero.mp4`, `hero-poster.jpg` | Home hero — 6 s seamless loop on pure black            |
| `Parada`     | `parada.webp` (transparent)            | PARADA cover (`cover` in `src/data/projects.ts`)           |
| `Modpack`    | `modpack.webp` (transparent)           | Modpack cover                                              |
| `ShareImage` | `og.jpg` (1200×630)                    | Open Graph / Twitter image (`src/app/layout.tsx`)          |

## Working on it

```bash
cd art
npm install
npm run studio   # preview and tweak in Remotion Studio
npm run render   # re-render every asset into ../public/art
```

On a machine without a GPU (CI, containers), point Remotion at a headless
Chrome shell and use software GL:

```bash
REMOTION_BROWSER_EXECUTABLE=/path/to/headless_shell REMOTION_GL=swangle npm run render
```

## Notes

- The hero is rendered on `#000000`; the site layers it with
  `mix-blend-mode: screen`, so the black disappears into the page background.
- Keycap legends are drawn to canvas textures after the fonts load (troika text
  never reports ready in headless renders). Call `useFontsReady()` in the
  composition component, *outside* `<ThreeCanvas>` — state changes inside the
  canvas don't trigger a redraw in Remotion's frame loop.
- Lighting uses local `Lightformer`s rather than HDR presets, so renders work
  offline and are reproducible.
- Colours mirror the site tokens in `src/app/globals.css` (accent `#FF4C29`,
  sheet `#EFEEE9`, grey `#D3D2CC`). Fonts in `public/fonts` are OFL-licensed
  (JetBrains Mono, Newsreader); licence texts sit beside them.
