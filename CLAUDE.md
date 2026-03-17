# Portfolio Site — Shanmukha Chatadi

**Live:** https://shanmukha-chatadi.vercel.app
**Repo:** https://github.com/shinegami-2002/portfolio
**Deploys:** Auto-deploys on push to `main` via Vercel

## Tech Stack

- **Framework:** Next.js 14 (App Router, static export)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v3.4 with custom theme
- **Animation:** Framer Motion (component transitions, hover, layout) + GSAP/ScrollTrigger (scroll-driven)
- **UI Components:** Custom glass cards, background boxes (Aceternity-style), spotlight effects, flip cards
- **Fonts:** Syne (headings), Inter (body), JetBrains Mono (code/terminal) via next/font/google
- **Icons:** Lucide React
- **Theme:** Dark/light mode via next-themes (dark default)
- **Deploy:** Vercel (static export, `output: 'export'` in next.config.mjs)

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout, fonts, metadata, ThemeProvider
│   ├── page.tsx            # Main page, composes all sections
│   └── globals.css         # Tailwind imports, CSS variables (light/dark), glass-card, hover utilities
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx      # Floating glassmorphism nav, mobile hamburger, theme toggle
│   │   ├── Footer.tsx      # Simple footer
│   │   ├── SectionWrapper.tsx  # Reusable section container with title + number
│   │   └── ThemeProvider.tsx   # next-themes wrapper
│   ├── sections/           # One file per page section
│   │   ├── Hero.tsx        # Hero with spotlights, background boxes, typewriter, gradient name
│   │   ├── About.tsx       # Summary + animated stat counters
│   │   ├── Experience.tsx  # Stacked cards, MiHIN expanded by default
│   │   ├── Projects.tsx    # 2-col grid, glass cards with accent strip + watermark icons
│   │   ├── SkillsConstellation.tsx  # Marquee ticker rows by category
│   │   ├── Publications.tsx  # 2 cards (Springer, IEEE)
│   │   ├── Education.tsx   # 2 cards (NCSU, NIT Puducherry)
│   │   ├── LeadershipAchievements.tsx  # Leadership cards + achievement badges
│   │   ├── BeyondTheCode.tsx  # 3D flip cards (fun facts)
│   │   └── Contact.tsx     # Terminal-style contact + CTA buttons
│   ├── three/
│   │   └── SceneContainer.tsx  # CSS-only background (gradient orbs, light/dark variants)
│   └── ui/                 # Reusable UI primitives
│       ├── background-boxes.tsx  # Interactive hover grid (Aceternity-style)
│       ├── FlipCard.tsx    # CSS 3D flip card
│       ├── GlassCard.tsx   # Glassmorphism card with hover lift
│       ├── ShimmerButton.tsx  # CTA button with hover effects
│       ├── spotlight.tsx   # SVG radial spotlight beam
│       ├── TechTag.tsx     # Tech stack pill tag
│       ├── text-generate.tsx  # Word-by-word blur-fade text
│       ├── ThemeToggle.tsx # Dark/light mode toggle button
│       └── TimelineCard.tsx  # Expandable experience card
├── data/                   # All content lives here (edit these to update site content)
│   ├── experience.ts       # 3 jobs: MiHIN, Rygen, TreoSoft
│   ├── projects.ts         # 7 projects with descriptions, bullets, tags, GitHub URLs
│   ├── skills.ts           # ~60 skills with categories and 3D positions
│   ├── publications.ts     # 2 papers (Springer, IEEE)
│   ├── education.ts        # NCSU + NIT Puducherry
│   ├── leadership.ts       # 3 leadership entries + 4 achievements
│   └── personal.ts         # 6 fun facts (basketball, astronomy, cyberpunk, etc.)
├── hooks/
│   ├── useMobile.ts        # Breakpoint detection
│   ├── useReducedMotion.ts # prefers-reduced-motion
│   ├── useScrollProgress.ts  # Normalized scroll + per-section progress
│   └── useTypewriter.ts    # Typing/deleting/cycling text effect
├── lib/
│   ├── gsap.ts             # GSAP + ScrollTrigger registration
│   └── utils.ts            # cn() (clsx + tailwind-merge)
└── types/
    └── index.ts            # Shared TypeScript interfaces
