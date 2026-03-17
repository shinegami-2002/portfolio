'use client';

import { motion } from 'framer-motion';
import { SectionWrapper } from '@/components/layout/SectionWrapper';
import { GlassCard } from '@/components/ui/GlassCard';
import { leadership, achievements } from '@/data/leadership';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function LeadershipAchievements() {
  const reducedMotion = useReducedMotion();

  return (
    <SectionWrapper id="leadership" title="Leadership & Achievements" number={7}>
      {/* Leadership cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {leadership.map((entry, i) => (
          <GlassCard key={i} glowColor="cyan">
            <h3 className="font-heading text-sm font-medium text-white">
              {entry.title}
            </h3>
            <p className="text-xs text-gold-accent mt-1">
              {entry.organization}
            </p>
            <p className="text-xs text-text-muted font-mono mt-1">
              {entry.period}
            </p>
            <p className="text-sm text-text-primary/70 mt-2">
              {entry.description}
            </p>
          </GlassCard>
        ))}
      </div>

      {/* Achievement badges */}
      <div>
        <h3 className="font-heading text-lg font-medium text-white mb-4 text-center">
          Achievements
        </h3>
        <div className="flex flex-wrap justify-center gap-3">
          {achievements.map((achievement, i) => (
            <motion.div
              key={i}
              className="glass-card px-4 py-2 border border-gold-accent/20 rounded-full cursor-default transition-all duration-200 hover:scale-105 hover:border-gold-accent/40 hover:brightness-125"
              initial={reducedMotion ? {} : { opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <span className="text-sm text-text-primary">
                {achievement.title}
              </span>
              <span className="text-xs text-text-muted ml-2 font-mono">
                ({achievement.year})
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
