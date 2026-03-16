'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { TechTag } from '@/components/ui/TechTag';
import type { Experience } from '@/types';

interface TimelineCardProps {
  experience: Experience;
  defaultExpanded?: boolean;
}

export function TimelineCard({ experience, defaultExpanded = false }: TimelineCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const accentColors = {
    cyan: { border: 'border-cyan-accent/20', text: 'text-cyan-accent', tag: 'cyan' as const },
    magenta: { border: 'border-magenta-accent/20', text: 'text-magenta-accent', tag: 'magenta' as const },
    blue: { border: 'border-blue-accent/20', text: 'text-blue-accent', tag: 'blue' as const },
  };
  const accent = accentColors[experience.accent];

  return (
    <div
      className={`glass-card p-5 cursor-pointer ${accent.border}`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex justify-between items-start gap-4">
        <div>
          <h3 className="font-heading text-lg font-semibold text-white">{experience.title}</h3>
          <p className={`text-sm ${accent.text}`}>{experience.company}</p>
          <p className="text-xs text-text-muted font-mono">
            {experience.location} | {experience.period}
          </p>
        </div>
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-text-muted" />
        </motion.div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <ul className="mt-4 space-y-2">
              {experience.bullets.map((bullet, i) => (
                <li
                  key={i}
                  className="text-base text-text-primary/80 pl-4 relative before:content-['\25B8'] before:absolute before:left-0 before:text-cyan-accent/60"
                >
                  {bullet}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-1.5 mt-4">
              {experience.tags.map((tag) => (
                <TechTag key={tag} variant={accent.tag} size="sm">
                  {tag}
                </TechTag>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
