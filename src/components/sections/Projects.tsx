'use client';

import { motion } from 'framer-motion';
import { Github } from 'lucide-react';
import { SectionWrapper } from '@/components/layout/SectionWrapper';
import { projects } from '@/data/projects';
import { cn } from '@/lib/utils';

const ACCENT_COLORS: Record<string, { text: string; tagBg: string; tagBorder: string }> = {
  cyan: {
    text: 'text-cyan-accent',
    tagBg: 'bg-cyan-accent/10',
    tagBorder: 'border-cyan-accent/20',
  },
  blue: {
    text: 'text-blue-accent',
    tagBg: 'bg-blue-accent/10',
    tagBorder: 'border-blue-accent/20',
  },
};

function ProjectEditorialCard({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) {
  const colors = ACCENT_COLORS[project.accent] || ACCENT_COLORS.cyan;
  const number = (index + 1).toString().padStart(2, '0');

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      className="max-w-4xl mx-auto hover-lift group"
    >
      {/* Project number */}
      <span className="block font-mono text-4xl md:text-5xl font-bold text-text-primary/[0.06] mb-3 select-none">
        {number}
      </span>

      {/* Title row */}
      <div className="flex items-start justify-between gap-4 mb-2">
        <div>
          <h3 className="font-heading text-2xl md:text-3xl font-semibold text-text-primary">
            {project.title}
          </h3>
          {project.subtitle && (
            <p className={cn('text-sm font-mono mt-1', colors.text)}>
              {project.subtitle}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs text-text-muted font-mono">{project.period}</span>
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-white/10 text-sm font-mono text-text-muted hover:text-text-primary hover:border-gray-400 dark:hover:border-white/25 hover:bg-black/[0.03] dark:hover:bg-white/[0.06] hover:scale-105 transition-all duration-300"
              aria-label={`View ${project.title} on GitHub`}
              onClick={(e) => e.stopPropagation()}
            >
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline">Source</span>
            </a>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-gray-200 dark:bg-white/[0.08] my-4" />

      {/* Description */}
      <p className="text-base text-text-primary/70 leading-relaxed mb-5">
        {project.description}
      </p>

      {/* Tech stack tags */}
      <div className="flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className={cn(
              'inline-flex items-center px-3 py-1 rounded-full border text-xs font-mono transition-all duration-200 hover:opacity-100 hover:brightness-125',
              colors.tagBg,
              colors.tagBorder,
              colors.text,
            )}
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export function Projects() {
  return (
    <SectionWrapper id="projects" title="Projects" number={3}>
      <div className="space-y-16">
        {projects.map((project, index) => (
          <ProjectEditorialCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </SectionWrapper>
  );
}
