# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a 3D-immersive, interactive single-page portfolio for Shanmukha Chatadi using Next.js 14, React Three Fiber, Framer Motion, GSAP, and Magic UI/Aceternity components, deployed on Vercel.

**Architecture:** Next.js 14 App Router with static export. Persistent R3F canvas behind all content. GSAP handles scroll-triggered animations, Framer Motion handles component-level transitions. Data lives in TypeScript files. Tailwind v3.4 for styling.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS v3.4, React Three Fiber, @react-three/drei, GSAP + ScrollTrigger, Framer Motion, Magic UI, Aceternity UI, shadcn/ui, Lucide Icons, Simple Icons

**Spec:** `docs/superpowers/specs/2026-03-16-portfolio-redesign-design.md`

---

## Chunk 1: Project Foundation & Scaffold

### Task 1: Initialize Next.js Project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.mjs`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`

- [ ] **Step 1: Create Next.js 14 project with TypeScript and Tailwind**

```bash
cd /Users/shanmukhachatadi/job_new/github_projects/portfolio-site
npx create-next-app@14 . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

If the directory already has files (CLAUDE.md, docs/, .gitignore), say yes to proceed. The scaffold will not overwrite existing files.

After creation, verify `tsconfig.json` contains:
```json
"paths": { "@/*": ["./src/*"] }
```
If not, add it manually along with `"baseUrl": "."` under `compilerOptions`.

- [ ] **Step 2: Configure next.config.ts for static export**

Replace `next.config.ts` contents:

```ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
};

