'use client';
import { SectionWrapper } from '@/components/layout/SectionWrapper';
import { GlassCard } from '@/components/ui/GlassCard';
import { TechTag } from '@/components/ui/TechTag';
import { education } from '@/data/education';

export function Education() {
  return (
    <SectionWrapper id="education" title="Education" number={6}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {education.map((edu, i) => (
          <GlassCard key={i} glowColor="cyan">
            <h3 className="font-heading text-base font-medium text-text-primary">{edu.institution}</h3>
            <p className="text-sm text-cyan-accent mt-1">{edu.degree}</p>
            <p className="text-xs text-text-muted font-mono mt-1">GPA: {edu.gpa} | {edu.period}</p>
            {edu.coursework && edu.coursework.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {edu.coursework.map((course) => (
                  <TechTag key={course} variant="muted" size="sm">{course}</TechTag>
                ))}
              </div>
            )}
          </GlassCard>
        ))}
      </div>
    </SectionWrapper>
  );
}
