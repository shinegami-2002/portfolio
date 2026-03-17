'use client';

import { motion } from 'framer-motion';
import { SectionWrapper } from '@/components/layout/SectionWrapper';
import { TimelineCard } from '@/components/ui/TimelineCard';
import { experiences } from '@/data/experience';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function Experience() {
  const reducedMotion = useReducedMotion();

  return (
    <SectionWrapper id="experience" title="Experience" number={2}>
      <div className="max-w-3xl mx-auto space-y-6">
        {experiences.map((exp, index) => (
          <motion.div
            key={exp.id}
            initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{
              duration: 0.5,
              delay: reducedMotion ? 0 : index * 0.1,
            }}
          >
            <TimelineCard
              experience={exp}
              defaultExpanded={index === 0}
              isFirst={index === 0}
            />
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