export default nextConfig;
```

- [ ] **Step 3: Install all dependencies**

```bash
npm install @react-three/fiber @react-three/drei three gsap framer-motion lucide-react simple-icons clsx tailwind-merge
npm install -D @types/three
```

- [ ] **Step 4: Configure Tailwind with custom theme**

Replace `tailwind.config.ts`:

```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        'deep': '#050510',
        'card': '#0a0a1a',
        'elevated': '#0f172a',
        'cyan-accent': '#00f2ff',
        'magenta-accent': '#ff00c1',
        'blue-accent': '#4d88ff',
        'text-primary': '#e0e6f0',
        'text-muted': '#8899a6',
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      animation: {
        'shimmer': 'shimmer 8s infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'scan-line': 'scan-line 4s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        'scan-line': {
          '0%': { top: '-2px' },
          '100%': { top: '100%' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 5: Set up globals.css with base styles (NO font @import, fonts loaded via next/font in layout.tsx)**

Replace `src/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    @apply bg-deep text-text-primary font-body;
    overflow-x: hidden;
    min-height: 100vh;
  }

  ::selection {
    background-color: rgba(0, 242, 255, 0.2);
    color: #fff;
  }
}

@layer components {
  .glass-card {
    @apply bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-xl;
  }

  .glass-nav {
    background: rgba(5, 5, 16, 0.80);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    @apply border-b border-white/[0.06];
  }

  .glow-cyan {
    box-shadow: 0 0 30px rgba(0, 242, 255, 0.15);
  }

  .glow-magenta {
    box-shadow: 0 0 30px rgba(255, 0, 193, 0.15);
  }

  .text-gradient {
    @apply bg-clip-text text-transparent bg-gradient-to-r from-cyan-accent via-blue-accent to-magenta-accent;
  }
}
```

- [ ] **Step 6: Set up root layout with fonts and metadata**

Replace `src/app/layout.tsx`:

```tsx
import type { Metadata } from 'next';
import { Space_Grotesk, DM_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['300', '400', '500', '700'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  title: 'Shanmukha Chatadi | Applied AI/ML Engineer',
  description:
    'Applied AI/ML Engineer building agentic AI systems, production LLM pipelines, and scalable cloud deployments. MS CS @ NC State. Published researcher.',
  openGraph: {
    title: 'Shanmukha Chatadi | AI/ML Engineer Portfolio',
    description:
      'Architected enterprise RAG platform serving 230+ users. Multi-agent LangGraph research assistant. Published in Springer & IEEE.',
    type: 'website',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}>
      <body>
        {/* Skip to content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-deep focus:text-cyan-accent focus:ring-2 focus:ring-cyan-accent focus:rounded"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 7: Create placeholder page.tsx**

Replace `src/app/page.tsx`:

```tsx
export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <h1 className="font-heading text-4xl text-cyan-accent">
        Portfolio Loading...
      </h1>
    </main>
  );
}
```

- [ ] **Step 8: Create public directory structure with placeholder assets**

```bash
mkdir -p public/images public/resume public/favicon
```

- Create a placeholder `public/images/photo.webp` (a 400x400 colored square or use any placeholder image). User will replace with their actual photo later.
- Copy the resume PDF: `cp /Users/shanmukhachatadi/job_new/create_resume_on_jd/existing_resume_in_latex/Ai_ML_resume.pdf public/resume/Shanmukha_Chatadi_Resume.pdf`
- Create a placeholder `public/og-image.png` (1200x630, can be a simple dark gradient with name text. Will be replaced after site is built with a real screenshot.)
- Copy favicons from the existing site if available, or create placeholder.

- [ ] **Step 9: Add global focus-visible styles to globals.css**

Add to the `@layer base` section in `globals.css`:

```css
*:focus-visible {
  @apply outline-none ring-2 ring-cyan-accent/60 ring-offset-2 ring-offset-deep;
}
```

- [ ] **Step 10: Verify dev server works**

```bash
cd /Users/shanmukhachatadi/job_new/github_projects/portfolio-site
npm run dev
```

Expected: Server starts on localhost:3000. Page shows "Portfolio Loading..." in Space Grotesk font with cyan color on deep dark background. Focus-visible ring appears when tabbing.

- [ ] **Step 11: Verify static build works**

```bash
npm run build
```

Expected: Build succeeds. `out/` directory created with static HTML.

- [ ] **Step 12: Commit**

```bash
git init
git add package.json package-lock.json tsconfig.json next.config.ts tailwind.config.ts postcss.config.mjs src/ .gitignore
git commit -m "feat: initialize Next.js 14 project with Tailwind, fonts, and static export config"
```

---

### Task 1B: Set Up Magic UI, Aceternity, and shadcn/ui Components

**Note:** Magic UI and Aceternity UI are copy-paste component libraries, NOT npm packages. You copy the component source files into your project.

**Files:**
- Create: `src/components/ui/magic/` directory with copied components
- Create: `src/components/ui/aceternity/` directory with copied components

- [ ] **Step 1: Initialize shadcn/ui**

```bash
npx shadcn-ui@latest init
```

Select: TypeScript, Default style, CSS variables, `src/app/globals.css`, `@/components` alias, `@/lib/utils`. This sets up the base that Magic UI and Aceternity components build on.

- [ ] **Step 2: Copy Magic UI components needed**

From https://magicui.design, copy the source code for these components into `src/components/ui/magic/`:
- `shiny-text.tsx` (hero name shimmer)
- `number-ticker.tsx` (about stats count-up)
- `magic-card.tsx` (project card cursor spotlight)
- `meteors.tsx` (background meteor shower)
- `particles.tsx` (additional particle effects)
- `blur-fade.tsx` (section entrance blur dissolve)

Each component is a single file you copy from the docs. Adjust imports to use `@/lib/utils` for `cn()`.

- [ ] **Step 3: Copy Aceternity UI components needed**

From https://ui.aceternity.com, copy source code for:
- `typewriter-effect.tsx` (hero subtitle)
- `floating-navbar.tsx` (navigation, if using their implementation)
- `expandable-card.tsx` (experience/project details)
- `direction-aware-hover.tsx` (fun fact card hover)
- `sparkles.tsx` (background accents)

Adjust imports for `cn()` and any dependencies (framer-motion, etc.).

- [ ] **Step 4: Verify components compile**

```bash
npm run dev
```

No import errors. Components are available for use in sections.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/magic/ src/components/ui/aceternity/
git commit -m "feat: add Magic UI and Aceternity UI component source files"
```

---

### Task 2: Create Shared Types, Data Files, and Utility Functions

**Files:**
- Create: `src/types/index.ts`, `src/data/experience.ts`, `src/data/projects.ts`, `src/data/skills.ts`, `src/data/publications.ts`, `src/data/education.ts`, `src/data/leadership.ts`, `src/data/personal.ts`, `src/lib/utils.ts`

- [ ] **Step 1: Create shared types**

Create `src/types/index.ts`:

```ts
export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  period: string;
  bullets: string[];
  tags: string[];
  accent: 'cyan' | 'magenta' | 'blue';
  expanded?: boolean;
}

export interface Project {
  id: string;
  title: string;
  subtitle?: string;
  period: string;
  description: string;
  bullets: string[];
  tags: string[];
  githubUrl?: string;
  accent: 'cyan' | 'magenta' | 'blue';
  categories: ('ai-ml' | 'backend' | 'full-stack' | 'research')[];
}

export interface SkillNode {
  name: string;
  category: 'ai-ml' | 'languages' | 'cloud' | 'web' | 'databases' | 'libraries';
  proficiency: number; // 1-5
  position: { x: number; y: number; z: number };
  connections: string[];
}

export interface Publication {
  title: string;
  authors: string;
  venue: string;
  year: number;
  publisher: 'springer' | 'ieee';
  status: string;
}

export interface Education {
  institution: string;
  degree: string;
  gpa: string;
  period: string;
  coursework?: string[];
}

export interface LeadershipEntry {
  title: string;
  organization: string;
  period: string;
  description: string;
}

export interface Achievement {
  title: string;
  year: number;
}

export interface FunFact {
  icon: string; // Lucide icon name
  title: string;
  detail: string;
}
```

- [ ] **Step 2: Create experience data**

Create `src/data/experience.ts` with all 3 experience entries from the spec (MiHIN, Rygen, TreoSoft) with full resume bullets, tags, and accent colors.

- [ ] **Step 3: Create projects data**

Create `src/data/projects.ts` with all 7 projects from the spec (ScholarAgent, MCP Healthcare, LinkVault, Distributed Task Queue, Neural Network Pruning, LLMs4PCG, AI ChatBot) with full descriptions, bullets, tags, GitHub URLs, and category assignments.

- [ ] **Step 4: Create skills data with pre-computed 3D positions**

Create `src/data/skills.ts` with all skills from the spec, each with category, proficiency (1-5), pre-computed `{x, y, z}` positions forming spatial clusters, and max 3 connections per node.

- [ ] **Step 5: Create remaining data files**

Create `src/data/publications.ts`, `src/data/education.ts`, `src/data/leadership.ts` (including achievements), and `src/data/personal.ts` (fun facts) with exact content from the spec.

- [ ] **Step 6: Create utility functions**

Create `src/lib/utils.ts`:

```ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 7: Commit**

```bash
git add src/types/ src/data/ src/lib/
git commit -m "feat: add shared types, data files, and utility functions"
```

---

### Task 3: Create Custom Hooks

**Files:**
- Create: `src/hooks/useScrollProgress.ts`, `src/hooks/useReducedMotion.ts`, `src/hooks/useMobile.ts`

- [ ] **Step 1: Create useScrollProgress hook**

Create `src/hooks/useScrollProgress.ts`:

```ts
'use client';

import { useState, useEffect, useCallback } from 'react';

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [sectionProgress, setSectionProgress] = useState<Record<string, number>>({});

  const updateProgress = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const normalizedProgress = docHeight > 0 ? scrollTop / docHeight : 0;
    setProgress(Math.min(1, Math.max(0, normalizedProgress)));

    // Per-section progress
    const sections = document.querySelectorAll<HTMLElement>('[data-section]');
    const newSectionProgress: Record<string, number> = {};
    sections.forEach((section) => {
      const id = section.dataset.section || '';
      const rect = section.getBoundingClientRect();
      const sectionStart = rect.top + scrollTop;
      const sectionHeight = rect.height;
      const relativeScroll = scrollTop - sectionStart + window.innerHeight;
      const sectionNormalized = Math.min(1, Math.max(0, relativeScroll / (sectionHeight + window.innerHeight)));
      newSectionProgress[id] = sectionNormalized;
    });
    setSectionProgress(newSectionProgress);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
    return () => window.removeEventListener('scroll', updateProgress);
  }, [updateProgress]);

  return { progress, sectionProgress };
}
```

- [ ] **Step 2: Create useReducedMotion hook**

Create `src/hooks/useReducedMotion.ts`:

```ts
'use client';

