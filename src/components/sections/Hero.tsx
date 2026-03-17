'use client';

import { motion, type Variants } from 'framer-motion';
import { Github, Linkedin, Mail } from 'lucide-react';
import { ShimmerButton } from '@/components/ui/ShimmerButton';
import { Spotlight } from '@/components/ui/spotlight';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useTypewriter } from '@/hooks/useTypewriter';

/* ---------- Animation variants ---------- */

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
};

const delayedFade: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const, delay: 1.2 },
  },
};

const ctaFade: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const, delay: 1.6 },
  },
};

const TYPEWRITER_PHRASES = [
  'AI/ML Engineer crafting intelligent systems',
  'Building Agentic AI Systems',
  'Published Researcher (Springer, IEEE)',
  'MS CS @ NC State \'26',
];

/* ---------- Hero component ---------- */

export function Hero() {
  const reduced = useReducedMotion();
  const subtitle = useTypewriter(TYPEWRITER_PHRASES, 50, 30, 2000);

  return (
    <section
      id="hero"
      className="relative min-h-dvh flex flex-col items-center justify-center px-4 sm:px-6 bg-transparent overflow-hidden"
      aria-label="Introduction"
    >
      {/* Spotlights - dark mode only */}
      {!reduced && (
        <>
          <Spotlight
            className="-top-40 left-0 md:left-60 md:-top-20 hidden dark:block"
            fill="#00d4ff"
          />
          <Spotlight
            className="-top-28 right-0 md:right-40 md:-top-16 h-[120%] w-[100%] lg:w-[60%] hidden dark:block"
            fill="#e8b04a"
          />
        </>
      )}

      <motion.div
        className="relative z-[2] flex flex-col items-center text-center gap-5 max-w-3xl"
        variants={reduced ? undefined : container}
        initial={reduced ? undefined : 'hidden'}
        animate={reduced ? undefined : 'show'}
      >
        {/* Name */}
        <motion.h1
          variants={reduced ? undefined : fadeUp}
          className="font-heading text-6xl sm:text-7xl md:text-8xl font-bold leading-[1.05] bg-gradient-to-r from-text-primary via-text-primary to-text-primary/60 bg-clip-text text-transparent"
        >
          Shanmukha Chatadi
        </motion.h1>

        {/* Gradient divider line */}
        <motion.div
          variants={reduced ? undefined : fadeUp}
          className="w-48 h-px bg-gradient-to-r from-transparent via-cyan-accent to-transparent"
          aria-hidden="true"
        />

        {/* Subtitle - typewriter cycling */}
        <motion.p
          variants={reduced ? undefined : fadeUp}
          className="text-xl md:text-2xl text-text-muted h-8"
        >
          {reduced ? (
            TYPEWRITER_PHRASES[0]
          ) : (
            <>
              {subtitle}
              <span className="animate-blink text-cyan-accent">|</span>
            </>
          )}
        </motion.p>

        {/* One-line bio */}
        <motion.p
          variants={reduced ? undefined : delayedFade}
          className="text-sm font-mono text-text-muted/60"
        >
          MS CS @ NC State &middot; Published in Springer &amp; IEEE &middot; Currently at MiHIN
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          variants={reduced ? undefined : ctaFade}
          className="flex items-center gap-4 mt-4"
        >
          <ShimmerButton variant="primary" href="#projects">
            View Work
          </ShimmerButton>
          <ShimmerButton variant="secondary" href="#contact">
            Get in Touch
          </ShimmerButton>
        </motion.div>

        {/* Social icons */}
        <motion.div
          variants={reduced ? undefined : ctaFade}
          className="flex items-center gap-5 mt-2"
        >
          <a
            href="https://github.com/shinegami-2002"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-muted/50 hover:text-cyan-accent hover:scale-125 transition-all duration-300"
            aria-label="GitHub"
          >
            <Github size={20} />
          </a>
          <a
            href="https://linkedin.com/in/shanmukha-chatadi"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-muted/50 hover:text-cyan-accent hover:scale-125 transition-all duration-300"
            aria-label="LinkedIn"
          >
            <Linkedin size={20} />
          </a>
          <a
            href="mailto:schatad@ncsu.edu"
            className="text-text-muted/50 hover:text-cyan-accent hover:scale-125 transition-all duration-300"
            aria-label="Email"
          >
            <Mail size={20} />
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
