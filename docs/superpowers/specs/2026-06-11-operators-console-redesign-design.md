# chatadi.sys — The Operator's Console (portfolio redesign)

**Date:** 2026-06-11 · **Status:** approved (user delegated full authority)
**Live site:** https://shanmukha-chatadi.vercel.app/ · **Repo:** github.com/shinegami-2002/portfolio (= `~/website`)

## 1. Goal

Replace the current portfolio (dark-editorial "AI-generated" aesthetic: amber-on-black, Instrument Serif italics, Caveat margin notes, polaroids, scroll-jacking, in-browser Babel) with a distinctive, motion-rich site that makes visitors awestruck. Concept: **the portfolio is the operator console for a production system whose product is Shanmukha's career.** Everything shown is real — real metrics, real architectures, his real words about what broke.

**User requirements (their words):** not AI-generated-feeling; "blow me out of the world"; "super fluid amazing way of interacting"; "crazy UI and motions and animations"; curated content (not a resume dump); photo `me.jpeg` present; email `shanmukh.nitpy@gmail.com` everywhere.

**Non-goals:** no LLM API backend in v1 (client-side agent only, with a provider seam for adding Gemini later); no blog/CMS; no analytics; never publish visa/phone/address.

## 2. Stack

- **Vite + React 18 + TypeScript**, static build at repo root (`src/`, `public/`, `index.html`). Old site files deleted on the redesign branch.
- **Zero runtime deps beyond react/react-dom.** Hand-written CSS with design tokens; tiny hand-rolled spring/rAF helpers. Dev deps: vite, typescript, @types, vitest (corpus tests only).
- **Fonts (self-hosted, no Google request):** `@fontsource-variable/archivo` (headlines in wide caps via width axis + body text) and `@fontsource-variable/martian-mono` (labels, data, terminal). Subset latin. The Inter/Instrument-Serif/JetBrains-Mono trio dies.
- **vercel.json:** `{ buildCommand: "npm run build", outputDirectory: "dist", cleanUrls: true, trailingSlash: false }`.
- Budgets: JS < 120KB gzip, Lighthouse ≥ 95 perf/a11y/SEO, LCP < 2.5s mobile.

## 3. Design tokens (themes)

CSS custom properties on `:root[data-theme]`, persisted in localStorage, default = `prefers-color-scheme` else graphite.

| token | graphite (default) | paper (phase: last) |
|---|---|---|
| `--bg` | `#0A0E12` | `#F2F1EC` |
| `--surface` | `#10161C` | `#FAFAF7` |
| `--ink` | `#E6EDF3` | `#14181C` |
| `--muted` | `#8B98A5` | `#5C6670` |
| `--signal` (phosphor) | `#3DF0B0` | `#00805F` |
| `--signal-2` (data viz) | `#6BB8FF` | `#0B66D0` |
| `--alert` | `#FFB454` | `#B45309` |
| `--danger` | `#FF6B5E` | `#C2402F` |
| `--line` | `#1C242D` | `#D8D6CE` |

Type scale: Archivo for prose/headlines (nameplates: caps, wide width axis, tight tracking); Martian Mono for all labels/data/numbers, sizes 10–13px with letterspacing. Grid: 8px base, dense.

## 4. Page structure (single page, six panes, native scroll — NO scroll-jacking)