import { useState, useEffect } from 'react';

export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mql.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return reducedMotion;
}
```

- [ ] **Step 3: Create useMobile hook**

Create `src/hooks/useMobile.ts`:

```ts
'use client';

import { useState, useEffect } from 'react';

export function useMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [breakpoint]);

  return isMobile;
}
```

- [ ] **Step 4: Commit**

```bash
git add src/hooks/
git commit -m "feat: add custom hooks (scroll progress, reduced motion, mobile)"
```

---

### Task 4: Set Up Shared UI Components

**Files:**
- Create: `src/components/ui/TechTag.tsx`, `src/components/layout/SectionWrapper.tsx`, `src/components/ui/GlassCard.tsx`, `src/components/ui/ShimmerButton.tsx`

- [ ] **Step 1: Create TechTag component**

Create `src/components/ui/TechTag.tsx`:

```tsx
import { cn } from '@/lib/utils';

interface TechTagProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'magenta' | 'blue' | 'muted';
  size?: 'sm' | 'md';
}

const variantStyles = {
  cyan: 'border-cyan-accent/20 text-cyan-accent',
  magenta: 'border-magenta-accent/20 text-magenta-accent',
  blue: 'border-blue-accent/20 text-blue-accent',
  muted: 'border-white/15 text-text-muted',
};

