# Operator's Console Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
> **NOTE:** This plan is executed inline by the lead session (creative cohesion requirement, user-approved). Visual components carry precise behavioral specs rather than final JSX; the executor applies the frontend-design skill during build. Kernels (tokens, springs, BM25, types, shader) are complete code.

**Goal:** Rebuild shanmukha-chatadi.vercel.app as `chatadi.sys` — a motion-rich "operator's console" portfolio per `docs/superpowers/specs/2026-06-11-operators-console-redesign-design.md`.

**Architecture:** Vite + React 18 + TS static SPA, zero runtime deps beyond react. Six panes on native scroll; client-side BM25 agent behind a `⌘K` palette; five bespoke SVG sims; WebGL signal layer; dual theme via CSS tokens.

**Tech Stack:** Vite, React 18, TypeScript, @fontsource-variable/archivo + martian-mono, vitest (dev), hand-rolled CSS/springs/BM25/shader.

**Branch:** `redesign` (Vercel preview). Production untouched until user approves.

**Verification harness:** `/tmp/sitecheck` (Puppeteer via symlinked global node_modules) — screenshot 1440×900 + 390×844, console-error capture. Lighthouse: `npx lighthouse <url> --quiet --chrome-flags="--headless"`.

---

## File structure (lock-in)

```
index.html                      static head: title/meta/OG/Twitter/JSON-LD/noscript, #root, module script
vercel.json                     build config (dist)
public/photos/*.webp            converted via sips (script below)
public/resume.pdf               from ~/Downloads/Shanmukh_Chatadi_AI.pdf
public/og.png                   1200×630, generated (Task 16)
public/favicon.svg              terminal-block mark, phosphor on graphite
public/llms.txt                 updated
src/main.tsx                    mount + theme init
src/App.tsx                     providers + pane composition
src/styles/tokens.css           themes + type scale (complete code below)
src/styles/global.css           reset, base, focus, utilities, reduced-motion
src/lib/springs.ts              spring physics + rAF hooks (complete code below)
src/lib/useInView.ts            IntersectionObserver hook
src/lib/scrollBus.ts            scroll velocity + activity event bus (window-level)
src/lib/theme.ts                get/set/persist theme + CRT flip hook
src/components/GlyphDecode.tsx  scramble→resolve text
src/components/NumberTicker.tsx spring-count numbers on first view
src/components/Chip.tsx         artifact/action chip (magnetic hover)
src/components/Pane.tsx         section shell: border-trace, title decode, stamp-in rows
src/components/StatusHeader.tsx sticky header: brand, mini-trace, theme toggle, palette btn
src/components/Boot.tsx         first-visit boot overlay (sessionStorage)
src/components/SignalLayer.tsx  WebGL oscilloscope background (shader below)
src/components/Keymap.tsx       ? overlay; j/k & g-key nav
src/trace/Trace.tsx             career trace pane (nav)
src/palette/Palette.tsx         ⌘K overlay: command + agent modes
src/agent/bm25.ts               BM25 (complete code below)
src/agent/corpus.ts             chunks derived from content model
src/agent/provider.ts           AnswerProvider interface + LocalRetrievalProvider
src/sims/SimShell.tsx           title bar, IO activation, crosshair readout overlay
src/sims/QueueSim.tsx           load slider → HPA pods
src/sims/ScholarSim.tsx         7-node LangGraph run/step
src/sims/MihinSim.tsx           platform request flow + A2A cards
src/sims/McpSim.tsx             LIVE openFDA calls + canned fallback
src/sims/PruningSim.tsx         CKA heatmap + r=+0.95 scatter
src/panes/Hero.tsx              nameplate + status + operator badge
src/panes/Flagship.tsx          flagship template (header/chips/sim/spec rows/log lines)
src/panes/Archive.tsx           expandable dense table
src/panes/FieldLog.tsx          photo strip
src/panes/Contact.tsx           availability + links + resume chip
src/content/types.ts            (complete code below)
src/content/profile.ts roles.ts flagships.ts archive.ts photos.ts
tests/bm25.test.ts tests/corpus.test.ts
scripts/photos.sh               png→webp conversion
```

---

### Task 0: Branch, scaffold, deploy preview early ✅ checkpoint = preview URL renders

