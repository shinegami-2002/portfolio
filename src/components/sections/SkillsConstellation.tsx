'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  Code,
  Cloud,
  Globe,
  Database,
  Library,
  type LucideIcon,
} from 'lucide-react';
import { SectionWrapper } from '@/components/layout/SectionWrapper';
import { skills } from '@/data/skills';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils';

/* ── Category metadata ── */

interface CategoryMeta {
  label: string;
  icon: LucideIcon;
  color: string;        // Tailwind text color
  borderColor: string;  // Tailwind border color (for the card accent)
  glowColor: string;    // CSS box-shadow color for hover glow
  pillBg: string;       // Tailwind bg for idle pill
  pillHoverBg: string;  // Tailwind bg for hovered pill
  dotColor: string;     // Tailwind bg for proficiency dots (filled)
}

const categoryMeta: Record<string, CategoryMeta> = {
  'ai-ml': {
    label: 'AI / Machine Learning',
    icon: Brain,
    color: 'text-cyan-accent',
    borderColor: 'border-cyan-accent/30',
    glowColor: 'rgba(0, 242, 255, 0.35)',
    pillBg: 'bg-cyan-accent/[0.08]',
    pillHoverBg: 'hover:bg-cyan-accent/[0.18]',
    dotColor: 'bg-cyan-accent',
  },
  languages: {
    label: 'Languages',
    icon: Code,
    color: 'text-magenta-accent',
    borderColor: 'border-magenta-accent/30',
    glowColor: 'rgba(255, 0, 193, 0.35)',
    pillBg: 'bg-magenta-accent/[0.08]',
    pillHoverBg: 'hover:bg-magenta-accent/[0.18]',
    dotColor: 'bg-magenta-accent',
  },
  cloud: {
    label: 'Cloud & DevOps',
    icon: Cloud,
    color: 'text-blue-accent',
    borderColor: 'border-blue-accent/30',
    glowColor: 'rgba(77, 136, 255, 0.35)',
    pillBg: 'bg-blue-accent/[0.08]',
    pillHoverBg: 'hover:bg-blue-accent/[0.18]',
    dotColor: 'bg-blue-accent',
  },
  web: {
    label: 'Web & Frameworks',
    icon: Globe,
    color: 'text-text-muted',
    borderColor: 'border-white/15',
    glowColor: 'rgba(224, 230, 240, 0.2)',
    pillBg: 'bg-white/[0.06]',
    pillHoverBg: 'hover:bg-white/[0.14]',
    dotColor: 'bg-text-muted',
  },
  databases: {
    label: 'Databases',
    icon: Database,
    color: 'text-emerald-400',
    borderColor: 'border-emerald-400/30',
    glowColor: 'rgba(52, 211, 153, 0.35)',
    pillBg: 'bg-emerald-400/[0.08]',
    pillHoverBg: 'hover:bg-emerald-400/[0.18]',
    dotColor: 'bg-emerald-400',
  },
  libraries: {
    label: 'Libraries & Tools',
    icon: Library,
    color: 'text-purple-400',
    borderColor: 'border-purple-400/30',
    glowColor: 'rgba(192, 132, 252, 0.35)',
    pillBg: 'bg-purple-400/[0.08]',
    pillHoverBg: 'hover:bg-purple-400/[0.18]',
    dotColor: 'bg-purple-400',
  },
};

const categoryOrder = ['ai-ml', 'languages', 'cloud', 'web', 'databases', 'libraries'] as const;

/* ── Proficiency tooltip ── */

function ProficiencyDots({
  level,
  dotColor,
}: {
  level: number;
  dotColor: string;
}) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={cn(
            'w-1.5 h-1.5 rounded-full transition-colors',
            i < level ? dotColor : 'bg-white/15',
          )}
        />
      ))}
    </div>
  );
}

/* ── Skill pill ── */

function SkillPill({
  name,
  proficiency,
  meta,
  index,
  reducedMotion,
}: {
  name: string;
  proficiency: number;
  meta: CategoryMeta;
  index: number;
  reducedMotion: boolean;
}) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <motion.div
      className="relative"
      initial={reducedMotion ? {} : { opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
    >
      <button
        type="button"
        className={cn(
          'relative font-mono text-xs px-3.5 py-1.5 rounded-full border transition-all duration-300 cursor-pointer',
          'border-white/[0.08]',
          meta.pillBg,
          meta.pillHoverBg,
          meta.color,
        )}
        style={{
          // Glow on hover via inline style (Tailwind can't do arbitrary box-shadow on hover easily)
        }}
        onMouseEnter={(e) => {
          setShowTooltip(true);
          (e.currentTarget as HTMLElement).style.boxShadow = `0 0 16px ${meta.glowColor}`;
          (e.currentTarget as HTMLElement).style.borderColor = meta.glowColor;
        }}
        onMouseLeave={(e) => {
          setShowTooltip(false);
          (e.currentTarget as HTMLElement).style.boxShadow = 'none';
          (e.currentTarget as HTMLElement).style.borderColor = '';
        }}
        onClick={() => setShowTooltip((prev) => !prev)}
      >
        {name}
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-20
                     bg-elevated border border-white/10 rounded-lg px-3 py-2
                     flex flex-col items-center gap-1 shadow-lg pointer-events-none"
        >
          <span className="text-[11px] text-text-muted whitespace-nowrap">
            Proficiency
          </span>
          <ProficiencyDots level={proficiency} dotColor={meta.dotColor} />
          {/* tiny triangle */}
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-elevated border-b border-r border-white/10 rotate-45" />
        </motion.div>
      )}
    </motion.div>
  );
}

/* ── Category card ── */

function CategoryCard({
  category,
  categoryIndex,
  reducedMotion,
}: {
  category: string;
  categoryIndex: number;
  reducedMotion: boolean;
}) {
  const meta = categoryMeta[category];
  if (!meta) return null;

  const Icon = meta.icon;
  const categorySkills = skills.filter((s) => s.category === category);

  return (
    <motion.div
      className={cn(
        'glass-card p-5 md:p-6',
        'border-t-2',
        meta.borderColor,
      )}
      initial={reducedMotion ? {} : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-4">
        <Icon className={cn('w-5 h-5', meta.color)} strokeWidth={1.5} />
        <h3 className={cn('font-heading text-sm font-semibold tracking-wide uppercase', meta.color)}>
          {meta.label}
        </h3>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-2.5">
        {categorySkills.map((skill, i) => (
          <SkillPill
            key={skill.name}
            name={skill.name}
            proficiency={skill.proficiency}
            meta={meta}
            index={i}
            reducedMotion={reducedMotion}
          />
        ))}
      </div>
    </motion.div>
  );
}

/* ── Main section ── */

export function SkillsConstellation() {
  const reducedMotion = useReducedMotion();

  return (
    <SectionWrapper id="skills" title="Skills">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {categoryOrder.map((category, idx) => (
          <CategoryCard
            key={category}
            category={category}
            categoryIndex={idx}
            reducedMotion={reducedMotion}
          />
        ))}
      </div>
    </SectionWrapper>
  );
}