export function TechTag({ children, variant = 'cyan', size = 'sm' }: TechTagProps) {
  return (
    <span
      className={cn(
        'inline-block font-mono rounded-full border',
        size === 'sm' ? 'text-[11px] px-2.5 py-0.5' : 'text-xs px-3 py-1',
        variantStyles[variant]
      )}
    >
      {children}
    </span>
  );
}
```

- [ ] **Step 2: Create SectionWrapper component**

Create `src/components/layout/SectionWrapper.tsx`:

```tsx
'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface SectionWrapperProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export function SectionWrapper({ id, children, className, title }: SectionWrapperProps) {
  const reducedMotion = useReducedMotion();

  return (
    <section
      id={id}
      data-section={id}
      className={cn('relative py-24 px-4 md:px-6', className)}
    >
      <div className="max-w-[1200px] mx-auto">
        {title && (
          <motion.h2
            className="font-heading text-3xl md:text-4xl font-semibold text-white mb-12 text-center"
            initial={reducedMotion ? {} : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            {title}
          </motion.h2>
        )}
        {children}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Create GlassCard component**

Create `src/components/ui/GlassCard.tsx`:

```tsx
'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'cyan' | 'magenta' | 'blue' | 'none';
  hoverEffect?: boolean;
}

export function GlassCard({
  children,
  className,
  glowColor = 'none',
  hoverEffect = true,
  ...props
}: GlassCardProps) {
  const reducedMotion = useReducedMotion();
  const glowStyles = {
    cyan: 'hover:shadow-[0_0_30px_rgba(0,242,255,0.15)]',
    magenta: 'hover:shadow-[0_0_30px_rgba(255,0,193,0.15)]',
    blue: 'hover:shadow-[0_0_30px_rgba(77,136,255,0.15)]',
    none: '',
  };

  return (
    <motion.div
      className={cn(
        'glass-card p-6',
        hoverEffect && 'transition-shadow duration-300',
        hoverEffect && glowStyles[glowColor],
        className
      )}
      initial={reducedMotion ? {} : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 4: Create ShimmerButton component**

Create `src/components/ui/ShimmerButton.tsx` - a button with a shimmer edge effect for CTAs.

```tsx
import { cn } from '@/lib/utils';

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  href?: string;
}

export function ShimmerButton({ children, variant = 'primary', href, className, ...props }: ShimmerButtonProps) {
  const baseStyles = 'relative inline-flex items-center justify-center gap-2 px-6 py-3 font-heading text-sm font-medium rounded-lg transition-all duration-300 cursor-pointer';
  const variants = {
    primary: 'border border-cyan-accent/40 text-cyan-accent hover:bg-cyan-accent/10 hover:shadow-[0_0_20px_rgba(0,242,255,0.15)]',
    secondary: 'border border-white/10 text-text-muted hover:text-text-primary hover:border-white/20',
  };

  const content = (
    <button className={cn(baseStyles, variants[variant], className)} {...props}>
      {children}
    </button>
  );

  if (href) {
    return (
      <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}>
        {content}
      </a>
    );
  }

  return content;
}
```

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/
git commit -m "feat: add shared UI components (TechTag, SectionWrapper, GlassCard, ShimmerButton)"
```

---

## Chunk 2: 3D Scene & Navigation

### Task 5: Build React Three Fiber Background Scene

**Files:**
- Create: `src/components/three/Scene.tsx`, `src/components/three/Starfield.tsx`, `src/components/three/NebulaClouds.tsx`, `src/components/three/FloatingGeometries.tsx`, `src/components/three/SceneContainer.tsx`

- [ ] **Step 1: Create SceneContainer (lazy-loaded R3F wrapper)**

Create `src/components/three/SceneContainer.tsx`:

```tsx
'use client';

import dynamic from 'next/dynamic';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const Scene = dynamic(() => import('./Scene').then((mod) => mod.Scene), {
  ssr: false,
  loading: () => null,
});

export function SceneContainer() {
  const reducedMotion = useReducedMotion();

  return (
    <>
      {/* CSS fallback shown immediately, behind the canvas */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse at 20% 20%, rgba(0,242,255,0.03) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, rgba(255,0,193,0.02) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(77,136,255,0.015) 0%, transparent 60%),
            #050510
          `,
        }}
      />
      {!reducedMotion && <Scene />}
    </>
  );
}
```

- [ ] **Step 2: Create main Scene component**

Create `src/components/three/Scene.tsx`:

```tsx
'use client';

import { Canvas } from '@react-three/fiber';
import { Preload, PerformanceMonitor } from '@react-three/drei';
import { Suspense, useState } from 'react';
import { Starfield } from './Starfield';
import { NebulaClouds } from './NebulaClouds';
import { FloatingGeometries } from './FloatingGeometries';

