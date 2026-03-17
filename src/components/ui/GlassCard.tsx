'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'cyan' | 'blue' | 'gold' | 'none';
  hoverEffect?: boolean;
}

export function GlassCard({
  children,
  className,
  glowColor = 'none',
  hoverEffect = true,
  ...props
}: GlassCardProps) {
  const reducedMotion = useReducedMotion();
  const glowStyles = {
    cyan: 'hover:shadow-[0_0_30px_rgba(0,212,255,0.15)]',
    blue: 'hover:shadow-[0_0_30px_rgba(107,138,253,0.15)]',
    gold: 'hover:shadow-[0_0_30px_rgba(232,176,74,0.15)]',
    none: '',
  };

  return (
    <motion.div
      className={cn(
        'glass-card p-6',
        hoverEffect && 'transition-shadow duration-300',
        hoverEffect && glowStyles[glowColor],
        className
      )}
      initial={reducedMotion ? {} : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
