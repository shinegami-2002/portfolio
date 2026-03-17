# Portfolio Redesign: Full Design Specification

**Owner:** Shanmukha Chatadi (shinegami-2002)
**Date:** 2026-03-16
**Approach:** Cosmic Hybrid (3D space environment + cyberpunk design language)
**Build effort:** High
**Deploy target:** Vercel (static export via Next.js SSG)

---

## 1. Overview

Ground-up redesign of https://shinegami-2002.github.io/sssc/ into a visually stunning, 3D-immersive, interactive single-page portfolio. The site tells Shanmukha's story as an Applied AI/ML Engineer through a cosmic/cyberpunk-themed experience with real 3D elements (React Three Fiber), scroll-driven animations, and interactive visualizations.

**Design philosophy:** Professional enough for recruiters to scan in 30 seconds, impressive enough for engineers to remember. The 3D layer is atmospheric and interactive but never blocks content. Cyberpunk/space references are subtle accents, not full cosplay.

**Target audience:**
- Recruiters and hiring managers at tech companies (primary, 30-60 second scan)
- Engineering peers and technical interviewers (secondary, deeper exploration)
- Anyone who lands on the site (should leave impressed)

---

## 2. Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Next.js 14 (App Router) | SSG, routing, image optimization |
| Language | TypeScript | Type safety throughout |
| Styling | Tailwind CSS v3.4 | Utility-first, responsive |
| 3D Engine | React Three Fiber + @react-three/drei | Persistent 3D background, interactive constellation |
| Animation (scroll) | GSAP + ScrollTrigger | Scroll-driven sequences, timeline animations |
| Animation (component) | Framer Motion | Component transitions, hover effects, layout animations |
| UI Components | Magic UI (shimmer, meteors, cards) | Pre-built animation primitives |
| UI Components | Aceternity UI (3D cards, text effects, backgrounds) | Advanced interactive effects |
| Base Components | shadcn/ui | Accessible primitives (buttons, tooltips) |
| Icons | Lucide React (UI), Simple Icons (brands/tech) | Consistent icon system |
| Fonts | Google Fonts (Space Grotesk, DM Sans, JetBrains Mono) | Typography system |
| Deploy | Vercel | Edge CDN, automatic HTTPS, preview deploys |

### Why this stack

- **Next.js SSG:** Fully static export = blazing fast on Vercel's edge CDN. No server needed.
- **R3F over raw Three.js:** React component model for 3D. Easier to integrate with scroll state, props, and lifecycle. drei provides ready-made helpers (Stars, Float, OrbitControls).
- **GSAP + Framer Motion (both):** GSAP excels at scroll-driven timeline sequences (ScrollTrigger). Framer Motion excels at component-level animations (whileInView, layoutId, AnimatePresence). They complement each other.
- **Magic UI + Aceternity:** Battle-tested animation components. No need to hand-write shimmer effects, meteor showers, or 3D card tilts from scratch. Copy, customize, ship.

---

## 3. Color System

### Palette: Quantum Space

