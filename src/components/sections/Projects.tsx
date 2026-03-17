'use client';

import { motion } from 'framer-motion';
import { Github, BookOpen, HeartPulse, Link, Layers, Brain, Gamepad2, Bot, type LucideIcon } from 'lucide-react';
import { SectionWrapper } from '@/components/layout/SectionWrapper';
import { projects } from '@/data/projects';
import { cn } from '@/lib/utils';

const ACCENT_COLORS: Record<string, { border: string; text: string; glow: string; tagBg: string; tagBorder: string }> = {
  cyan: {
    border: 'border-cyan-accent/25',
    text: 'text-cyan-accent',
    glow: '0 0 40px rgba(0,242,255,0.12)',
    tagBg: 'bg-cyan-accent/10',
    tagBorder: 'border-cyan-accent/20',
  },
  blue: {
    border: 'border-blue-accent/25',
    text: 'text-blue-accent',
    glow: '0 0 40px rgba(77,136,255,0.12)',
    tagBg: 'bg-blue-accent/10',
    tagBorder: 'border-blue-accent/20',
  },
};

interface ProjectHeaderConfig {
  icon: LucideIcon;
  gradient: string;
}

const PROJECT_HEADERS: Record<string, ProjectHeaderConfig> = {
  'scholar-agent': {
    icon: BookOpen,
    gradient: 'from-cyan-500/30 via-blue-600/20 to-blue-800/10',
  },
  'mcp-healthcare': {
    icon: HeartPulse,
    gradient: 'from-blue-500/30 via-teal-600/20 to-cyan-800/10',
  },
  'linkvault': {
    icon: Link,
    gradient: 'from-blue-600/30 via-indigo-600/20 to-indigo-900/10',
  },
  'distributed-task-queue': {
    icon: Layers,
    gradient: 'from-slate-600/30 via-blue-700/20 to-cyan-800/10',
  },
  'neural-network-pruning': {
    icon: Brain,
    gradient: 'from-teal-500/30 via-blue-600/20 to-blue-900/10',
  },
  'llms4pcg': {
    icon: Gamepad2,
    gradient: 'from-slate-700/30 via-blue-800/20 to-slate-900/10',
  },
  'ai-chatbot': {
    icon: Bot,
    gradient: 'from-cyan-500/30 via-blue-800/20 to-slate-900/10',
  },
};

function ProjectShowcaseCard({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) {
  const colors = ACCENT_COLORS[project.accent] || ACCENT_COLORS.cyan;
  const headerConfig = PROJECT_HEADERS[project.id];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className={cn(
        'group relative w-full max-w-4xl mx-auto rounded-2xl border overflow-hidden transition-shadow duration-500',
        colors.border,
        'bg-white/[0.02] backdrop-blur-sm',
      )}
      style={{ boxShadow: 'none' }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = colors.glow;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
      }}
    >
      {/* Styled gradient header with icon watermark */}
      {headerConfig ? (
        <div
          className={cn(
            'relative w-full h-40 md:h-48 overflow-hidden border-b border-white/[0.06]',
            'bg-gradient-to-br',
            headerConfig.gradient,
          )}
        >
          <div className="absolute inset-0 bg-[#050510]/40" />
          {/* Large watermark icon */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2">
            <headerConfig.icon className="w-24 h-24 md:w-32 md:h-32 text-white/[0.06]" strokeWidth={1} />
          </div>
          {/* Title overlay */}
          <div className="absolute bottom-4 left-6 right-6">
            <h3 className="font-heading text-xl md:text-2xl font-semibold text-white/90">
              {project.title}
            </h3>
            {project.subtitle && (
              <p className={cn('text-sm font-mono mt-1', colors.text, 'opacity-80')}>
                {project.subtitle}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div
          className={cn(
            'relative w-full h-32 md:h-40 overflow-hidden border-b border-white/[0.06]',
            'bg-gradient-to-br from-blue-600/20 to-transparent',
          )}
        >
          <div className="absolute inset-0 bg-[#050510]/70" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={cn('font-heading text-2xl font-semibold opacity-30', colors.text)}>
              {project.title}
            </span>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-6 md:p-8">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            {!headerConfig && (
              <h3 className="font-heading text-2xl md:text-3xl font-semibold text-white mb-1">
                {project.title}
              </h3>
            )}
            <div className="flex items-center gap-3 flex-wrap">
              {!headerConfig && project.subtitle && (
                <span className={cn('text-sm font-mono', colors.text)}>
                  {project.subtitle}
                </span>
              )}
              <span className="text-xs text-text-muted font-mono">{project.period}</span>
            </div>
          </div>

          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-mono transition-all duration-300 shrink-0',
                'border-white/10 text-text-muted hover:text-white hover:border-white/25 hover:bg-white/[0.05]',
              )}
              aria-label={`View ${project.title} on GitHub`}
            >
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline">Source</span>
            </a>
          )}
        </div>

        {/* Description */}
        <p className="text-base text-text-primary/70 leading-relaxed mb-5">
          {project.description}
        </p>

        {/* Key bullets */}
        {project.bullets.length > 0 && (
          <ul className="space-y-2.5 mb-6">
            {project.bullets.map((bullet, i) => (
              <li
                key={i}
                className="text-sm text-text-primary/60 leading-relaxed pl-5 relative"
              >
                <span
                  className={cn('absolute left-0 top-[7px] w-1.5 h-1.5 rounded-full', {
                    'bg-cyan-accent/60': project.accent === 'cyan',
                    'bg-blue-accent/60': project.accent === 'blue',
                  })}
                />
                {bullet}
              </li>
            ))}
          </ul>
        )}

        {/* Tech stack tags */}
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className={cn(
                'inline-flex items-center px-3 py-1 rounded-full border text-xs font-mono transition-colors',
                colors.tagBg,
                colors.tagBorder,
                colors.text,
              )}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function Projects() {
  return (
    <SectionWrapper id="projects" title="Projects">
      <div className="space-y-10">
        {projects.map((project, index) => (
          <ProjectShowcaseCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </SectionWrapper>
  );
}