export function Scene() {
  const [dpr, setDpr] = useState(1.5);

  return (
    <div className="fixed inset-0 -z-10" aria-hidden="true">
      <Canvas
        dpr={dpr}
        camera={{ position: [0, 0, 60], fov: 55 }}
        gl={{ antialias: true, alpha: true }}
      >
        <PerformanceMonitor
          onDecline={() => setDpr(1)}
          onIncline={() => setDpr(1.5)}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.3} />
            <directionalLight position={[5, 10, 7]} intensity={0.3} />
            <pointLight position={[20, 10, 30]} color="#00f2ff" intensity={0.5} distance={150} />
            <pointLight position={[-20, -5, -20]} color="#ff00c1" intensity={0.3} distance={150} />
            <Starfield />
            <NebulaClouds />
            <FloatingGeometries />
            <Preload all />
          </Suspense>
        </PerformanceMonitor>
      </Canvas>
    </div>
  );
}
```

- [ ] **Step 3: Create Starfield component**

Create `src/components/three/Starfield.tsx` using drei `<Stars />` with ~2000 points, slowly rotating.

- [ ] **Step 4: Create NebulaClouds component**

Create `src/components/three/NebulaClouds.tsx` with 2-3 sprite-based semi-transparent clouds in cyan, magenta, and blue using additive blending, slowly drifting.

- [ ] **Step 5: Create FloatingGeometries component**

Create `src/components/three/FloatingGeometries.tsx` with 4-5 wireframe polyhedra (icosahedron, octahedron, torus knot) orbiting at different depths with low opacity and edge glow. Use drei `<Float />` for organic motion.

- [ ] **Step 6: Add mouse parallax camera controller**

Create a `CameraController` component used inside the Scene Canvas that:
- Tracks mouse position via `onPointerMove` on the canvas
- Applies damped lerp to camera rotation (max 2-3 degrees) in `useFrame`
- Creates depth feeling as cursor moves

- [ ] **Step 7: Add Meteors / Shooting Stars background effect**

Add animated shooting star lines to the Scene. Either use the Magic UI `Meteors` component (CSS-based, rendered outside the Canvas as an HTML overlay) or create R3F-based shooting stars with animated line segments. Place as a subtle background layer.

- [ ] **Step 8: Add error boundary and WebGL detection to SceneContainer**

Update `src/components/three/SceneContainer.tsx`:
- Check `typeof window !== 'undefined' && !!window.WebGLRenderingContext` before rendering Canvas
- Wrap `<Scene />` in a React error boundary class component
- On error or no WebGL: keep the CSS fallback (already in place), log to console, no user-visible error

- [ ] **Step 9: Wire SceneContainer into page.tsx**

Update `src/app/page.tsx` to import and render `<SceneContainer />` before page content.

- [ ] **Step 10: Verify 3D scene renders**

Run `npm run dev`. Expected: deep space background with twinkling stars, nebula clouds, floating wireframe shapes, and occasional shooting stars. Mouse movement causes subtle camera parallax.

- [ ] **Step 11: Commit**

```bash
git add src/components/three/
git commit -m "feat: add React Three Fiber 3D background scene with starfield, nebula, and floating geometries"
```

---

### Task 6: Build Floating Navbar

**Files:**
- Create: `src/components/layout/Navbar.tsx`

- [ ] **Step 1: Register GSAP ScrollTrigger plugin**

Create `src/lib/gsap.ts`:

```ts
'use client';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
```

All GSAP imports throughout the project should come from `@/lib/gsap`, not directly from `gsap`.

- [ ] **Step 2: Create desktop Navbar layout**

Create `src/components/layout/Navbar.tsx` with:
- Floating glassmorphism bar (`glass-nav` class), fixed position with top margin
- Name/logo (left): "SC" or "Shanmukha" in font-heading
- Section links (center): About, Experience, Projects, Skills, Publications, Education, Leadership, Beyond, Contact
- Resume download button (right): links to `/resume/Shanmukha_Chatadi_Resume.pdf`
- Hidden by default (`opacity-0, -translate-y-full`)

- [ ] **Step 3: Add scroll-triggered show/hide**

Use a scroll event listener (or GSAP ScrollTrigger from `@/lib/gsap`):
- Show navbar when scrollY > hero height
- Hide on scroll down, show on scroll up (optional, can be always-visible after hero)
- Active section indicator: track current section via Intersection Observer, add cyan glow dot next to active link

- [ ] **Step 4: Add mobile hamburger menu**

Add to Navbar:
- Hamburger icon button (visible below 768px)
- Framer Motion `AnimatePresence` slide-in panel from right
- Full-height overlay with backdrop blur
- Section links stacked vertically
- Close on link click or X button

- [ ] **Step 5: Wire Navbar into `src/app/page.tsx`**

Import and render `<Navbar />` after SceneContainer, before main content.

- [ ] **Step 6: Verify navigation works**

Run dev server. Scroll down, nav should appear. Click links should smooth-scroll. Test at 375px for mobile hamburger.

- [ ] **Step 7: Commit**

```bash
git add src/components/layout/
git commit -m "feat: add floating glassmorphism navbar with mobile hamburger menu"
```

---

## Chunk 3: Hero & About Sections

### Task 7: Build Hero Section

**Files:**
- Create: `src/components/sections/Hero.tsx`, `src/components/three/HeroIcosahedron.tsx`

- [ ] **Step 1: Create HeroIcosahedron 3D component**

Create `src/components/three/HeroIcosahedron.tsx` - rotating icosahedron with MeshDistortMaterial, holographic appearance, reacts to mouse proximity. Wrapped in drei `<Float />`.

- [ ] **Step 2: Create Hero section component**

Create `src/components/sections/Hero.tsx` with:
- Full viewport height (100dvh)
- Photo placeholder (circular frame with scan-line overlay, glow pulse)
- Name with shimmer text animation (CSS-based shimmer, gradient background-position animation)
- Typewriter subtitle cycling through roles (custom implementation or use a lightweight typewriter hook)
- CTA buttons: View Projects, Download Resume, GitHub, LinkedIn
- Scroll indicator at bottom (animated mouse icon)
- GSAP timeline for staggered entry animation

- [ ] **Step 3: Wire Hero into page.tsx**

- [ ] **Step 4: Verify hero renders correctly**

Expected: full-screen hero with animated name, cycling subtitle, photo placeholder, CTA buttons, 3D icosahedron in background, scroll indicator.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/Hero.tsx src/components/three/HeroIcosahedron.tsx
git commit -m "feat: add Hero section with shimmer text, typewriter, photo, and 3D icosahedron"
```