- [ ] `git checkout -b redesign`
- [ ] Move old site aside & scaffold: `mkdir _old && git mv askme.jsx cv.jsx data.js hero.jsx hobbies.jsx index.html prim.jsx projects.jsx shader.jsx signature.jsx _old/` (photos/ stays for conversion; delete `_old` in Task 17)
- [ ] `npm create vite@latest . -- --template react-ts` (merge into existing dir), then `npm i && npm i @fontsource-variable/archivo @fontsource-variable/martian-mono && npm i -D vitest`
- [ ] Write `vercel.json`:
```json
{ "buildCommand": "npm run build", "outputDirectory": "dist", "cleanUrls": true, "trailingSlash": false }
```
- [ ] Strip Vite boilerplate; `App.tsx` renders `<main>chatadi.sys — under construction</main>`; verify `npm run build` succeeds and `npm run preview` serves.
- [ ] Commit `feat: scaffold vite console on redesign branch`; push; **verify Vercel preview URL builds & renders** (`vercel ls` via gh not needed — check github deployment status or the PR preview link). If Vercel project needs framework override, fix now.

### Task 1: Tokens + global styles + theme lib

- [ ] `src/styles/tokens.css` — complete:
```css
:root, :root[data-theme="graphite"] {
  --bg:#0A0E12; --surface:#10161C; --surface-2:#141C24; --ink:#E6EDF3;
  --muted:#8B98A5; --signal:#3DF0B0; --signal-2:#6BB8FF; --alert:#FFB454;
  --danger:#FF6B5E; --line:#1C242D; --line-2:#26303B;
  --glow:0 0 12px rgba(61,240,176,.35);
  color-scheme: dark;
}
:root[data-theme="paper"] {
  --bg:#F2F1EC; --surface:#FAFAF7; --surface-2:#ECEAE3; --ink:#14181C;
  --muted:#5C6670; --signal:#00805F; --signal-2:#0B66D0; --alert:#B45309;
  --danger:#C2402F; --line:#D8D6CE; --line-2:#C8C5BB;
  --glow:0 0 10px rgba(0,128,95,.25);
  color-scheme: light;
}
:root {
  --font-sans:"Archivo Variable",system-ui,sans-serif;
  --font-mono:"Martian Mono Variable",ui-monospace,monospace;
  --text-label:11px; --text-data:12px; --text-body:15px;
  --track-label:.14em; --pane-max:1320px; --gutter:clamp(16px,4vw,48px);
  --ease-snap:cubic-bezier(.2,.9,.25,1.05);
}
```
- [ ] `global.css`: box-sizing reset; body bg/ink/sans; `::selection` signal; focus-visible 2px signal outline; `.mono-label` utility (mono, 11px, uppercase, tracked, muted); thin themed scrollbar (NOT hidden); `@media (prefers-reduced-motion: reduce){ *{animation-duration:.01ms!important; transition-duration:.01ms!important} }`; skip-link.
- [ ] `src/lib/theme.ts`: `getTheme()` (localStorage→prefers-color-scheme→graphite), `setTheme(t)` sets `data-theme` + persists, `useTheme()` hook. CRT flip handled in Task 15 (`flipTheme()` wraps setTheme with overlay animation; plain swap until then).
- [ ] App skeleton: six empty `<Pane>`-less sections with ids `hero trace work archive field contact`; header placeholder. Verify themes toggle via devtools `data-theme`.
- [ ] Commit `feat: design tokens, global styles, theme persistence`.

### Task 2: Content model + curated content (the big writing task)

