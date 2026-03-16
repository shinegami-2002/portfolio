'use client';

import { TechTag } from '@/components/ui/TechTag';
import { skills } from '@/data/skills';

const categoryLabels: Record<string, string> = {
  'ai-ml': 'AI / Machine Learning',
  'languages': 'Languages',
  'cloud': 'Cloud & DevOps',
  'web': 'Web & Frameworks',
  'databases': 'Databases',
  'libraries': 'Libraries & Tools',
};

const categoryVariants: Record<string, 'cyan' | 'magenta' | 'blue' | 'muted'> = {
  'ai-ml': 'cyan',
  'languages': 'magenta',
  'cloud': 'blue',
  'web': 'muted',
  'databases': 'cyan',
  'libraries': 'magenta',
};

export function SkillsGrid() {
  const grouped = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([category, categorySkills]) => (
        <div key={category}>
          <h3 className="font-heading text-sm font-medium text-text-muted mb-3">
            {categoryLabels[category] || category}
          </h3>
          <div className="flex flex-wrap gap-2">
            {categorySkills.map((skill) => (
              <TechTag
                key={skill.name}
                variant={categoryVariants[category] || 'muted'}
                size="md"
              >
                {skill.name}
              </TechTag>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
