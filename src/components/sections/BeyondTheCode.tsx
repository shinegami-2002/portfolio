'use client';

import { motion } from 'framer-motion';
import { SectionWrapper } from '@/components/layout/SectionWrapper';
import { FlipCard } from '@/components/ui/FlipCard';
import { funFacts } from '@/data/personal';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function BeyondTheCode() {
  const reducedMotion = useReducedMotion();

  return (
    <SectionWrapper id="beyond" title="Beyond the Code" number={8}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {funFacts.map((fact, i) => (
          <motion.div
            key={fact.title}
            initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <FlipCard
              icon={fact.icon}
              title={fact.title}
              detail={fact.detail}
            />
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
