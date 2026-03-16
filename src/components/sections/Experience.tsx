'use client';

import { motion } from 'framer-motion';
import { SectionWrapper } from '@/components/layout/SectionWrapper';
import { TimelineCard } from '@/components/ui/TimelineCard';
import { experiences } from '@/data/experience';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const dotColors = {
  cyan: {
    bg: 'bg-cyan-accent',
    shadow: 'shadow-[0_0_8px_2px_rgba(0,242,255,0.5)]',
  },
  magenta: {
    bg: 'bg-magenta-accent',
    shadow: 'shadow-[0_0_8px_2px_rgba(255,0,193,0.5)]',
  },
  blue: {
    bg: 'bg-blue-accent',
    shadow: 'shadow-[0_0_8px_2px_rgba(77,136,255,0.5)]',
  },
};

export function Experience() {
  const reducedMotion = useReducedMotion();

  return (
    <SectionWrapper id="experience" title="Experience">
      <div className="relative max-w-3xl mx-auto">
        {/* Glowing vertical timeline line */}
        <div
          className="absolute left-4 md:left-6 top-0 bottom-0 w-0.5"
          style={{
            background:
              'linear-gradient(to bottom, #00f2ff, #ff00c1, #4d88ff)',
          }}
        />

        <div className="space-y-8">
          {experiences.map((exp, index) => {
            const dot = dotColors[exp.accent];

            return (
              <motion.div
                key={exp.id}
                className="relative pl-12 md:pl-16"
                initial={reducedMotion ? {} : { opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  duration: 0.5,
                  delay: reducedMotion ? 0 : index * 0.15,
                }}
              >
                {/* Timeline dot */}
                <div
                  className={`absolute left-2.5 md:left-4.5 top-6 w-3 h-3 rounded-full ${dot.bg} ${dot.shadow} ring-2 ring-deep`}
                />

                <TimelineCard
                  experience={exp}
                  defaultExpanded={index === 0}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}
