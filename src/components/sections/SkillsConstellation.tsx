'use client';

import { motion } from 'framer-motion';
import { SectionWrapper } from '@/components/layout/SectionWrapper';
import { skills } from '@/data/skills';
import {
  Brain,
  Code,
  Cloud,
  Globe,
  Database,
  Library,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryConfig {
  label: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  direction: 'left' | 'right';
  speed: number;
}

const categoryConfig: Record<string, CategoryConfig> = {
  'ai-ml': {
    label: 'AI / Machine Learning',
    icon: Brain,
    color: 'text-cyan-accent',
    bgColor: 'bg-cyan-accent/10 border-cyan-accent/20',
    direction: 'left',
    speed: 22,
  },
  languages: {
    label: 'Languages',
    icon: Code,
    color: 'text-magenta-accent',
    bgColor: 'bg-magenta-accent/10 border-magenta-accent/20',
    direction: 'right',
    speed: 26,
  },
  cloud: {
    label: 'Cloud & DevOps',
    icon: Cloud,
    color: 'text-blue-accent',
    bgColor: 'bg-blue-accent/10 border-blue-accent/20',
    direction: 'left',
    speed: 20,
  },
  web: {
    label: 'Web & Frameworks',
    icon: Globe,
    color: 'text-text-primary',
    bgColor: 'bg-white/5 border-white/10',
    direction: 'right',
    speed: 24,
  },
  databases: {
    label: 'Databases',
    icon: Database,
    color: 'text-cyan-accent',
    bgColor: 'bg-cyan-accent/10 border-cyan-accent/20',
    direction: 'left',
    speed: 28,
  },
  libraries: {
    label: 'Libraries & Tools',
    icon: Library,
    color: 'text-blue-accent',
    bgColor: 'bg-blue-accent/10 border-blue-accent/20',
    direction: 'right',
    speed: 18,
  },
};

const categoryOrder = [
  'ai-ml',
  'languages',
  'cloud',
  'web',
  'databases',
  'libraries',
] as const;

function MarqueeRow({
  skillList,
  config,
}: {
  skillList: typeof skills;
  config: CategoryConfig;
}) {
  const Icon = config.icon;
  // Duplicate the list for seamless loop
  const doubled = [...skillList, ...skillList];

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3 px-4">
        <Icon className={cn('w-4 h-4', config.color)} />
        <span className={cn('text-sm font-heading font-medium', config.color)}>
          {config.label}
        </span>
      </div>
      <div className="overflow-hidden relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#050510] to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#050510] to-transparent z-10" />

        <motion.div
          className="flex gap-3 w-max"
          animate={{
            x:
              config.direction === 'left'
                ? ['0%', '-50%']
                : ['-50%', '0%'],
          }}
          transition={{
            duration: config.speed,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {doubled.map((skill, i) => (
            <span
              key={`${skill.name}-${i}`}
              className={cn(
                'inline-flex items-center px-4 py-2 rounded-full border text-sm font-mono whitespace-nowrap transition-all hover:scale-105',
                config.bgColor,
              )}
            >
              {skill.name}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export function SkillsConstellation() {
  const grouped = skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
    },
    {} as Record<string, typeof skills>,
  );

  return (
    <SectionWrapper id="skills" title="Skills">
      <div className="space-y-2">
        {categoryOrder.map((category) => {
          const config = categoryConfig[category];
          const categorySkills = grouped[category];
          if (!config || !categorySkills) return null;
          return (
            <MarqueeRow
              key={category}
              skillList={categorySkills}
              config={config}
            />
          );
        })}
      </div>
    </SectionWrapper>
  );
}