---

### Task 8: Build About Section

**Files:**
- Create: `src/components/sections/About.tsx`

- [ ] **Step 1: Create About section**

Create `src/components/sections/About.tsx` with:
- Resume summary paragraph (left side)
- Stats grid 2x2 (right side): Years Exp (3+), Projects (7+), Publications (2), Users Served (230+)
- Animated number count-up using Framer Motion (custom NumberTicker: animate from 0 to value when in view)
- Staggered entrance animation

- [ ] **Step 2: Wire into page.tsx**

- [ ] **Step 3: Verify about section renders**

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/About.tsx
git commit -m "feat: add About section with summary and animated stat counters"
```

---

## Chunk 4: Experience & Projects Sections

### Task 9: Build Experience Section

**Files:**
- Create: `src/components/sections/Experience.tsx`, `src/components/ui/TimelineCard.tsx`

- [ ] **Step 1: Create TimelineCard component**

Create `src/components/ui/TimelineCard.tsx` - expandable card with:
- Title, company, location, period
- Bullet points (shown/hidden based on expanded state)
- Tech tags
- Framer Motion AnimatePresence for expand/collapse
- Accent color indicator

- [ ] **Step 2: Create Experience section**

Create `src/components/sections/Experience.tsx` with:
- Vertical timeline with glowing left border line
- Timeline dots (colored per entry) that pulse on scroll
- MiHIN expanded by default, others collapsed
- Click to expand/collapse

- [ ] **Step 3: Wire into page.tsx**

- [ ] **Step 4: Verify**

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/Experience.tsx src/components/ui/TimelineCard.tsx
git commit -m "feat: add Experience section with glowing timeline and expandable cards"
```

---

### Task 10: Build Projects Section

**Files:**
- Create: `src/components/sections/Projects.tsx`, `src/components/ui/ProjectCard.tsx`

- [ ] **Step 1: Create ProjectCard with 3D tilt effect**

Create `src/components/ui/ProjectCard.tsx` with:
- Glass card with title, period, description, tech tags, GitHub link
- 3D tilt on hover: track mouse position over card, apply perspective + rotateX/Y (max 8deg)
- Cursor-following glow spotlight effect
- Click to expand full details (Framer Motion AnimatePresence)
- Scale(1.02) on hover

- [ ] **Step 2: Create Projects section**

Create `src/components/sections/Projects.tsx` with:
- Filter bar: All, AI/ML, Backend, Full-Stack, Research
- Responsive grid (2-col desktop, 1-col mobile)
- Framer Motion layout animation for filter transitions
- All 7 project cards

- [ ] **Step 3: Wire into page.tsx**

