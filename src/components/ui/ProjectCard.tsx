'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, ChevronDown } from 'lucide-react';
import { TechTag } from '@/components/ui/TechTag';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { Project } from '@/types';

export function ProjectCard({ project }: { project: Project }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [expanded, setExpanded] = useState(false);
  const reducedMotion = useReducedMotion();

  const handleMouseMove = (e: React.MouseEvent) => {
    if (reducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -8, y: x * 8 });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  const accentMap = {
    cyan: {
      border: 'hover:border-cyan-accent/30',
      glow: 'hover:shadow-[0_0_30px_rgba(0,242,255,0.12)]',
      tag: 'cyan' as const,
    },
    magenta: {
      border: 'hover:border-magenta-accent/30',
      glow: 'hover:shadow-[0_0_30px_rgba(255,0,193,0.12)]',
      tag: 'magenta' as const,
    },
    blue: {
      border: 'hover:border-blue-accent/30',
      glow: 'hover:shadow-[0_0_30px_rgba(77,136,255,0.12)]',
      tag: 'blue' as const,
    },
  };
  const accent = accentMap[project.accent];

  return (
    <motion.div
      ref={cardRef}
      className={`glass-card p-5 transition-all duration-300 ${accent.border} ${accent.glow}`}
      style={{
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${tilt.x || tilt.y ? 1.02 : 1})`,
        transition: 'transform 0.15s ease-out, box-shadow 0.3s',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      layout
    >
      <div className="flex justify-between items-start">
        <h3 className="font-heading text-lg font-medium text-white">
          {project.title}
        </h3>
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-muted hover:text-cyan-accent transition-colors"
            aria-label={`View ${project.title} on GitHub`}
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>

      {project.subtitle && (
        <p className="text-xs text-text-muted font-mono mt-1">
          {project.subtitle}
        </p>
      )}

      <p className="text-xs text-text-muted font-mono mt-1">{project.period}</p>

      <p className="text-base text-text-primary/70 mt-3">{project.description}</p>

      <div className="flex flex-wrap gap-1.5 mt-3">
        {project.tags.slice(0, 5).map((tag) => (
          <TechTag key={tag} variant={accent.tag} size="sm">
            {tag}
          </TechTag>
        ))}
      </div>

      {project.bullets.length > 0 && (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 mt-3 text-xs text-text-muted hover:text-cyan-accent transition-colors cursor-pointer"
          >
            {expanded ? 'Less' : 'Details'}
            <ChevronDown
              className={`w-3 h-3 transition-transform ${expanded ? 'rotate-180' : ''}`}
            />
          </button>
          <AnimatePresence>
            {expanded && (
              <motion.ul
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mt-2 space-y-2"
              >
                {project.bullets.map((bullet, i) => (
                  <li
                    key={i}
                    className="text-base text-text-primary/70 pl-4 relative before:content-['▸'] before:absolute before:left-0 before:text-cyan-accent/50"
                  >
                    {bullet}
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </>
      )}
    </motion.div>
  );
}
