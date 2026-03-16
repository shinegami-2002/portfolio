'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Server,
  Link2,
  Layers,
  Scissors,
  Gamepad2,
  Bot,
  Github,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { projects } from '@/data/projects';
import { TechTag } from '@/components/ui/TechTag';
import type { Project } from '@/types';

interface CarouselFeature {
  project: Project;
  icon: LucideIcon;
  gradient: string;
  glowColor: string;
}

const ICON_MAP: Record<string, LucideIcon> = {
  'scholar-agent': Brain,
  'mcp-healthcare': Server,
  linkvault: Link2,
  'distributed-task-queue': Layers,
  'neural-network-pruning': Scissors,
  llms4pcg: Gamepad2,
  'ai-chatbot': Bot,
};

const GRADIENT_MAP: Record<string, string> = {
  cyan: 'from-cyan-accent/20 via-cyan-accent/5 to-transparent',
  magenta: 'from-magenta-accent/20 via-magenta-accent/5 to-transparent',
  blue: 'from-blue-accent/20 via-blue-accent/5 to-transparent',
};

const GLOW_MAP: Record<string, string> = {
  cyan: 'rgba(0,242,255,0.15)',
  magenta: 'rgba(255,0,193,0.15)',
  blue: 'rgba(77,136,255,0.15)',
};

const ACCENT_TEXT: Record<string, string> = {
  cyan: 'text-cyan-accent',
  magenta: 'text-magenta-accent',
  blue: 'text-blue-accent',
};

const ACCENT_BORDER: Record<string, string> = {
  cyan: 'border-cyan-accent/30',
  magenta: 'border-magenta-accent/30',
  blue: 'border-blue-accent/30',
};

const ACCENT_BG: Record<string, string> = {
  cyan: 'bg-cyan-accent',
  magenta: 'bg-magenta-accent',
  blue: 'bg-blue-accent',
};

const FEATURES: CarouselFeature[] = projects.map((project) => ({
  project,
  icon: ICON_MAP[project.id] || Brain,
  gradient: GRADIENT_MAP[project.accent] || GRADIENT_MAP.cyan,
  glowColor: GLOW_MAP[project.accent] || GLOW_MAP.cyan,
}));

const AUTO_PLAY_INTERVAL = 4500;
const ITEM_HEIGHT = 60;

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