Derived from UI/UX Pro Max database: Quantum Computing (#91) + Space Tech (#90) + Cyberpunk UI style, customized.

```
Background (deep space):
  --bg-deep:     #050510   (page background, OLED-friendly)
  --bg-card:     #0a0a1a   (card/surface backgrounds)
  --bg-elevated: #0f172a   (nav, elevated surfaces)

Accents (neon):
  --accent-cyan:    #00f2ff   (primary: links, active states, hero glow)
  --accent-magenta: #ff00c1   (secondary: highlights, hover states, emphasis)
  --accent-blue:    #4d88ff   (tertiary: tags, borders, subtle accents)

Text:
  --text-primary: #e0e6f0   (main body text)
  --text-muted:   #8899a6   (secondary text, descriptions, labels)

Utility:
  --border-subtle: rgba(255,255,255,0.06)
  --border-accent: rgba(0,242,255,0.15)
  --glow-cyan:     rgba(0,242,255,0.15)
  --glow-magenta:  rgba(255,0,193,0.15)
```

### Glassmorphism Values

```css
/* Card glass */
background: rgba(255,255,255,0.03);
backdrop-filter: blur(16px);
border: 1px solid rgba(255,255,255,0.06);

/* Nav glass */
background: rgba(5,5,16,0.80);
backdrop-filter: blur(20px);
border-bottom: 1px solid rgba(255,255,255,0.06);

/* Glow effects */
box-shadow: 0 0 30px rgba(0,242,255,0.15);
```

### Color Rules

- Contrast ratio: 4.5:1 minimum for all text (WCAG AA)
- Neon colors (#00f2ff, #ff00c1) are accents only, never body text on dark backgrounds
- Each section subtly shifts the 3D background's color temperature (more cyan in hero, more magenta in projects, etc.)

---

## 4. Typography

From UI/UX Pro Max: Tech Startup pairing (#3) + Developer Mono (#9).

### Font Stack

| Role | Font | Weights | Usage |
|------|------|---------|-------|
| Display/Headings | Space Grotesk | 400, 500, 600, 700 | Section headers, hero name, card titles |
| Body | DM Sans | 300, 400, 500, 700 | Paragraphs, descriptions, nav links |
| Code/Terminal | JetBrains Mono | 400, 500 | Tech tags, terminal section, code snippets, timestamps |

### Type Scale

```
Hero name:        Space Grotesk 700, clamp(3rem, 8vw, 6rem)
Section headers:  Space Grotesk 600, clamp(2rem, 4vw, 3rem)
Card titles:      Space Grotesk 500, 1.25rem
Body:             DM Sans 400, 1rem (16px min on mobile)
Muted/labels:     DM Sans 400, 0.875rem
Code/tags:        JetBrains Mono 400, 0.75-0.875rem
```

### Tailwind Config

```js
fontFamily: {
  heading: ['Space Grotesk', 'sans-serif'],
  body: ['DM Sans', 'sans-serif'],
  mono: ['JetBrains Mono', 'monospace'],
}
```

---

## 5. 3D Layer (React Three Fiber)

The centerpiece. A persistent R3F `<Canvas>` behind ALL page content, not just the hero.

### 5.1 Background Scene (always visible)

| Element | Implementation | Count | Notes |
|---------|---------------|-------|-------|
| Starfield | drei `<Stars />` (instanced) | ~2000 points | Multiple depth layers, varying sizes/opacities. Slowly rotating. |
| Nebula clouds | Sprite textures with additive blending | 2-3 | Semi-transparent, slowly drifting. Colors: cyan, magenta, deep blue. |
| Floating geometries | Wireframe polyhedra (icosahedron, octahedron, torus knot) | 4-5 | Low opacity, glass-like material with edge glow. Orbiting slowly at different depths. |
| Mouse parallax | Camera follows mouse with damped lerp | - | Subtle, max 2-3 degree rotation. Creates depth on cursor movement. |
| Scroll depth | Camera z-position shifts with scroll progress | - | "Moving through space" feeling. |

### 5.2 Section-Specific 3D

| Section | 3D Element | Details |
|---------|-----------|---------|
| Hero | Rotating icosahedron | drei `<MeshDistortMaterial>` for organic distortion. Holographic/iridescent custom shader. Reacts to mouse proximity. |
| Hero | Photo plane | Circular plane with photo texture. Scan-line shader overlay. Subtle glow pulse. |
| Skills | Interactive 3D constellation | Each skill = glowing sphere. Connected by line geometries. Drag to rotate (constrained `<OrbitControls>`). Click node for details panel. |
| Beyond the Code | 3D flip cards | CSS 3D transforms (not R3F). Front: icon + title. Back: detail. |

### 5.3 Performance Strategy

- Canvas DPR: `dpr={[1, 1.5]}` (not full retina)
- Instanced meshes for all particles (single draw call)
- `frameloop="demand"` when canvas not in viewport (Intersection Observer)
- Mobile: reduce stars to 500, disable floating geometries, keep starfield
- `prefers-reduced-motion`: freeze all 3D, render single static frame as fallback
- Lazy-load R3F canvas via `next/dynamic` with `ssr: false` (not in initial bundle)
- Target: R3F chunk < 250KB gzipped (Three.js core ~150KB + R3F ~40KB + drei tree-shaken ~60KB)
- Import drei components from subpaths, not barrel export, for aggressive tree-shaking

### 5.4 Loading & Error States

- **While R3F loads:** Show a CSS-only fallback: the `--bg-deep` background with a CSS radial gradient mimicking the nebula (no JS needed). This appears instantly and is replaced when the canvas mounts.
- **WebGL detection:** Check `WebGLRenderingContext` support before mounting the canvas. If unavailable (some corporate browsers), keep the CSS fallback permanently. No error shown to user.
- **R3F crash:** Wrap `<Canvas>` in a React error boundary. On crash, unmount canvas and show CSS fallback. Log error to console.

### 5.5 Scroll State Architecture

A single `useScrollProgress` custom hook (in `src/hooks/`) is the source of truth for scroll position. It exposes a normalized 0-1 scroll value and per-section progress values.

**Domain separation:**
- **GSAP ScrollTrigger:** Handles scroll-triggered entrance animations (section reveals, timeline glow, header clip-path). These are fire-once animations tied to scroll position. GSAP pins nothing.
- **Framer Motion:** Handles component-level animations (`whileInView`, `whileHover`, `layoutId`, `AnimatePresence`). Does NOT read raw scroll position. Uses intersection observer internally.
- **R3F camera:** Reads from `useScrollProgress` via a shared Zustand store or React context. The hook writes to the store on scroll, the R3F `useFrame` loop reads from it. No direct DOM scroll listener inside the canvas.

**Rule:** GSAP and Framer Motion never animate the same DOM element. GSAP handles section-level orchestration, Framer Motion handles individual component transitions. R3F reads scroll state from the shared store only.

---

## 6. Page Structure & Section Flow

Single-page scroll application. 10 sections, each with scroll-triggered entrance animations.

```
Section    | Nav Label       | Layout                        | 3D Tint
-----------|-----------------|-------------------------------|--------
01 Hero    | -               | Full viewport, centered       | Cyan dominant
02 About   | About           | Text left + Stats grid right  | Neutral
03 Experience | Experience   | Vertical timeline, left-aligned | Cyan/blue
04 Projects | Projects       | Filterable 2-col grid         | Magenta tint
05 Skills  | Skills          | Full-width 3D constellation   | Blue dominant
06 Publications | Publications | 2-col card layout           | Neutral
07 Education | Education     | 2-col card layout             | Neutral
08 Leadership & Achievements | Leadership | Compact cards + achievement highlights | Neutral
09 Beyond the Code | Beyond  | 3x2 flip card grid            | Warm/playful
10 Contact | Contact         | Terminal-style + CTA buttons  | Cyan glow
```

### Navigation

- **Floating glassmorphism navbar** (Aceternity `Floating Navbar` or custom)
- Appears after scrolling past hero (GSAP ScrollTrigger)
- Active section indicator: glowing dot next to current section
- Smooth scroll to section on click
- Mobile: hamburger menu with slide-in panel (Framer Motion)
- Includes: name/logo, section links, resume download button

---

## 7. Section Designs

### 7.1 Hero

**Layout:** Full viewport (100dvh). Centered content. R3F 3D background intensified.

**Elements:**
- Rotating 3D icosahedron (R3F, left of center or behind name)
- Your photo in circular frame with holographic treatment (scan-line overlay, glow pulse)
- Name: "Shanmukha Chatadi" with Magic UI `ShinyText` shimmer animation
- Subtitle: Typewriter effect (Aceternity `Typewriter Effect`) cycling through:
  - "Applied AI/ML Engineer"
  - "Building Agentic AI Systems"
  - "Published Researcher (Springer, IEEE)"
  - "MS CS @ NC State '26"
- CTA buttons: "View Projects" (primary), "Download Resume" (secondary), GitHub icon, LinkedIn icon
- Scroll indicator: animated mouse icon at bottom

**Entry animation:** GSAP timeline. Staggered: photo fades in > name characters reveal > subtitle types > CTAs slide up > scroll indicator fades in.

### 7.2 About

**Layout:** Text block left, stats grid right. Below hero.

**Content:** Resume summary paragraph (the strong one from AI/ML resume, NOT the current site's weak version).

**Stats grid (2x2):**
| Stat | Value | Color |
|------|-------|-------|
| Years Experience | 3+ | Cyan |
| Projects Shipped | 7+ | Magenta |
| Publications | 2 | Blue |
| Users Served | 230+ | White |

**Animation:** Magic UI `NumberTicker` for stat count-up on scroll into view. Staggered card entrance (Framer Motion `staggerChildren`).

### 7.3 Experience

**Layout:** Vertical timeline with glowing line on the left. Cards to the right of the line.

**Content (3 entries, from resumes):**

1. **AI Research Intern, MiHIN** (Jul 2025 - Present) - EXPANDED by default
   - All 5 bullets from AI/ML resume
   - Tech tags: AWS Bedrock, RAG, OpenSearch, Lambda, Python, Cognito
   - Accent: Cyan (current/active role)

2. **Data & Software Development Analyst, Rygen BioPharma** (Mar 2023 - Aug 2024) - Collapsed, click to expand
   - Full bullets from resume (ML pipelines, ETL, Docker/K8s, CI/CD)
   - Fixed title (not "Data Analyst"), fixed dates (not truncated)
   - Accent: Magenta

3. **Data Science Intern, TreoSoft IT Solutions** (Jun 2022 - Sep 2022) - Collapsed
   - Resume bullets (recommendation engine, Flask, PostgreSQL)
   - Accent: Blue

**Animation:**
- Timeline line glows/pulses as you scroll past
- Cards fade in with staggered delay (Framer Motion `whileInView`)
- Timeline dots pulse when their card becomes active
- Expand/collapse: Framer Motion `AnimatePresence` with height animation

### 7.4 Projects

**Layout:** Filter bar at top + responsive grid (2-col desktop, 1-col mobile).

**Filter buttons:** All | AI/ML | Backend | Full-Stack | Research

**7 project cards (from project bank + resumes):**

| # | Project | Tags | Accent | GitHub |
|---|---------|------|--------|--------|
| 1 | ScholarAgent | LangGraph, ChromaDB, Next.js, TypeScript | Cyan | Yes |
| 2 | MCP Healthcare Server | FastMCP, httpx, Docker, CI | Magenta | Yes |
| 3 | LinkVault (Go API Platform) | Go, PostgreSQL, Redis, JWT | Blue | Yes |
| 4 | Distributed Task Queue | Go, gRPC, Kubernetes, Prometheus | Cyan | Yes |
| 5 | Neural Network Pruning | PyTorch, ResNet-18, ViT-Tiny, UMAP | Magenta | No (research) |
| 6 | LLMs4PCG | Phi-3, Gemma-2, ViT, Prompt Eng | Blue | No (research) |
| 7 | AI ChatBot | FastAPI, LangChain, Docker | Cyan | Yes |

**Card design:** Glassmorphism card with:
- Title (Space Grotesk 500)
- Date range (JetBrains Mono, muted)
- 2-line description
- Tech tags (pill badges)
- GitHub link button (if available)
- "Details" expand button

**3D hover effect:** Aceternity `3D Card Effect` or custom implementation:
- Card tilts toward cursor position (max 8 degrees rotateX/Y)
- Cursor-following glow spotlight (Magic UI `MagicCard`)
- Border glow intensifies on hover
- Subtle scale(1.02) on hover

**Expand behavior:** Click "Details" to expand card showing full resume bullets. Framer Motion `layoutId` for smooth expand animation.

**Filter animation:** Framer Motion `layout` prop on grid items for smooth reflow when filtering.

### 7.5 Skills Constellation

**THE showstopper.** Full-width section with an interactive 3D constellation rendered in React Three Fiber.

**Data structure:**
```typescript
interface SkillNode {
  name: string;
  category: 'ai-ml' | 'languages' | 'cloud' | 'web' | 'databases' | 'libraries';
  proficiency: number; // 1-5, determines sphere size
  connections: string[]; // names of connected skills
}
```

**Categories and their 3D colors:**
- AI/ML: Cyan (#00f2ff)
- Languages: Magenta (#ff00c1)
- Cloud & DevOps: Blue (#4d88ff)
- Web & Frameworks: White/silver
- Databases: Green-tinted cyan
- Libraries: Purple-tinted magenta

**3D Implementation:**
- Each skill = instanced glowing sphere at a position in 3D space
- Sphere size based on proficiency (1-5 scale)
- **Pre-computed positions:** Skill coordinates stored in `src/data/skills.ts` as `{x, y, z}` per skill. Categories form spatial clusters (AI/ML top-left, Languages bottom-right, etc.). Positions hand-tuned, no runtime physics simulation.
- Connected skills have glowing line geometries between them. **Max 3 connections per node** to prevent visual clutter. Connections based on co-occurrence in projects.
- drei `<OrbitControls>` with constrained angles (maxPolarAngle=Math.PI*0.7, minPolarAngle=Math.PI*0.3)
- Camera auto-rotates slowly when not interacting (autoRotate, autoRotateSpeed=0.5)

**Interactions:**
- Drag to rotate the constellation
- Hover on node: shows skill name tooltip (drei `<Html>`) + highlights connected nodes/lines (others dim to 0.2 opacity)
- Click on node: side panel slides in showing which projects/experience use that skill
- Mobile fallback: categorized grid with tech tag pills grouped under category headings (no 3D, no drag). Clean and scannable.

**Skills data (from resumes):**
- AI/ML: RAG, Agentic RAG, LLMs, NLP, Multi-Agent Systems, MCP, Deep Learning, CNNs, Transformers, Computer Vision, Fine-tuning, Transfer Learning, HITL, MLOps
- Languages: Python, TypeScript, JavaScript, Go, SQL, C++, Java, Bash
- Cloud & DevOps: AWS (Bedrock, SageMaker, Lambda, S3, OpenSearch, EKS, EC2, API Gateway, Cognito), Docker, Kubernetes, GitHub Actions, Jenkins, CI/CD, Git
- Web & Frameworks: Next.js, React, Node.js, FastAPI, Flask, Django, REST APIs, GraphQL
- Databases: PostgreSQL, MongoDB, MySQL, Redis, OpenSearch, Vector Databases
- Libraries: LangGraph, LangChain, AWS Bedrock, ChromaDB, OpenSearch k-NN, Hugging Face, PyTorch, TensorFlow, scikit-learn, Pandas, NumPy, XGBoost, spaCy

### 7.6 Publications

**Layout:** 2 cards side by side (1-col on mobile).

**Cards:**
1. "Potato Disease Classification Using ML Models" - HIS 2023 (Springer)
   - Authors: C. Shanmukha Srinivas Sai et al.
   - Status: Published (NOT "Accepted & To be Published")
   - Badge: Springer logo (Simple Icons)

2. "Tea Leaf Disease Classification with Ensemble Stacking" - ICDLAIR 2024 (IEEE)
   - Authors: Somesh K, C. Shanmukha Srinivas Sai et al.
   - Status: Published
   - Badge: IEEE logo (Simple Icons)

**Animation:** Cards fade in with Framer Motion `whileInView`. Hover lifts card with depth shadow.

### 7.7 Education

**Layout:** 2 cards, side by side.

**Cards (from resumes, NO high school):**
1. **North Carolina State University** - MS Computer Science (Data Science Track), GPA 3.71, Aug 2024 - Jun 2026
2. **National Institute of Technology Puducherry** - BTech Computer Science & Engineering, GPA 8.48/10, Dec 2020 - Mar 2024

**Coursework tags:** Deep Learning, Machine Learning, Neural Networks, Algorithms, Software Engineering, DBMS

### 7.8 Leadership & Achievements

**Layout:** Two sub-sections stacked. Leadership as compact card grid (3-col desktop, 1-col mobile). Achievements as a horizontal row of highlight badges below.

**Leadership (3 entries, most impactful only):**
1. President, Rotaract Club, NITPY (2022-2023) - 10+ events, blood donation camps
2. Vice-President, ACE (CS Association), NITPY (2022-2023) - workshops, hackathons
3. Co-founder, Zer01Coded, NITPY (2021-2022) - coding club, 150+ students taught Python

**Achievements (displayed as glowing badge/pill items in a row):**
1. 1st place: Blind Coding Challenge, Gyanith Tech Fest, NIT Puducherry (2023)
2. 3rd prize: Hackathon, NIE Mysore, ~90 competitors (2023)
3. All India Rank 206: Inter NIT coding marathon, MNIT Bhopal (2022)
4. 99.1 percentile: JEE-Mains (top 1% of 1M+ students) (2020)

### 7.9 Beyond the Code

**Layout:** 3x2 grid of flip cards. The personality section.

**Cards (front: SVG icon + title, back: detail):**

| Icon (Lucide) | Title | Back |
|---------------|-------|------|
| Trophy | Basketball Captain | Inter-department winner at NIT PY. Runners-up captain in juniors. |
| Telescope | Astronomy Nerd | Space enthusiast. Yes, that's why the whole site is a cosmic theme. |
| Gamepad2 | Cyberpunk 2077 | Game + Edgerunners anime. V would approve of this portfolio. |
| Scissors | Origami Speedster | 1st place, Origami competition, NIT PY cultural fest. |
| Dumbbell | Weightlifting | 1st place, NIT PY competition. |
| GraduationCap | Teaching | Taught physics to underprivileged JEE students. Python classes for 150+ students. |

**3D flip:** CSS `transform: rotateY(180deg)` with `perspective` and `backface-visibility: hidden`. Triggered on click (both desktop and mobile) with a subtle wobble hint animation to indicate interactivity. Hover causes a slight tilt (Direction Aware Hover from Aceternity) as affordance.

### 7.10 Contact

**Layout:** Terminal-style display + large CTA buttons below.

**Terminal block:**
```
shanmukha@portfolio ~ $ cat contact.json
{
  "email": "schatad@ncsu.edu",
  "linkedin": "linkedin.com/in/shanmukha-chatadi",
  "github": "github.com/shinegami-2002",
  "location": "Raleigh, NC",
  "status": "Open to opportunities"
}
```

**Animation:** Aceternity `Typewriter Effect` or custom typing animation reveals each line sequentially. Links are clickable.

**Below terminal:** Large CTA buttons for Email and LinkedIn. Shimmer button effect (Magic UI `ShimmerButton`).

---

## 8. Micro-Interactions & Motion Design

### 8.1 Scroll Animations

| Trigger | Effect | Implementation |
|---------|--------|---------------|
| Section enters viewport | Fade in + slide up | Framer Motion `whileInView` with `staggerChildren: 0.1` |
| Section header enters | Clip-path reveal left-to-right | GSAP ScrollTrigger |
| Timeline dot reached | Pulse glow | GSAP ScrollTrigger |
| 3D background | Parallax depth shift | `useScroll` + `useTransform` (Framer Motion) mapped to R3F camera |
| Stats section | Numbers count up from 0 | Magic UI `NumberTicker` |

### 8.2 Hover Effects

| Element | Effect | Implementation |
|---------|--------|---------------|
| Project cards | 3D tilt + cursor glow | Aceternity `3D Card Effect` / Magic UI `MagicCard` |
| Nav links | Underline slides in from left | CSS `::after` with `scaleX` transition |
| Buttons | scale(1.02) + glow intensify | Framer Motion `whileHover` |
| Tech tags | Background fill transition | CSS `background-color` transition 200ms |
| Timeline cards | Border glow intensifies | CSS `box-shadow` transition |
| Skill nodes | Highlight connected nodes, dim others | R3F material color lerp |

### 8.3 Special Effects

| Element | Effect | Library |
|---------|--------|---------|
| Hero name | Shimmer/shiny text | Magic UI `ShinyText` |
| Hero subtitle | Typewriter cycling | Aceternity `Typewriter Effect` |
| Section transitions | Subtle scan-line flash (20ms) | Custom CSS keyframe |
| Photo | Periodic scan-line sweep | Custom CSS animation |
| Contact terminal | Typing animation | Custom or Aceternity `Typewriter Effect` |
| Background | Meteor shower particles | Magic UI `Meteors` or Aceternity `Shooting Stars` |
| Skill constellation | Glow propagation on hover | R3F custom shader |

### 8.4 Animation Timing (from UI/UX Pro Max guidelines)

```
Micro-interactions:   150-300ms, ease-out
Page transitions:     400-600ms, cubic-bezier(0.19, 1, 0.22, 1)
3D rotations:         Continuous, 10-20s per revolution
Scroll reveals:       600ms, staggered 0.1s, power2.out (GSAP)
Count-up animations:  1.5s, ease-out
Typewriter:           50-80ms per character
All:                  prefers-reduced-motion -> instant/disabled
```

---

## 9. Navigation Design

### Desktop

- Floating glassmorphism bar, `position: fixed`, top with 16px margin
- Rounded corners (border-radius: 12px)
- Items: Logo/name (left), section links (center), Resume button (right)
- Active section: glowing cyan dot indicator
- Scroll behavior: hidden in hero, appears on scroll past hero (GSAP), hides on scroll down, shows on scroll up

### Mobile

- Hamburger icon (top right)
- Slide-in panel from right (Framer Motion)
- Full-height overlay with blur background
- Section links stacked vertically
- Close on link click or X button

---

## 10. Responsive Design

### Breakpoints (Tailwind defaults)

| Breakpoint | Width | Key Changes |
|-----------|-------|-------------|
| Mobile | < 640px | 1-col everything, no 3D constellation (grid fallback), reduced particles, hamburger nav |
| Tablet | 640-1024px | 2-col projects, simplified 3D, floating nav |
| Desktop | 1024-1440px | Full layout, all 3D, floating nav |
| Wide | > 1440px | max-width container (1200px), centered |

### Mobile-Specific

- Touch targets: 44x44px minimum
- Font sizes: 16px minimum body
- 3D constellation: replaced with categorized skill grid
- Floating geometries: disabled (performance)
- Starfield: reduced to 500 particles
- Hamburger navigation
- Project cards: full width, no 3D tilt (tap to expand)
- Flip cards: tap to flip (not hover)

---

## 11. Performance Targets

| Metric | Target |
|--------|--------|
| Lighthouse Performance | 90+ |
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Cumulative Layout Shift | < 0.1 |
| Total JS bundle (gzipped) | < 300KB (excl R3F) |
| R3F chunk (lazy-loaded) | < 150KB gzipped |

### Optimization Strategy

- **Next.js SSG:** Fully static export. No server-side rendering needed.
- **Code splitting:** R3F canvas lazy-loaded via `next/dynamic({ ssr: false })`. Not in initial bundle.
- **Images:** Pre-optimized WebP in `public/images/`. Manual `srcset` where needed. `loading="lazy"` on below-fold images.
- **Fonts:** Preloaded via `next/font/google`. `font-display: swap`.
- **3D performance:** Instanced meshes, dpr capped, frameloop demand when off-screen.
- **Tree shaking:** Only import specific drei/R3F components used.

---

## 12. Accessibility (WCAG 2.1 AA)

From UI/UX Pro Max critical guidelines:

- **Color contrast:** 4.5:1 minimum for all text. Neon accents never used as body text color.
- **Focus states:** `focus-visible:ring-2 focus-visible:ring-cyan-400` on all interactive elements.
- **Keyboard navigation:** Tab order matches visual order. No keyboard traps.
- **aria-labels:** On all icon-only buttons (GitHub, LinkedIn, hamburger, close).
- **Alt text:** Descriptive alt on photo. Decorative 3D canvas has `aria-hidden="true"`.
- **Skip to content:** Hidden link at top of page, visible on focus.
- **Semantic HTML:** Proper heading hierarchy (h1 > h2 > h3). Sections with landmark roles.
- **prefers-reduced-motion:** All animations frozen. 3D renders single static frame. No typewriter, no shimmer, no scroll animations. Content immediately visible.
- **Screen reader:** 3D constellation has text-based fallback. Terminal section has real text (not just visual).

---

## 13. Content Corrections (from gap analysis)

All content sourced from resumes (ground truth). Fixes from current site:

| Issue | Current (Wrong) | Corrected |
|-------|-----------------|-----------|
| MiHIN experience | Missing entirely | Added as top experience entry |
| Rygen title | "Data Analyst & Software Developer" | "Data & Software Development Analyst" |
| Rygen dates | "Mar 2023 - Aug 202" (truncated) | "Mar 2023 - Aug 2024" |
| NCSU graduation | "Mar 2026" | "Jun 2026" |
| GPA | "3.73" | "3.71" |
| Hero subtitle | "Full-Stack Developer | AI & ML Architect" | Typewriter cycling updated roles |
| Publications status | "Accepted & To be Published" | "Published" (HIS 2023 Springer, ICDLAIR 2024 IEEE) |
| About section | Weak generic paragraph | Resume summary (agentic AI focus) |
| Skills | Missing RAG, LangGraph, Go, AWS services | Full updated skill set from resumes |
| Projects | PackTravel, SlackPoint, MovieRec, GetNet | Removed. Replaced with 7 real projects |
| High school education | FIITJEE, Kennedy High | Removed |
| Soft skills section | Listed separately | Removed (leadership section covers this) |
| Courses section | Listed separately | Removed (not recruiter-relevant, saves space) |
| Contact email | shanmukh.nitpy@gmail.com only | schatad@ncsu.edu (primary) |

---

## 14. Component Library Mapping

Specific components to use from each library:

### From Magic UI
| Component | Used In | Purpose |
|-----------|---------|---------|
| `ShinyText` | Hero name | Shimmer animation across name text |
| `NumberTicker` | About stats | Animated count-up from 0 |
| `MagicCard` | Project cards | Cursor-following spotlight on hover |
| `ShimmerButton` | Contact CTAs | Shimmer edge on primary buttons |
| `Meteors` | Background | Meteor shower particles |
| `BlurFade` | Section entrances | Blur dissolve on scroll reveal |
| `Particles` | Background | Additional 2D particle layer |
| `Marquee` | Optional decoration | Scrolling tech logos or endorsement text |

### From Aceternity UI
| Component | Used In | Purpose |
|-----------|---------|---------|
| `3D Card Effect` | Project cards | Tilt toward cursor on hover |
| `Typewriter Effect` | Hero subtitle | Cycling role text |
| `Floating Navbar` | Navigation | Glassmorphism floating nav |
| `Timeline` | Experience | Scroll-driven timeline with beam |
| `Spotlight` | Various | Section emphasis effects |
| `Glowing Stars` / `Shooting Stars` | Background | Animated star/meteor background |
| `Direction Aware Hover` | Fun fact cards | Direction-based hover animation |
| `Encrypted Text` | Contact terminal | Text decrypt reveal effect |
| `Expandable Cards` | Experience/Projects | Click to expand details |

### From React Three Fiber / drei
| Component | Used In | Purpose |
|-----------|---------|---------|
| `<Stars>` | Background | Instanced starfield |
| `<Float>` | Hero | Floating animation for 3D objects |
| `<OrbitControls>` | Skills | Constrained drag rotation |
| `<MeshDistortMaterial>` | Hero | Organic distortion on icosahedron |
| `<Sparkles>` | Skills | Floating sparkle particles |
| `<Line>` | Skills | Connections between skill nodes |
| `<Html>` | Skills | Tooltip overlays in 3D scene |
| `<Environment>` | Scene | HDR lighting preset |
| `<PerformanceMonitor>` | Scene | Auto-adjust quality |

---

## 15. File Structure

```
portfolio-site/
├── public/
│   ├── images/
│   │   └── photo.webp          (your photo, optimized)
│   ├── resume/
│   │   └── Shanmukha_Chatadi_Resume.pdf
│   └── favicon/
├── src/
│   ├── app/
│   │   ├── layout.tsx           (root layout, fonts, metadata)
│   │   ├── page.tsx             (main page, section composition)
│   │   └── globals.css          (Tailwind imports, custom properties)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── SectionWrapper.tsx
│   │   ├── sections/
│   │   │   ├── Hero.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Experience.tsx
│   │   │   ├── Projects.tsx
│   │   │   ├── SkillsConstellation.tsx
│   │   │   ├── Publications.tsx
│   │   │   ├── Education.tsx
│   │   │   ├── LeadershipAchievements.tsx
│   │   │   ├── BeyondTheCode.tsx
│   │   │   └── Contact.tsx
│   │   ├── three/
│   │   │   ├── Scene.tsx          (main R3F canvas)
│   │   │   ├── Starfield.tsx
│   │   │   ├── NebulaClouds.tsx
│   │   │   ├── FloatingGeometries.tsx
│   │   │   ├── HeroIcosahedron.tsx
│   │   │   └── ConstellationScene.tsx
│   │   └── ui/
│   │       ├── (Magic UI components)
│   │       ├── (Aceternity components)
│   │       ├── (shadcn/ui components)
│   │       ├── ProjectCard.tsx
│   │       ├── TimelineCard.tsx
│   │       ├── FlipCard.tsx
│   │       └── TechTag.tsx
│   ├── data/
│   │   ├── experience.ts
│   │   ├── projects.ts
│   │   ├── skills.ts
│   │   ├── publications.ts
│   │   └── personal.ts
│   ├── hooks/
│   │   ├── useScrollProgress.ts
│   │   ├── useReducedMotion.ts
│   │   └── useMobile.ts
│   ├── types/
│   │   └── index.ts              (SkillNode, Project, Experience, etc.)
│   └── lib/
│       └── utils.ts
├── tailwind.config.ts
├── next.config.ts
├── tsconfig.json
├── package.json
└── docs/
    └── superpowers/
        └── specs/
            └── 2026-03-16-portfolio-redesign-design.md (this file)
```

---

## 16. SEO & Meta

```html
<title>Shanmukha Chatadi | Applied AI/ML Engineer</title>
<meta name="description" content="Applied AI/ML Engineer building agentic AI systems, production LLM pipelines, and scalable cloud deployments. MS CS @ NC State. Published researcher." />
<meta property="og:title" content="Shanmukha Chatadi | AI/ML Engineer Portfolio" />
<meta property="og:description" content="Architected enterprise RAG platform serving 230+ users. Multi-agent LangGraph research assistant. Published in Springer & IEEE." />
<meta property="og:type" content="website" />
<meta property="og:image" content="/og-image.png" />
```

Use a static OG image (1200x630px) placed at `public/og-image.png`. Programmatic OG images require edge functions which are incompatible with static export.

---

## 17. Deployment

- **Platform:** Vercel
- **Build:** `next build` (with `output: 'export'` in next.config.ts)
- **Domain:** Initially Vercel default URL. Custom domain later if desired.
- **CI:** Push to main triggers auto-deploy
- **Preview:** Every PR gets a preview deployment
- **Post-launch:** Enable Vercel Analytics (one toggle in dashboard) to validate performance targets from Section 11

### next.config.ts

```ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true }, // required for static export
};

export default nextConfig;
```

**Note:** `next/image` optimization API is unavailable in static export mode. All images (photo, OG image) must be pre-optimized as WebP at build time or placed as pre-optimized assets in `public/images/`. Use `<img>` with manual srcset or a build-time optimization script with `sharp`.

---

## 18. Out of Scope (for now)

- Supabase / database integration
- Contact form (just direct email/LinkedIn links)
- Blog / CMS
- Visitor analytics (can add Vercel Analytics later, one toggle)
- Light mode (dark only, matches the theme)
- ChimeraAR project (not in project bank, skip unless requested)
- i18n (English only)
