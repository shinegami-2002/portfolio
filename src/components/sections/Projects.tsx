'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionWrapper } from '@/components/layout/SectionWrapper';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { projects } from '@/data/projects';

const filters = [
  { label: 'All', value: 'all' },
  { label: 'AI/ML', value: 'ai-ml' },
  { label: 'Backend', value: 'backend' },
  { label: 'Full-Stack', value: 'full-stack' },
  { label: 'Research', value: 'research' },
] as const;

type FilterValue = (typeof filters)[number]['value'];

export function Projects() {
  const [activeFilter, setActiveFilter] = useState<FilterValue>('all');

  const filtered =
    activeFilter === 'all'
      ? projects
      : projects.filter((p) => p.categories.includes(activeFilter as Exclude<FilterValue, 'all'>));

  return (
    <SectionWrapper id="projects" title="Projects">
      {/* Filter bar */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setActiveFilter(filter.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-mono transition-all duration-200 cursor-pointer border ${
              activeFilter === filter.value
                ? 'bg-cyan-accent/15 border-cyan-accent/40 text-cyan-accent'
                : 'bg-white/[0.03] border-white/[0.08] text-text-muted hover:border-white/20 hover:text-text-primary'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Project grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        layout
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </AnimatePresence>
      </motion.div>
    </SectionWrapper>
  );
}