export function FeatureCarousel() {
  const [step, setStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const currentIndex =
    ((step % FEATURES.length) + FEATURES.length) % FEATURES.length;

  const nextStep = useCallback(() => {
    setStep((prev) => prev + 1);
  }, []);

  const handleChipClick = (index: number) => {
    const diff =
      (index - currentIndex + FEATURES.length) % FEATURES.length;
    if (diff > 0) setStep((s) => s + diff);
  };

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextStep, AUTO_PLAY_INTERVAL);
    return () => clearInterval(interval);
  }, [nextStep, isPaused]);

  const getCardStatus = (index: number) => {
    const diff = index - currentIndex;
    const len = FEATURES.length;

    let normalizedDiff = diff;
    if (diff > len / 2) normalizedDiff -= len;
    if (diff < -len / 2) normalizedDiff += len;

    if (normalizedDiff === 0) return 'active';
    if (normalizedDiff === -1) return 'prev';
    if (normalizedDiff === 1) return 'next';
    return 'hidden';
  };

  const activeFeature = FEATURES[currentIndex];

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl flex flex-col lg:flex-row min-h-[550px] lg:min-h-[500px] border border-white/[0.06] bg-white/[0.02]">
        {/* Left panel: feature list */}
        <div className="w-full lg:w-[38%] min-h-[320px] md:min-h-[380px] lg:h-auto relative z-30 flex flex-col items-start justify-center overflow-hidden px-6 md:px-10 lg:pl-10 bg-white/[0.03] backdrop-blur-xl border-b lg:border-b-0 lg:border-r border-white/[0.06]">
          {/* Fade edges */}
          <div className="absolute inset-x-0 top-0 h-12 md:h-16 bg-gradient-to-b from-card/80 to-transparent z-40 pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-12 md:h-16 bg-gradient-to-t from-card/80 to-transparent z-40 pointer-events-none" />

          <div className="relative w-full h-full flex items-center justify-center lg:justify-start z-20">
            {FEATURES.map((feature, index) => {
              const isActive = index === currentIndex;
              const distance = index - currentIndex;
              const wrappedDistance = wrap(
                -(FEATURES.length / 2),
                FEATURES.length / 2,
                distance
              );
              const Icon = feature.icon;

              return (
                <motion.div
                  key={feature.project.id}
                  style={{
                    height: ITEM_HEIGHT,
                    width: 'fit-content',
                  }}
                  animate={{
                    y: wrappedDistance * ITEM_HEIGHT,
                    opacity: 1 - Math.abs(wrappedDistance) * 0.22,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 90,
                    damping: 22,
                    mass: 1,
                  }}
                  className="absolute flex items-center justify-start"
                >
                  <button
                    onClick={() => handleChipClick(index)}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    className={cn(
                      'relative flex items-center gap-3 px-5 md:px-7 lg:px-6 py-2.5 md:py-3.5 lg:py-3 rounded-full transition-all duration-500 text-left group border cursor-pointer',
                      isActive
                        ? `${ACCENT_BG[feature.project.accent]} text-deep border-transparent z-10`
                        : 'bg-transparent text-text-muted border-white/10 hover:border-white/20 hover:text-text-primary'
                    )}
                  >
                    <Icon
                      className={cn(
                        'w-4 h-4 shrink-0 transition-colors duration-500',
                        isActive
                          ? 'text-deep'
                          : 'text-text-muted/60'
                      )}
                      strokeWidth={2}
                    />
                    <span className="font-mono text-xs md:text-[13px] tracking-tight whitespace-nowrap uppercase">
                      {feature.project.title}
                    </span>
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right panel: project card */}
        <div className="flex-1 min-h-[420px] md:min-h-[480px] lg:h-auto relative flex items-center justify-center py-10 md:py-14 lg:py-10 px-4 md:px-8 lg:px-8 overflow-hidden">
          {/* Animated background glow */}
          <motion.div
            key={`glow-${currentIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 80% 60% at 50% 40%, ${activeFeature.glowColor}, transparent)`,
            }}
          />

          <div className="relative w-full max-w-[460px] flex items-center justify-center">
            {FEATURES.map((feature, index) => {
              const status = getCardStatus(index);
              const isActive = status === 'active';
              const isPrev = status === 'prev';
              const isNext = status === 'next';
              const Icon = feature.icon;
              const accent = feature.project.accent;

              return (
                <motion.div
                  key={feature.project.id}
                  initial={false}
                  animate={{
                    x: isActive ? 0 : isPrev ? -80 : isNext ? 80 : 0,
                    scale: isActive ? 1 : isPrev || isNext ? 0.88 : 0.75,
                    opacity: isActive ? 1 : isPrev || isNext ? 0.3 : 0,
                    rotateY: isPrev ? -5 : isNext ? 5 : 0,
                    zIndex: isActive ? 20 : isPrev || isNext ? 10 : 0,
                    pointerEvents: isActive
                      ? ('auto' as const)
                      : ('none' as const),
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 260,
                    damping: 25,
                    mass: 0.8,
                  }}
                  className={cn(
                    'absolute inset-0 rounded-2xl md:rounded-3xl overflow-hidden border origin-center',
                    isActive
                      ? ACCENT_BORDER[accent]
                      : 'border-white/[0.06]'
                  )}
                >
                  {/* Card background gradient */}
                  <div
                    className={cn(
                      'absolute inset-0 bg-gradient-to-br opacity-60',
                      feature.gradient
                    )}
                  />
                  <div className="absolute inset-0 bg-card/90 backdrop-blur-sm" />

                  {/* Card content */}
                  <div className="relative h-full flex flex-col p-6 md:p-8">
                    {/* Top: icon + index */}
                    <div className="flex items-center justify-between mb-5">
                      <div
                        className={cn(
                          'w-10 h-10 rounded-xl flex items-center justify-center border',
                          ACCENT_BORDER[accent],
                          'bg-white/[0.03]'
                        )}
                      >
                        <Icon
                          className={cn('w-5 h-5', ACCENT_TEXT[accent])}
                          strokeWidth={1.5}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        {feature.project.githubUrl && (
                          <a
                            href={feature.project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                              'text-text-muted hover:text-text-primary transition-colors p-1.5 rounded-lg hover:bg-white/[0.05]'
                            )}
                            aria-label={`View ${feature.project.title} on GitHub`}
                          >
                            <Github className="w-4 h-4" />
                          </a>
                        )}
                        <span className="text-text-muted/50 text-[10px] font-mono uppercase tracking-widest">
                          {String(index + 1).padStart(2, '0')}/{String(FEATURES.length).padStart(2, '0')}
                        </span>
                      </div>
                    </div>

                    {/* Title + subtitle */}
                    <AnimatePresence mode="wait">
                      {isActive && (
                        <motion.div
                          key={`content-${feature.project.id}`}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.35, delay: 0.1 }}
                          className="flex-1 flex flex-col"
                        >
                          <h3 className="font-heading text-xl md:text-2xl font-semibold text-white mb-1">
                            {feature.project.title}
                          </h3>
                          {feature.project.subtitle && (
                            <p
                              className={cn(
                                'text-xs font-mono mb-1',
                                ACCENT_TEXT[accent]
                              )}
                            >
                              {feature.project.subtitle}
                            </p>
                          )}
                          <p className="text-xs text-text-muted font-mono mb-4">
                            {feature.project.period}
                          </p>

                          {/* Description */}
                          <p className="text-sm text-text-primary/70 leading-relaxed mb-5">
                            {feature.project.description}
                          </p>

                          {/* Tech tags */}
                          <div className="flex flex-wrap gap-1.5 mt-auto">
                            {feature.project.tags.slice(0, 6).map((tag) => (
                              <TechTag
                                key={tag}
                                variant={accent}
                                size="sm"
                              >
                                {tag}
                              </TechTag>
                            ))}
                            {feature.project.tags.length > 6 && (
                              <TechTag variant="muted" size="sm">
                                +{feature.project.tags.length - 6}
                              </TechTag>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Decorative corner accent */}
                    <div
                      className={cn(
                        'absolute bottom-0 right-0 w-24 h-24 opacity-10',
                        `bg-gradient-to-tl ${feature.gradient}`
                      )}
                      style={{ borderRadius: '100% 0 0 0' }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-1.5 mt-5">
        {FEATURES.map((feature, index) => (
          <button
            key={feature.project.id}
            onClick={() => handleChipClick(index)}
            className={cn(
              'rounded-full transition-all duration-500 cursor-pointer',
              index === currentIndex
                ? `w-6 h-1.5 ${ACCENT_BG[feature.project.accent]}`
                : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'
            )}
            aria-label={`Go to ${feature.project.title}`}
          />
        ))}
      </div>
    </div>
  );
}

export default FeatureCarousel;
