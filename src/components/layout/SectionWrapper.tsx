'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface SectionWrapperProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export function SectionWrapper({ id, children, className, title }: SectionWrapperProps) {
  const reducedMotion = useReducedMotion();

  return (
    <section
      id={id}
      data-section={id}
      className={cn('relative py-16 px-4 md:px-6', className)}
    >
      <div className="max-w-[1200px] mx-auto">
        {title && (
          <motion.h2
            className="font-heading text-4xl md:text-5xl font-semibold text-white mb-8 text-center"
            initial={reducedMotion ? {} : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            {title}
          </motion.h2>
        )}
        {children}
      </div>
    </section>
  );
}