1. **Status header / hero** — system nameplate: `SHANMUKHA CHATADI` wide caps + `chatadi.sys` brand mark; status block `● AVAILABLE NOW · APPLIED AI/ML ENGINEER · RALEIGH NC · OPEN TO RELOCATE` (he graduates May 2026 — copy says available *now*, not "summer '26"); operator ID badge = `photos/me.jpeg` with mono metadata rows (OPERATOR / CLASS OF '26 / NC STATE MS CS). Boot sequence on first visit per session (sessionStorage): CRT power-on flash → scanline sweep → nameplate assembles via glyph-decode → status lines race in → trace draws itself. ≤1.5s, skip on any key/click, skipped entirely under `prefers-reduced-motion`.
2. **The Trace** — career 2022→2026 as a distributed-trace waterfall: role spans (TreoSoft → Rygen BioPharma → NC State MS → MiHIN) with nested project spans. Doubles as nav: click span → smooth-scroll to pane. A mini-trace persists in the sticky header showing current scroll position (the playhead).
3. **Five flagship panes** (order: MiHIN, ScholarAgent, MCP Healthcare, Pruning study, Task Queue). Each = "internal service dashboard page": header row (service name + status chip `PROD`/`OSS`/`RESEARCH` + period + artifact chips GitHub/video/paper/live), bespoke interactive **sim**, dense spec rows (problem → approach → real numbers), and 2–3 "incident log" lines in his honest first-person voice (sourced from master_resume.md specifics, e.g. "my first runs produced thousands of useless rules").
4. **The Archive** — dense expandable table: Parameter Golf (0.8128 bpb, top-10 mid-comp), ChimeraAR (▶ video chip → YouTube), LinkVault, SlackPoint, BurnOut, gait recognition, AI ChatBot, publications (HIS 2023 Springer DOI 10.1007/978-3-031-78925-0_7; ICDLAIR 2024 DOI 10.2991/978-94-6463-740-3_14; AAAI 2026 LLMs4PCG contributing author), certifications (NVIDIA diffusion models etc.), leadership (Zer01Coded 150+ students). One line each → expands to tight paragraph + chips.
5. **Field log** — travel photos as restrained film-strip/grid, mono captions, WebP-compressed (currently ~8MB PNGs). No polaroid tape, no Caveat.
6. **Contact** — availability block, `shanmukh.nitpy@gmail.com` (copy-to-clipboard chip), github.com/shinegami-2002, linkedin.com/in/shanmukha-chatadi, `RESUME.PDF` chip serving `/resume.pdf` (copy from `~/Downloads/Shanmukh_Chatadi_AI.pdf`).

## 5. The five sims

Shared `SimShell` component: mono title bar, RUNNING/IDLE status, activates via IntersectionObserver, pauses when offscreen/hidden tab, instrument-crosshair cursor overlay with live readouts inside the sim area. Each sim is SVG + rAF springs, self-contained, ~150–300 lines, simplest faithful version first.

1. **MiHIN platform** — request flows through Cognito → API Gateway → Lambda → Bedrock; A2A agents publish Agent Cards and discover each other; counters tick real figures (230+ users, 20+ official bots, 10K+ docs, −30% ungrounded, −60% MTTD). Button: "send request".
2. **ScholarAgent** — the real 7-node LangGraph executable: run → router → retriever → grader (one doc visibly fails) → rewriter loop fires → generator → hallucination check gates → synthesizer. Step-through + auto mode. Numbers: +35% groundedness, 10K+ papers, 99% cascade uptime.
3. **MCP Healthcare** — tool-call playground making **REAL openFDA API calls from the visitor's browser** (api.fda.gov is CORS-open, keyless). Preset queries (e.g. warfarin↔aspirin interaction, adverse events for a drug) → watch MCP tool selection → live JSON → rendered result. Fallback to canned response on network failure, labeled as such.
4. **Pruning study** — interactive 11-config CKA heatmap (hover cell = pairwise CKA + mistake overlap) + r=+0.95 scatter. Data: faithful representative matrix derived from the writeup's published stats (CKA spread 0.73–0.95, r=+0.95, probe 89.2% vs 25% chance), labeled "reconstructed from study results". Ask user for real CSVs if available.
5. **Task Queue** — drag load slider → queue depth climbs → HPA spawns/kills worker pods (elastic pop) → retries with backoff → dead-letter events shake their row → throughput/latency tickers.

## 6. The agent + command palette

- **One input, three triggers:** `⌘K` / `/` keyboard, floating button (mobile). Portal overlay, focus-trapped, scanline-dim backdrop, spring drop-in.
- **Command mode:** fuzzy match over registered commands (jump to pane/flagship, toggle theme, copy email, download resume) — instant.
- **Question mode:** anything else runs the visible agent pipeline: `⚙ search_corpus("…")` chip → scored hits list → answer assembled from curated chunk text + citation chips that deep-link to panes. Token-streaming typewriter render with phosphor block cursor.
- **Retrieval:** hand-rolled BM25 (~80 lines) over corpus chunks derived at module load from the content model. Honest label in the UI: *"runs entirely in your browser — local BM25, no API, no tracking."*
- **Provider seam:** `AnswerProvider` interface; v1 ships `LocalRetrievalProvider`; a future `GeminiProvider` = one file + one Vercel function, no redesign.
- ~10 retrieval unit tests (vitest): canned query → expected top chunk.

## 7. Motion system — "the console is alive"

Banned: floating gradient blobs, generic fade-up-on-scroll, parallax soup, scroll-jacking, custom cursor orb. Every animation speaks the console's language, reacts to visitor/data, never loops decoratively. All behind `prefers-reduced-motion` (reduced = instant states, sims still functional but static-stepped). GPU-cheap: transform/opacity + one small shader.

- **Phosphor persistence (signature):** interacted elements (trace playhead, palette selections, sim events, hovered table rows) leave a brief decaying glow trail. Fast trace scrub = streaking afterglow. Implemented with pooled trail elements / box-shadow decay.
- **Boot sequence** (see §4.1).
- **WebGL signal layer:** one fragment shader behind the console, barely visible oscilloscope/signal field; amplitude tracks scroll velocity; energizes on sim runs and agent answers; idles calm. DPR cap 1.5, pauses on hidden tab, skipped without WebGL/reduced-motion.
- **Pane spawn:** border traces itself on → title glyph-decodes → grid lines draw → data rows stamp in dot-matrix-fast, numbers spring-count to real values. (`GlyphDecode` component used for pane titles only.)
- **Palette theater:** scanline dim, spring overshoot, tool-chips slam in, token streaming.
- **Sim fireworks:** elastic pod pops, packet flows, node pulses, dead-letter row shudder.
- **Instrument cursor:** native cursor everywhere except inside sims, where a crosshair + live readout follows (coordinates/values).
- **Theme toggle = CRT power-cycle:** screen collapses to horizontal line, re-exposes in the other theme.
- Connective tissue: magnetic chips, inertial sliders, springy everything, scroll-velocity-aware skew on trace rail, heartbeat status dots.
- Keyboard layer: `j`/`k` pane nav, `?` keymap overlay, `g`+key jumps.

## 8. Content model

`src/content/*.ts`, typed, single source of truth (replaces data.js). Curated by Claude from `/Users/shanmukhachatadi/job_new/applyryt/master_resume.md` + `personal_information.md` — tight console voice, his specifics and honest failure stories preserved. Includes: profile/status, roles (3), flagships (5: header, chips, spec rows, numbers, log lines, sim id), archive entries (7+ projects, 3 publications, certs, leadership), photo manifest with captions, skills (for agent corpus). Corpus chunks derived from this model. **MiHIN story must include the new material absent from the old site:** owns production deploys on the enterprise AI chat platform (200+ users, 20+ bots), A2A protocol on Bedrock AgentCore, Strands Agents SDK, MCP integrations against HL7/FHIR, governance (HITRUST/NIST/HIPAA), C-suite pitch winning org-wide pilot.

Contact email: `shanmukh.nitpy@gmail.com` (user's explicit 2026-06-10 instruction; note master_resume.md says shanmukha.chatadi@gmail.com — flagged, user didn't correct).

## 9. SEO / meta

Static `index.html` head: title "Shanmukha Chatadi — Applied AI/ML Engineer", meta description, OG + Twitter cards **with og:image** (1200×630 console-style card, generated by screenshotting a local HTML template via Puppeteer → `public/og.png`), JSON-LD Person (port from current site, update email), keep/update `llms.txt` and `favicon.svg`, noscript fallback paragraph.

## 10. Accessibility

AA contrast for ink/muted on both themes; visible focus rings (phosphor); palette focus-trapped with aria-combobox semantics; sims keyboard-operable (buttons/sliders are real controls) with text alternatives; `prefers-reduced-motion` respected globally; semantic landmarks per pane; skip-link.

## 11. Mobile

Stacked panes, native scroll. Trace becomes horizontal mini-strip under header. Palette via floating button. Sims full-width, touch-driven (sliders/buttons ≥44px). No hover-dependent content (crosshair readouts hidden on touch; tap shows values).

## 12. Rollout & verification

- Branch `redesign`; Vercel auto-builds preview URL per push; production `main` untouched until user approves; then merge.
- Per-phase verification with existing Puppeteer setup (`/tmp/sitecheck`, symlinked global node_modules): screenshots 1440×900 + 390×844 per pane, console-error check, Lighthouse via `npx lighthouse`, reduced-motion pass, vitest corpus tests.
- **Risk: sim scope creep** → each sim ships minimal-faithful first, polish later. **Risk: Vercel build config** → verify preview deploy renders before building more panes (deploy scaffold early).

## 13. What dies

Babel-standalone, React dev CDN builds, Unsplash hotlinks, scroll-jacked horizontal gallery, custom cursor orb, Caveat/polaroid/tape, amber editorial serif, № decoration, "no mock data" claim, dead components (Manifesto/Stats with fake 3.92 GPA), `useMobile`-era code — the entire old `*.jsx` set is replaced.