- [ ] `src/content/types.ts` — complete:
```ts
export type ChipT = { label: string; href?: string; kind: "github"|"video"|"paper"|"live"|"action" };
export type SpecRow = { k: string; v: string };
export type Metric = { value: number; suffix?: string; prefix?: string; label: string; decimals?: number };
export type LogLine = string; // first-person, honest, specific
export type Flagship = {
  id: "mihin"|"scholar"|"mcp"|"pruning"|"queue";
  name: string; status: "PROD"|"OSS"|"RESEARCH"; period: string; oneLiner: string;
  chips: ChipT[]; metrics: Metric[]; problem: string; approach: string;
  logLines: LogLine[]; tags: string[];
};
export type ArchiveEntry = {
  id: string; name: string; year: string; oneLiner: string; detail: string;
  chips: ChipT[]; kind: "project"|"publication"|"certification"|"leadership";
};
export type Role = {
  org: string; title: string; period: string; location: string;
  summary: string; bullets: string[]; tags: string[];
  spanStart: number; spanEnd: number | null; // fractional years for trace, e.g. 2022.45
};
export type Photo = { src: string; caption: string; place: string };
export type CorpusChunk = { id: string; title: string; anchor: string; text: string };
```
- [ ] Write `profile.ts` (name, role line, status `AVAILABLE NOW`, location, email `shanmukh.nitpy@gmail.com`, github/linkedin, summary para), `roles.ts` (3 roles — **MiHIN must include**: owns prod deploys on enterprise AI chat platform 200+ users/20+ bots, A2A on Bedrock AgentCore, Strands SDK, MCP↔HL7/FHIR, governance HITRUST/NIST/HIPAA, C-suite pitch → org-wide pilot), `flagships.ts` (5 per spec §5 with real metrics + log lines mined from master_resume.md), `archive.ts` (Parameter Golf w/ 0.8128 bpb + top-10 mid-comp + 27% improvement, ChimeraAR + YouTube chip, LinkVault, SlackPoint, BurnOut, gait, AI ChatBot; 3 publications w/ DOIs; certs; leadership), `photos.ts` (15 existing photos, mono captions).
- [ ] Voice rules: terse console labels; human first-person paragraphs; numbers always real; no superlatives without a number attached.
- [ ] Commit `feat: typed content model with curated console copy`.

### Task 3: BM25 + corpus (TDD)

- [ ] `tests/bm25.test.ts` first — failing:
```ts
import { describe, it, expect } from "vitest";
import { BM25 } from "../src/agent/bm25";
const docs = [
  { id: "a", text: "go grpc kubernetes task queue redis priority" },
  { id: "b", text: "langgraph rag hallucination grader gemini" },
  { id: "c", text: "aws bedrock production platform cognito lambda" },
];
describe("BM25", () => {
  it("ranks the queue doc first for a queue query", () => {
    const idx = new BM25(docs);
    expect(idx.search("distributed task queue in go")[0].id).toBe("a");
  });
  it("returns empty for nonsense", () => {
    expect(new BM25(docs).search("zzqq xylophone")).toHaveLength(0);
  });
});
```
- [ ] `src/agent/bm25.ts` — complete:
```ts
export type Doc = { id: string; text: string };
export type Hit = { id: string; score: number };
const tokenize = (s: string) =>
  s.toLowerCase().normalize("NFKD").split(/[^a-z0-9+#.]+/).filter(w => w.length > 1);
export class BM25 {
  private df = new Map<string, number>();
  private tf: Map<string, Map<string, number>>[] = [] as never;
  private docTf = new Map<string, Map<string, number>>();
  private len = new Map<string, number>();
  private avgLen = 0;
  private N = 0;
  constructor(docs: Doc[], private k1 = 1.4, private b = 0.6) {
    this.N = docs.length;
    let total = 0;
    for (const d of docs) {
      const toks = tokenize(d.text);
      total += toks.length;
      this.len.set(d.id, toks.length);
      const tf = new Map<string, number>();
      for (const t of toks) tf.set(t, (tf.get(t) ?? 0) + 1);
      this.docTf.set(d.id, tf);
      for (const t of tf.keys()) this.df.set(t, (this.df.get(t) ?? 0) + 1);
    }
    this.avgLen = total / Math.max(1, this.N);
  }
  search(q: string, topK = 4): Hit[] {
    const qt = [...new Set(tokenize(q))];
    const scores = new Map<string, number>();
    for (const t of qt) {
      const df = this.df.get(t); if (!df) continue;
      const idf = Math.log(1 + (this.N - df + 0.5) / (df + 0.5));
      for (const [id, tf] of this.docTf) {
        const f = tf.get(t); if (!f) continue;
        const L = this.len.get(id)! / this.avgLen;
        const s = idf * (f * (this.k1 + 1)) / (f + this.k1 * (1 - this.b + this.b * L));
        scores.set(id, (scores.get(id) ?? 0) + s);
      }
    }
    return [...scores.entries()].map(([id, score]) => ({ id, score }))
      .filter(h => h.score > 0.1).sort((x, y) => y.score - x.score).slice(0, topK);
  }
}
```
  (Delete the stray unused `tf` field when implementing — keep it clean.)
