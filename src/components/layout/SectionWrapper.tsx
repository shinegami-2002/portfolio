'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface SectionWrapperProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  title?: string;
  number?: number;
}

export function SectionWrapper({ id, children, className, title, number }: SectionWrapperProps) {
  const reducedMotion = useReducedMotion();

  return (
    <section
      id={id}
      data-section={id}
      className={cn('relative py-16 px-4 md:px-6', className)}
    >
      <div className="max-w-[1200px] mx-auto">
        {title && (
          <motion.div
            className="mb-6"
            initial={reducedMotion ? {} : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            {number && (
              <span className="block text-sm font-mono text-text-muted/40 mb-2">
                {number.toString().padStart(2, '0')} /
              </span>
            )}
            <h2 className="font-heading text-5xl md:text-6xl font-semibold text-white">
              {title}
            </h2>
          </motion.div>
        )}
        {children}
      </div>
    </section>
  );
}
