'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { TechTag } from '@/components/ui/TechTag';
import type { Experience } from '@/types';

interface TimelineCardProps {
  experience: Experience;
  defaultExpanded?: boolean;
  isFirst?: boolean;
}

export function TimelineCard({ experience, defaultExpanded = false, isFirst = false }: TimelineCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const tagVariant = experience.accent === 'cyan' ? 'cyan' as const : 'blue' as const;

  return (
    <div
      className={`glass-card p-5 cursor-pointer hover-lift hover-glow-cyan ${isFirst ? 'border-t-2 border-t-cyan-accent/40' : ''} group`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h3 className="font-heading text-xl font-semibold text-white">
            {experience.company}
          </h3>
          <p className="text-base text-text-muted mt-0.5">
            {experience.title}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <p className="text-sm font-mono text-text-muted/60 text-right">
            {experience.location}<br />{experience.period}
          </p>
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-5 h-5 text-text-muted group-hover:text-cyan-accent transition-colors duration-300" />
          </motion.div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
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
                <TechTag key={tag} variant={tagVariant} size="sm">
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
