'use client';

import { useState, useEffect } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Github, Linkedin, ArrowDown } from 'lucide-react';
import { ShimmerButton } from '@/components/ui/ShimmerButton';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/* ---------- Typewriter hook ---------- */

const ROLES = [
  'Applied AI/ML Engineer',
  'Building Agentic AI Systems',
  'Published Researcher (Springer, IEEE)',
  'MS CS @ NC State \'26',
];

const TYPE_SPEED = 50;
const DELETE_SPEED = 30;
const PAUSE_AFTER_TYPE = 2000;
const PAUSE_AFTER_DELETE = 400;

function useTypewriterEffect(strings: string[], reduced: boolean): string {
  const [text, setText] = useState('');

  useEffect(() => {
    if (reduced) {
      setText(strings[0]);
      return;
    }

    let currentIndex = 0;
    let currentChar = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;

    function step() {
      const current = strings[currentIndex];

      if (!deleting) {
        if (currentChar <= current.length) {
          setText(current.slice(0, currentChar));
          currentChar++;
          timer = setTimeout(step, TYPE_SPEED);
        } else {
          deleting = true;
          timer = setTimeout(step, PAUSE_AFTER_TYPE);
        }
      } else {
        if (currentChar > 0) {
          currentChar--;
          setText(current.slice(0, currentChar));
          timer = setTimeout(step, DELETE_SPEED);
        } else {
          deleting = false;
          currentIndex = (currentIndex + 1) % strings.length;
          timer = setTimeout(step, PAUSE_AFTER_DELETE);
        }
      }
    }

    timer = setTimeout(step, PAUSE_AFTER_DELETE);
    return () => clearTimeout(timer);
  }, [strings, reduced]);

  return text;
}

/* ---------- Animation variants ---------- */

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.8, ease: 'easeOut' as const },
  },
};

/* ---------- Hero component ---------- */

export function Hero() {
  const reduced = useReducedMotion();
  const typedText = useTypewriterEffect(ROLES, reduced);

  return (
    <section
      id="hero"
      className="relative min-h-dvh flex flex-col items-center justify-center px-4 sm:px-6"
      aria-label="Introduction"
    >
      <motion.div
        className="flex flex-col items-center text-center gap-6 sm:gap-8 max-w-2xl"
        variants={reduced ? undefined : container}
        initial={reduced ? undefined : 'hidden'}
        animate={reduced ? undefined : 'show'}
      >
        {/* Photo placeholder */}
        <motion.div variants={reduced ? undefined : fadeUp}>
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full border-2 border-cyan-accent/30 bg-gradient-to-br from-cyan-accent/5 to-blue-accent/5 shadow-[0_0_30px_rgba(0,242,255,0.15)] flex items-center justify-center overflow-hidden">
            {/* Scan-line overlay */}
            <div
              className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
              aria-hidden="true"
            >
              <div className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-accent/40 to-transparent animate-scan-line" />
            </div>
            {/* Initials placeholder */}
            <span className="font-heading text-3xl sm:text-4xl text-cyan-accent/60 select-none">
              SC
            </span>
          </div>
        </motion.div>

        {/* Name with shimmer effect */}
        <motion.h1
          variants={reduced ? undefined : fadeUp}
          className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold leading-tight bg-gradient-to-r from-cyan-accent via-white to-cyan-accent bg-[length:200%_100%] bg-clip-text text-transparent animate-shimmer"
        >
          Shanmukha Chatadi
        </motion.h1>

        {/* Typewriter subtitle */}
        <motion.div
          variants={reduced ? undefined : fadeUp}
          className="h-8 sm:h-10 flex items-center justify-center"
        >
          <p className="font-mono text-base sm:text-lg text-text-muted">
            {typedText}
            <span
              className="inline-block w-[2px] h-[1.1em] bg-cyan-accent ml-0.5 align-middle animate-glow-pulse"
              aria-hidden="true"
            />
          </p>
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          variants={reduced ? undefined : fadeUp}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-2"
        >
          <ShimmerButton variant="primary" href="#projects">
            View Projects
          </ShimmerButton>
          <ShimmerButton
            variant="primary"
            href="/resume/Shanmukha_Chatadi_Resume.pdf"
          >
            Download Resume
          </ShimmerButton>
          <ShimmerButton
            variant="secondary"
            href="https://github.com/shinegami-2002"
            aria-label="GitHub profile"
          >
            <Github size={18} />
          </ShimmerButton>
          <ShimmerButton
            variant="secondary"
            href="https://linkedin.com/in/shanmukha-chatadi"
            aria-label="LinkedIn profile"
          >
            <Linkedin size={18} />
          </ShimmerButton>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        variants={reduced ? undefined : fadeIn}
        initial={reduced ? undefined : 'hidden'}
        animate={reduced ? undefined : 'show'}
        transition={{ delay: 1.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <a
          href="#about"
          aria-label="Scroll down"
          className="group flex flex-col items-center gap-2 text-text-muted/50 hover:text-cyan-accent/70 transition-colors"
        >
          <div className="relative w-6 h-10 rounded-full border-2 border-current flex items-start justify-center pt-2">
            <div className="w-1 h-2 rounded-full bg-current animate-float" />
          </div>
          <ArrowDown size={14} className="animate-float" />
        </a>
      </motion.div>
    </section>
  );
}