```

## Color System (CSS Variables)

Colors are defined in `globals.css` as RGB space-separated values for Tailwind opacity support:

**Dark mode** (default):
- `deep: #0a0a0f` (background)
- `card: #111116` (card surfaces)
- `cyan-accent: #00d4ff` (primary accent)
- `blue-accent: #6b8afd` (secondary accent)
- `gold-accent: #e8b04a` (warm accent, used for Languages category)
- `text-primary: #f0ece2` (warm cream body text)
- `text-muted: #9ca3af` (secondary text)

**Light mode:**
- `deep: #f5f3ee` (warm cream background)
- `card: #fffdfa` (warm white cards)
- `cyan-accent: #0e7490` (deeper teal)
- `blue-accent: #4338ca` (deeper indigo)
- `gold-accent: #a16207` (deeper amber)
- `text-primary: #1c1917` (near black)
- `text-muted: #57534e` (warm gray)

**Rules:**
- NO purple/violet/pink/magenta anywhere
- Only cyan + blue + gold accents
- Dark mode is the default and primary design target

## How to Update Content

All content lives in `src/data/`. Edit these files and push to deploy:

- **Add a new job:** Edit `src/data/experience.ts`, add entry to `experiences` array
- **Add a project:** Edit `src/data/projects.ts`, add to `projects` array. Also add icon mapping in `src/components/sections/Projects.tsx` (`PROJECT_ICONS`)
- **Update skills:** Edit `src/data/skills.ts`
- **Update fun facts:** Edit `src/data/personal.ts`
- **Add your photo:** Place in `public/images/photo.webp`, then update `Hero.tsx` to use it
- **Update resume PDF:** Replace `public/resume/Shanmukha_Chatadi_Resume.pdf`

## How to Add a New Section

1. Create `src/components/sections/NewSection.tsx`
2. Use `SectionWrapper` with an `id`, `title`, and `number` prop
3. Add it to `src/app/page.tsx` in the section order
4. Add the nav link in `src/components/layout/Navbar.tsx` (`SECTIONS` array)

## Common Tasks

### Run locally
```bash
npm run dev        # Dev server on localhost:3000
npm run build      # Static build (output: out/)
```

### Deploy
Push to `main`. Vercel auto-deploys.

### Add hover effects
Use the CSS utility classes in `globals.css`:
- `hover-lift` - card lifts 4px on hover
- `hover-glow-cyan` / `hover-glow-gold` / `hover-glow-blue` - colored glow shadow on hover
- `glass-card` - glassmorphism card styling (works in both light/dark)

### Theme system
- `next-themes` with `attribute="class"` and `defaultTheme="dark"`
- Toggle via `ThemeToggle.tsx` in navbar
- Use `dark:` Tailwind prefix for dark-specific styles
- CSS variables in `globals.css` switch between `:root` (light) and `.dark` (dark)

## Design Rules

- **No em dashes** in any generated text
- **No purple/pink/magenta** colors anywhere
- **Syne** for headings, **Inter** for body, **JetBrains Mono** for code/terminal elements
- **Glass cards** (`glass-card` class) for all card containers
- **Framer Motion** `whileInView` for scroll reveal animations
- **Reduced motion:** All animations respect `prefers-reduced-motion` via `useReducedMotion` hook
- Section titles use numbering format: "01 /" above the title text
- Interactive elements must have hover feedback (lift, glow, color change)
- Background boxes only render in dark mode, only in the hero section

## Favicon
Animated SVG blackhole at `public/favicon.svg`. Accretion disk rotates, colors cycle, event horizon pulses. Pure CSS animation in SVG.

## Owner
Shanmukha Chatadi (shinegami-2002)
MS CS @ NC State, graduating Jun 2026