- [ ] **Step 4: Verify filter works and cards tilt**

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/Projects.tsx src/components/ui/ProjectCard.tsx
git commit -m "feat: add Projects section with filterable grid and 3D tilt cards"
```

---

## Chunk 5: Skills Constellation

### Task 11: Build Interactive 3D Skills Constellation

**Files:**
- Create: `src/components/sections/SkillsConstellation.tsx`, `src/components/three/ConstellationScene.tsx`, `src/components/sections/SkillsGrid.tsx`

- [ ] **Step 1: Create ConstellationScene with basic sphere rendering**

Create `src/components/three/ConstellationScene.tsx` with:
- R3F Canvas (separate from background scene, inline in the Skills section)
- Read skills data from `src/data/skills.ts`
- Render instanced spheres at pre-computed positions, sized by proficiency
- Category-based colors (cyan for AI/ML, magenta for languages, blue for cloud, etc.)
- Basic ambient + point lighting

- [ ] **Step 2: Add connection lines between skill nodes**

Add drei `<Line>` geometries connecting related skills (max 3 per node). Lines should be semi-transparent and colored based on the connecting nodes.

- [ ] **Step 3: Add OrbitControls and auto-rotation**

Add drei `<OrbitControls>` with constrained polar angles (maxPolarAngle, minPolarAngle). Enable autoRotate with autoRotateSpeed=0.5. Disable zoom (enableZoom=false).

- [ ] **Step 4: Add hover interaction (highlight + dim)**

Track hovered node via raycasting or `onPointerOver`/`onPointerOut`. On hover:
- Highlight the hovered node (increase emissive, scale up slightly)
- Highlight connected nodes and lines
- Dim all other nodes/lines to 0.2 opacity
- Show skill name tooltip via drei `<Html>`

- [ ] **Step 5: Add click interaction (detail panel)**

On click: dispatch a state update to the parent SkillsConstellation component. Pass the clicked skill name so the parent can show a side panel with related projects/experience.

- [ ] **Step 6: Add drei Sparkles for ambient effect**

Add `<Sparkles>` from drei for floating sparkle particles around the constellation. Low count (~50), subtle.

- [ ] **Step 2: Create SkillsGrid (mobile fallback)**

Create `src/components/sections/SkillsGrid.tsx` - categorized grid of tech tag pills grouped under category headings. Clean, scannable, no 3D.

- [ ] **Step 3: Create SkillsConstellation section**

Create `src/components/sections/SkillsConstellation.tsx` that:
- Shows ConstellationScene on desktop
- Shows SkillsGrid on mobile (useMobile hook)
- Has a side panel for skill details (which projects/experience use it)
- Framer Motion AnimatePresence for panel slide-in

- [ ] **Step 4: Wire into page.tsx**

- [ ] **Step 5: Verify constellation renders, drag works, hover highlights**

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/SkillsConstellation.tsx src/components/three/ConstellationScene.tsx src/components/sections/SkillsGrid.tsx
git commit -m "feat: add interactive 3D skills constellation with mobile grid fallback"
```

---

## Chunk 6: Remaining Sections

### Task 12: Build Publications & Education Sections

**Files:**
- Create: `src/components/sections/Publications.tsx`, `src/components/sections/Education.tsx`

- [ ] **Step 1: Create Publications section**

Two glass cards side by side. Each with title, authors, venue/year, published status, and publisher icon (Springer/IEEE from Simple Icons). Hover lifts card.

- [ ] **Step 2: Create Education section**

Two glass cards. NCSU and NIT Puducherry. Coursework as TechTag pills.

- [ ] **Step 3: Wire into page.tsx**

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Publications.tsx src/components/sections/Education.tsx
git commit -m "feat: add Publications and Education sections"
```

---

### Task 13: Build Leadership & Achievements Section

**Files:**
- Create: `src/components/sections/LeadershipAchievements.tsx`

- [ ] **Step 1: Create LeadershipAchievements section**

- Top half: 3-col grid of compact leadership cards (President, VP, Co-founder)
- Bottom half: horizontal row of achievement badges/pills (glowing cyan border, compact)
- All data from `src/data/leadership.ts`

- [ ] **Step 2: Wire into page.tsx**

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/LeadershipAchievements.tsx
git commit -m "feat: add Leadership & Achievements section"
```

---

### Task 14: Build Beyond the Code Section

**Files:**
- Create: `src/components/sections/BeyondTheCode.tsx`, `src/components/ui/FlipCard.tsx`

- [ ] **Step 1: Create FlipCard component**

Create `src/components/ui/FlipCard.tsx` with:
- CSS 3D flip (perspective, rotateY(180deg), backface-visibility hidden)
- Front: Lucide icon + title
- Back: detail text
- Click to flip (both desktop and mobile)
- Subtle direction-aware hover tilt as affordance

- [ ] **Step 2: Create BeyondTheCode section**

3x2 grid of FlipCards. 6 fun facts: Basketball, Astronomy, Cyberpunk 2077, Origami, Weightlifting, Teaching.

- [ ] **Step 3: Wire into page.tsx**

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/BeyondTheCode.tsx src/components/ui/FlipCard.tsx
git commit -m "feat: add Beyond the Code section with 3D flip cards"
```

---

### Task 15: Build Contact Section & Footer

**Files:**
- Create: `src/components/sections/Contact.tsx`, `src/components/layout/Footer.tsx`

- [ ] **Step 1: Create Contact section**

Terminal-style display:
- JetBrains Mono font
- Typing animation that reveals contact JSON line by line
- Clickable email, LinkedIn, GitHub links
- Below terminal: large CTA buttons (Email, LinkedIn) with shimmer effect

- [ ] **Step 2: Create Footer**

Simple footer with copyright, year, and "Built with Next.js, R3F, and way too much caffeine" or similar.

- [ ] **Step 3: Wire into page.tsx**

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Contact.tsx src/components/layout/Footer.tsx
git commit -m "feat: add Contact section with terminal animation and Footer"
```