- [ ] `npx vitest run` → green.
- [ ] `src/agent/corpus.ts`: build `CorpusChunk[]` from content modules (1 chunk per flagship problem/approach/logline-group, per role, per archive entry, 1 profile chunk; each with `anchor` = pane/element id). `tests/corpus.test.ts`: ~8 canned queries → expected top chunk id (e.g. "what has he shipped to production" → mihin chunk; "does he know go" → queue or linkvault; "is he looking for work" → profile).
- [ ] `src/agent/provider.ts`: `interface AnswerProvider { answer(q: string): Promise<AgentAnswer> }`; `AgentAnswer = { steps: ToolStep[]; text: string; citations: { title: string; anchor: string }[] }`; `LocalRetrievalProvider` = BM25 search → assemble text from chunk excerpts with bracketed citations (template intros keyed by chunk kind; if no hits: honest "nothing indexed for that — try …" + 3 suggestion chips). NO fake gap-papering (old site's sin).
- [ ] Commit `feat: client-side BM25 agent core with tests`.

### Task 4: Motion + console primitives

- [ ] `src/lib/springs.ts` — complete:
```ts
import { useEffect, useRef, useState } from "react";
export const reducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
/** critically-damped-ish spring toward target; returns animated value */
export function useSpring(target: number, stiffness = 170, damping = 24) {
  const [v, setV] = useState(target);
  const ref = useRef({ v: target, vel: 0, target });
  ref.current.target = target;
  useEffect(() => {
    if (reducedMotion()) { setV(target); return; }
    let raf = 0, last = performance.now();
    const tick = (now: number) => {
      const s = ref.current, dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      const a = stiffness * (s.target - s.v) - damping * s.vel;
      s.vel += a * dt; s.v += s.vel * dt;
      setV(s.v);
      if (Math.abs(s.target - s.v) > 1e-3 || Math.abs(s.vel) > 1e-3) raf = requestAnimationFrame(tick);
      else setV(s.target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, stiffness, damping]);
  return v;
}
export function useRafLoop(cb: (t: number, dt: number) => void, running = true) {
  const cbRef = useRef(cb); cbRef.current = cb;
  useEffect(() => {
    if (!running) return;
    let raf = 0, last = performance.now(); const start = last;
    const tick = (now: number) => {
      cbRef.current((now - start) / 1000, Math.min(0.05, (now - last) / 1000));
      last = now; raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running]);
}
```
- [ ] `src/lib/useInView.ts` (once-true IO hook, 700ms reveal deadline fallback like old site); `src/lib/scrollBus.ts` (module-level: tracks scrollY velocity via rAF; `subscribe(cb)`; `pulse(intensity)` for activity events — palette/sims call `pulse`).
- [ ] `GlyphDecode.tsx`: chars resolve left→right from glyph pool `▓▒░◆◇/\\|=+*#`; duration ∝ length (cap 900ms); reduced-motion → static. Used for pane titles only.
- [ ] `NumberTicker.tsx`: on first in-view, spring-count to `Metric.value`, render prefix/suffix/decimals.
- [ ] `Chip.tsx`: mono label + kind glyph (`↗` link, `▶` video, `¶` paper, `●` live); magnetic hover (translate toward cursor ≤3px, spring back); themed border; real `<a>`/`<button>`.
- [ ] `Pane.tsx`: `<section id anchor-label number>`; on first in-view: border draws (clip-path or scaleX/Y pseudo-elements), `.mono-label` pane number + GlyphDecode title, children rows get `data-stamp` staggered 30ms dot-matrix stamp-in (opacity steps(2), translateY 4px). Exposes CSS var `--pane-progress` if needed.
- [ ] Visual check in dev server (screenshot harness), commit `feat: motion primitives and pane shell`.

### Task 5: Hero + StatusHeader + photo conversion

- [ ] `scripts/photos.sh` — complete:
```bash
#!/bin/bash
mkdir -p public/photos
for f in photos/*.png photos/*.jpeg; do
  base=$(basename "${f%.*}")
  sips -s format webp -s formatOptions 78 --resampleHeightWidthMax 1400 "$f" --out "public/photos/$base.webp"
done
```
  Run; verify each webp < 150KB (`du -sh public/photos`). me.jpeg → me.webp.
- [ ] `Hero.tsx`: nameplate `SHANMUKHA CHATADI` (Archivo, width-axis wide, caps, clamp 56–140px, tight); under it role line + status row (heartbeat dot `● AVAILABLE NOW`, location, `OPEN TO RELOCATE`); right: **operator badge** — me.webp in a bordered card with mono rows (OPERATOR ID / NC STATE MS CS '26 / RALEIGH NC), subtle 1° tilt, hover springs flat. Below: three live readouts (YEARS 2.5+, USERS IN PROD 230+, PUBLICATIONS 3) as NumberTickers.
- [ ] `StatusHeader.tsx`: fixed top bar — brand `chatadi.sys`, mini-trace (6 ticks = panes; active tick glows + playhead position from scroll), theme toggle (`◐`), palette button (`⌘K` label, `ASK/JUMP`). Backdrop blur, hairline bottom border.
- [ ] Screenshot check both viewports; commit `feat: hero nameplate, operator badge, status header`.

### Task 6: Trace pane

- [ ] `Trace.tsx`: SVG waterfall, x = 2022→2026.5, rows = roles (from `Role.spanStart/End`) + nested flagship spans; mono year gridlines; spans draw in (scaleX from left, staggered) on first view; click span → `scrollIntoView` of matching pane + phosphor pulse on arrival; hovering span shows readout (org, period, one-liner). Mobile: same SVG, horizontally scrollable if needed, taller rows.
- [ ] Scroll-spy: observer marks active pane → StatusHeader mini-trace + Trace playhead line.
- [ ] Commit `feat: career trace as navigable waterfall`.

### Task 7: SimShell + QueueSim (pattern-setter)

- [ ] `SimShell.tsx`: surface card; mono title bar (`SIM · <NAME>` left, `● RUNNING/IDLE` right); body slot; activates on IO, pauses on `document.hidden`; **crosshair overlay**: on pointermove inside body (non-touch), render crosshair lines + corner readout chip `(x,y,value?)` fed by sim via context callback; touch devices: none. `pulse()` on user interaction.
- [ ] `QueueSim.tsx`: load slider (real `<input type=range>` styled) → producers emit task dots into a queue bar (depth = springy height fill); worker pods grid (2–8): pods elastic-pop in/out per simple HPA rule (`workers = clamp(2, 8, ceil(depth/12))`, 1.5s reaction lag); pods consume dots (dot flies pod-ward, shrinks); 8% of tasks fail → retry arc with backoff label; 3rd failure → dead-letter row at bottom, row shudder (translateX spring); tickers: THROUGHPUT/s, P95 LATENCY (derived from sim state), DEPTH. All SVG + useRafLoop.
- [ ] Verify 60fps (no long tasks in performance trace), idles when offscreen. Commit `feat: sim shell + live HPA queue sim`.

### Task 8: ScholarSim

- [ ] Real 7-node graph laid out left→right (router, retriever, grader, rewriter [loop-back edge], generator, hallucination-check [gate], synthesizer). Controls: RUN (auto ~6s) / STEP. Execution token travels edges; nodes pulse signal when active; grader visibly fails doc#2 (chip turns danger, falls away) → rewriter edge lights, loop animates once → pass; hallucination gate flashes HOLD then PASS; output line types: "answer grounded · 4/4 claims cited". Side readout: `+35% groundedness vs naive RAG · 10K+ papers · 99% cascade uptime`.
- [ ] Commit `feat: scholaragent langgraph execution sim`.

### Task 9: MihinSim

- [ ] Two-phase diagram. Phase A "request path": user dot → Cognito (badge check) → API Gateway → Lambda → Bedrock/Claude → response path back, latency readout ticks. Phase B "agent mesh": 3 agent cards (different frameworks labeled) publish Agent Cards (card glyph pops above), discover each other via A2A (dashed handshake lines), one calls an MCP tool chip (HL7/FHIR). Toggle between phases or auto-alternate. Counter row: 230+ USERS · 20+ BOTS · 10K+ DOCS · −30% UNGROUNDED · −60% MTTD (NumberTickers).
- [ ] Commit `feat: mihin platform + a2a mesh sim`.

### Task 10: McpSim (live openFDA)

- [ ] Preset query buttons (no free text): "warfarin × aspirin interactions", "adverse events: metformin", "ICD-10: diabetic foot ulcer" (NLM Clinical Tables API — also CORS/keyless; verify with curl during build, else openFDA-only). Flow: press → MCP tool-select animation (tool chips, one highlights) → real `fetch` to API → response JSON streams into a mini terminal (truncated, syntax-tinted) → human-readable result card. Status line: `LIVE · api.fda.gov` ; on fetch error → canned response, status `CACHED · network unavailable`, visibly labeled.
- [ ] Verify live call works in headless run (network OK) and fallback works (devtools offline).
- [ ] Commit `feat: mcp sim with live openFDA calls`.

### Task 11: PruningSim

- [ ] 11×11 lower-tri heatmap of pairwise CKA (labels = config grid timing×ratio, e.g. `E30 E50 … L97`); cell color ramps muted→signal by value; hover (or tap) cell → readout `CKA 0.81 · mistake overlap 0.64`. Side panel: scatter (CKA vs Jaccard overlap, 55 pts) with fitted line and `r = +0.95` label; below: `probe: 89.2% from ONE image (chance 25%)`. Data: `pruningData.ts` constructed to honor published stats (spread 0.73–0.95, monotone relation w/ noise, r≈0.95) — labeled "reconstructed from study results"; swap to real CSV if user provides.
- [ ] Commit `feat: pruning study cka explorer`.

### Task 12: Flagship pane template + wiring

- [ ] `Flagship.tsx`: header row (status chip pulses if PROD; name as GlyphDecode h2; period; chips right), sim slot, spec rows (`PROBLEM` / `APPROACH` k/v with stamp-in), metric strip (NumberTickers), `INCIDENT LOG` block (log lines, mono, `>` prefixed, muted with signal timestamps). Map all five flagships in App; anchors `work-mihin` etc.
- [ ] Screenshot all five desktop+mobile; commit `feat: flagship service pages wired`.

### Task 13: Palette + agent UI + keyboard

- [ ] `Palette.tsx`: open via ⌘K | / | header btn | mobile FAB. Scanline-dim backdrop (gradient sweep 250ms), panel spring-drop. Input row `>` prompt. Mode A list: pane jumps + actions (theme, copy email, resume) fuzzy-filtered, arrow/enter, hovered rows phosphor-trail. Mode B (enter on non-command): steps render as chips sequentially (`⚙ search_corpus("…")` → `n hits`), then answer streams typewriter w/ block cursor; citation chips below deep-link (close palette, scroll, pulse pane). Honest footer: `local BM25 · in your browser · no API · no tracking`. Esc/click-out closes; focus-trapped; aria-combobox.
- [ ] `Keymap.tsx`: `?` overlay listing keys; `j/k` scroll panes; `g h/w/a/c` jumps. Ignore keys while palette open or input focused.
- [ ] Manual QA: keyboard-only run-through. Commit `feat: command palette with visible agent pipeline`.

### Task 14: Archive + FieldLog + Contact

- [ ] `Archive.tsx`: dense table rows (year · name · one-liner · chips · `+`); expand = height spring + detail para + chips; kind filters (ALL/PROJECTS/PAPERS/CERTS) as chips. Parameter Golf row leads with `0.8128 bpb (−27%)`.
- [ ] `FieldLog.tsx`: responsive grid of webp photos, mono caption bar (`place · caption`), hover lifts 2px + signal hairline; lazy-loaded; lightbox = none (YAGNI).
- [ ] `Contact.tsx`: big `OPEN FOR WORK` block, email chip (copies, shows `COPIED ✓` + pulse), GitHub/LinkedIn chips, `RESUME.PDF` chip → `/resume.pdf` (`cp ~/Downloads/Shanmukh_Chatadi_AI.pdf public/resume.pdf`). Footer: `chatadi.sys · built by hand · view source ↗ (repo)`.
- [ ] Commit `feat: archive table, field log, contact pane`.

### Task 15: Boot + SignalLayer + phosphor + CRT theme flip

- [ ] `Boot.tsx`: sessionStorage `booted` guard; overlay: 120ms white flash → scanline sweep (200ms) → `chatadi.sys v2.0` + 4 status lines race in (mono, 60ms apart) → nameplate GlyphDecode handoff → overlay lifts. Total ≤1.5s; any key/click skips; reduced-motion or `booted` → skip entirely.
- [ ] `SignalLayer.tsx` fragment shader (full-screen fixed canvas behind content, opacity .07 graphite / .05 paper, `mix-blend: screen` graphite only):
```glsl
precision mediump float;
uniform float u_t; uniform float u_amp; uniform vec2 u_res; uniform vec3 u_tint;
float wave(vec2 uv, float phase, float freq, float amp){
  float y = 0.5 + sin(uv.x*freq + phase)*amp*0.18;
  return smoothstep(0.012, 0.0, abs(uv.y - y));
}
void main(){
  vec2 uv = gl_FragCoord.xy / u_res;
  float a = clamp(u_amp, 0.08, 1.0);
  float s = wave(uv, u_t*1.7, 9.0, a) + wave(uv, -u_t*1.1+2.0, 14.0, a*0.6)*0.5;
  float scan = 0.04*sin(gl_FragCoord.y*3.14159);
  gl_FragColor = vec4(u_tint*(s+scan), s*0.8+0.05);
}
```
  `u_amp` = lerp(scroll velocity norm, activity pulse from scrollBus); DPR cap 1.5; pause hidden tab; skip if no WebGL/reduced-motion. u_tint from theme signal color (convert hex).
- [ ] Phosphor trails: util `phosphorPulse(el)` — clones a glow ring/box at el rect, animates opacity 0.6→0, scale 1→1.06, 600ms, removes; pool max 12. Call sites: trace span click target, palette selection, sim events, archive expand.
- [ ] `flipTheme()`: overlay animates scaleY 1→0.004 (120ms, bg current theme) → swap `data-theme` → scaleY back w/ slight overshoot + 80ms brightness flash. Reduced-motion → instant swap.
- [ ] Commit `feat: boot sequence, signal layer, phosphor system, crt theme flip`.

### Task 16: SEO, a11y, perf pass

- [ ] `index.html` head: title/desc/canonical, OG+Twitter incl. `og:image` `https://shanmukha-chatadi.vercel.app/og.png`, JSON-LD Person (port from old site; email updated; add ChimeraAR/MCP/etc to makesOffer), noscript summary block. Update `public/llms.txt` to new structure. Favicon: phosphor block-cursor mark on graphite rounded square.
- [ ] `scripts/og.html` (static 1200×630 console card: nameplate, status row, trace ticks) + screenshot via existing Puppeteer harness → `public/og.png`.
- [ ] a11y sweep: tab order, focus rings, aria labels on sims/palette, contrast spot-checks (muted on bg ≥ 4.5 for body sizes), `alt` on photos.
- [ ] Perf: `npm run build` → check gzip sizes (`du`, vite report); `npx lighthouse <preview-url>` → require ≥95 perf/a11y/SEO (mobile pass ≥90 perf acceptable, note result); fix offenders (font subset, photo sizes, shader cost).
- [ ] Full Puppeteer run: per-pane screenshots both viewports, zero console errors, reduced-motion run renders all content.
- [ ] Commit `feat: seo meta, og image, a11y and perf pass`.

### Task 17: Paper theme QA + cleanup + handoff

- [ ] Walk every pane in paper theme; fix contrast/glow artifacts (shader opacity, chip borders, heatmap ramp).
- [ ] `git rm -r _old photos` (originals preserved in git history + /tmp backup); update README.md for new stack.
- [ ] Final Puppeteer + Lighthouse on preview URL. Push.
- [ ] **Checkpoint: send user the preview URL for approval. Only after approval: merge `redesign` → `main` (production deploy), verify live, mark task #1 complete.**

---

## Self-review notes
- Spec coverage: §2 stack→T0/1; §3 tokens→T1; §4 panes→T5/6/12/14; §5 sims→T7–11; §6 agent→T3/13; §7 motion→T4/15; §8 content→T2; §9 SEO→T16; §10 a11y→T16; §11 mobile→each task's screenshot step; §12 rollout→T0/T17; §13 deletions→T0/T17. No gaps.
- Naming consistency: `useSpring/useRafLoop/scrollBus.pulse/phosphorPulse/flipTheme/SimShell/AnswerProvider` used consistently above.
- openFDA CORS + NLM Clinical Tables to be re-verified with curl at T10 before relying on them.
