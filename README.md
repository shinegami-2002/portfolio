# Shanmukha Chatadi — Portfolio

Static single-page portfolio. No build step required.

## Deploy

This is a static site. Vercel auto-detects and ships it.

```bash
# Push to GitHub
git add .
git commit -m "deploy portfolio"
git push origin main

# Vercel picks up the commit and deploys automatically.
```

## Local preview

```bash
npx serve .
# or
python3 -m http.server 8000
```

Then open http://localhost:8000 (or whatever port `serve` prints).

## Stack

- React 18 + Babel standalone (loaded from unpkg, no bundler)
- Vanilla CSS in JSX
- WebGL fragment shader (no library) for the project gallery background
- Live RAG demo powered by `window.claude.complete` when embedded in a Claude artifact host; gracefully degrades to a retrieval-only display when self-hosted on Vercel

## File map

- `index.html` — entry point. Loads all jsx files via Babel.
- `data.js` — single source of truth for content (projects, experience, skills, etc.)
- `prim.jsx` — primitives: hooks, animations, custom cursor, margin annotations
- `hero.jsx` — hero section, nav, NowPlaying ticker, kinetic marquee
- `askme.jsx` — live RAG demo terminal
- `signature.jsx` — scroll-pinned RAG pipeline cinematic
- `shader.jsx` — WebGL aurora background for projects
- `projects.jsx` — horizontal sticky project gallery + per-project SVG previews
- `hobbies.jsx` — Polaroid photo collage
- `cv.jsx` — experience / education / skills / publications / contact
- `photos/` — image assets (portrait + collage photos)