---

## Chunk 7: Polish, Performance & Deploy

### Task 16: Compose Full Page & Add Scroll Animations

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Compose all sections in page.tsx**

Wire all 10 sections in order: Hero, About, Experience, Projects, Skills, Publications, Education, Leadership, Beyond, Contact, Footer.

- [ ] **Step 2: Add GSAP ScrollTrigger for section entrances**

Register GSAP ScrollTrigger. Add scroll-triggered animations for section headers (clip-path reveal), timeline glow, and any effects not handled by Framer Motion's whileInView.

- [ ] **Step 3: Add scroll-linked R3F camera movement**

Connect `useScrollProgress` to the R3F background Scene. Camera z-position subtly shifts with scroll progress. Background color temperature shifts per section.

- [ ] **Step 4: Full page walkthrough test**

Run dev server. Scroll through entire page. Verify:
- All sections render with correct content
- Scroll animations fire
- Nav highlights active section
- 3D background responds to scroll/mouse
- Mobile responsive at 375px, 768px, 1024px, 1440px
- prefers-reduced-motion disables all animation

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: compose full page with all sections and scroll animations"
```

---

### Task 17: Performance Optimization

**Files:**
- Modify: various

- [ ] **Step 1: Verify static build succeeds**

```bash
npm run build
```

Expected: Builds successfully with `output: 'export'`.

- [ ] **Step 2: Check bundle size**

```bash
npx @next/bundle-analyzer
```

Or inspect the `.next/` build output. Verify R3F chunk is separate and lazy-loaded.

- [ ] **Step 3: Optimize if needed**

- Ensure drei imports are from subpaths not barrel
- Verify R3F canvas has `frameloop="demand"` or similar optimization
- Check that images in public/ are WebP and appropriately sized
- Add `loading="lazy"` to any below-fold images

- [ ] **Step 4: Lighthouse audit**

Run Lighthouse on the built output (serve with `npx serve out`). Target: Performance 90+, Accessibility 95+.

- [ ] **Step 5: Commit any optimizations**

```bash
git add -A
git commit -m "perf: optimize bundle size, lazy loading, and lighthouse score"
```

---

### Task 18: Deploy to Vercel

- [ ] **Step 1: Initialize git repo if not already done and push**

```bash
cd /Users/shanmukhachatadi/job_new/github_projects/portfolio-site
# Ensure remote is set up
gh repo create shinegami-2002/portfolio --public --source=. --push
```

Or if repo already exists:

```bash
git remote add origin https://github.com/shinegami-2002/portfolio.git
git push -u origin main
```

- [ ] **Step 2: Connect to Vercel**

```bash
npx vercel --prod
```

Or connect via Vercel dashboard by importing the GitHub repo.

- [ ] **Step 3: Verify live deployment**

Open the Vercel URL. Full walkthrough on desktop and mobile. Verify all sections, animations, 3D, and navigation work.

- [ ] **Step 4: Final commit with deploy URL**

Update the repo description or README if needed with the live URL.

---

## Task Dependency Graph

```
Task 1 (scaffold) ──┬──> Task 1B (Magic UI / Aceternity setup)
                    ├──> Task 2 (data)
                    ├──> Task 3 (hooks)
                    ├──> Task 4 (shared UI)
                    ├──> Task 5 (3D scene)
                    └──> Task 6 (navbar + GSAP setup)
                              │
              ┌───────────────┴───────────────┐
              │  All of Tasks 1B-6 complete    │
              └───────────────┬───────────────┘
                              │
            ┌─────┬─────┬─────┼─────┬─────┬─────┬─────┬─────┐
            v     v     v     v     v     v     v     v     v
          T7    T8    T9   T10   T11   T12   T13   T14   T15
         Hero  About  Exp  Proj  Skill  Pub   Lead  Fun   Contact
            └─────┴─────┴─────┼─────┴─────┴─────┴─────┴─────┘
                              │
                              v
                        Task 16 (compose page + scroll animations)
                              │
                              v
                        Task 17 (performance optimization)
                              │
                              v
                        Task 18 (deploy to Vercel)
```

**Parallelizable groups (for subagent-driven development):**
- **Group A:** Tasks 1B, 2, 3, 4, 5, 6 - all independent of each other, only depend on Task 1
- **Group B:** Tasks 7-15 (all section components) - depend on ALL of Group A completing, but are independent of each other. Can run up to 9 parallel subagents.
- **Sequential tail:** Tasks 16, 17, 18 must run in order after ALL of Group B completes
