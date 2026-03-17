'use client';

import { motion } from 'framer-motion';
import { Github, ExternalLink, BookOpen, HeartPulse, Link, Layers, Brain, Gamepad2, Bot, type LucideIcon } from 'lucide-react';
import { SectionWrapper } from '@/components/layout/SectionWrapper';
import { projects } from '@/data/projects';
import { cn } from '@/lib/utils';

const PROJECT_ICONS: Record<string, LucideIcon> = {
  'scholar-agent': BookOpen,
  'mcp-healthcare': HeartPulse,
  'linkvault': Link,
  'distributed-task-queue': Layers,
  'neural-network-pruning': Brain,
  'llms4pcg': Gamepad2,
  'ai-chatbot': Bot,
};

const ACCENT_STYLES: Record<string, { text: string; tagBg: string; tagBorder: string; strip: string; iconColor: string }> = {
  cyan: {
    text: 'text-cyan-accent',
    tagBg: 'bg-cyan-accent/10',
    tagBorder: 'border-cyan-accent/20',
    strip: 'from-cyan-accent/60 to-cyan-accent/20',
    iconColor: 'text-cyan-accent/10',
  },
  blue: {
    text: 'text-blue-accent',
    tagBg: 'bg-blue-accent/10',
    tagBorder: 'border-blue-accent/20',
    strip: 'from-blue-accent/60 to-blue-accent/20',
    iconColor: 'text-blue-accent/10',
  },
};

function ProjectCard({ project, index }: { project: (typeof projects)[0]; index: number }) {
  const colors = ACCENT_STYLES[project.accent] || ACCENT_STYLES.cyan;
  const Icon = PROJECT_ICONS[project.id] || BookOpen;
  const number = (index + 1).toString().padStart(2, '0');

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group relative glass-card overflow-hidden hover-lift hover-glow-cyan"
    >
      {/* Accent strip at top */}
      <div className={cn('h-[3px] w-full bg-gradient-to-r', colors.strip)} />

      {/* Watermark icon */}
      <Icon className={cn('absolute top-6 right-6 w-20 h-20 transition-all duration-500 group-hover:opacity-[0.15] group-hover:scale-110', colors.iconColor)} strokeWidth={1} />

      <div className="relative p-6 md:p-8">
        {/* Number + Title */}
        <span className="text-xs font-mono text-text-muted/40">{number}</span>
        <h3 className="font-heading text-xl md:text-2xl font-semibold text-text-primary mt-1">
          {project.title}
        </h3>
        {project.subtitle && (
          <p className={cn('text-sm font-mono mt-1', colors.text)}>{project.subtitle}</p>
        )}

        {/* Divider */}
        <div className="w-12 h-px bg-gray-200 dark:bg-white/[0.1] my-4" />

        {/* Description */}
        <p className="text-sm text-text-muted leading-relaxed mb-4">
          {project.description}
        </p>

        {/* Top 1-2 bullets (most impressive) */}
        {project.bullets.length > 0 && (
          <ul className="space-y-1.5 mb-4">
            {project.bullets.slice(0, 2).map((bullet, i) => (
              <li key={i} className="text-sm text-text-primary/60 leading-relaxed pl-4 relative">
                <span className="absolute left-0 top-[7px] w-1.5 h-1.5 rounded-full bg-cyan-accent/40" />
                {bullet.length > 120 ? bullet.slice(0, 120) + '...' : bullet}
              </li>
            ))}
          </ul>
        )}

        {/* Tech tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tags.slice(0, 6).map((tag) => (
            <span
              key={tag}
              className={cn(
                'px-2.5 py-0.5 rounded-full border text-[11px] font-mono transition-all duration-200',
                colors.tagBg, colors.tagBorder, colors.text
              )}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Bottom row: period + links */}
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs font-mono text-text-muted/50">{project.period}</span>
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-text-muted hover:text-cyan-accent transition-colors duration-200"
              aria-label={`View ${project.title} on GitHub`}
            >
              <Github className="w-4 h-4" />
              <span className="font-mono text-xs">Source</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function Projects() {
  return (
    <SectionWrapper id="projects" title="Projects" number={3}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </SectionWrapper>
  );
}
