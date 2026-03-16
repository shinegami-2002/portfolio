'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { SectionWrapper } from '@/components/layout/SectionWrapper';
import { SkillsGrid } from './SkillsGrid';
import { useMobile } from '@/hooks/useMobile';
import { skills } from '@/data/skills';
import { projects } from '@/data/projects';
import { experiences } from '@/data/experience';

const ConstellationScene = dynamic(
  () => import('@/components/three/ConstellationScene').then((m) => m.ConstellationScene),
  { ssr: false },
);

export function SkillsConstellation() {
  const isMobile = useMobile();
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  // Find projects and experience that use the selected skill
  const relatedProjects = selectedSkill
    ? projects.filter((p) =>
        p.tags.some((t) => t.toLowerCase().includes(selectedSkill.toLowerCase())),
      )
    : [];
  const relatedExperience = selectedSkill
    ? experiences.filter((e) =>
        e.tags.some((t) => t.toLowerCase().includes(selectedSkill.toLowerCase())),
      )
    : [];

  return (
    <SectionWrapper id="skills" title="Skills">
      <div className="relative">
        {isMobile ? (
          <SkillsGrid />
        ) : (
          <div className="h-[500px] w-full rounded-xl overflow-hidden glass-card">
            <ConstellationScene onSkillClick={setSelectedSkill} />
          </div>
        )}

        {/* Detail panel */}
        <AnimatePresence>
          {selectedSkill && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute top-0 right-0 w-72 glass-card p-4 z-10"
            >
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-heading text-sm font-medium text-cyan-accent">
                  {selectedSkill}
                </h4>
                <button
                  onClick={() => setSelectedSkill(null)}
                  className="text-text-muted hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {relatedProjects.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-text-muted mb-1">Projects:</p>
                  {relatedProjects.map((p) => (
                    <p key={p.id} className="text-sm text-text-primary">
                      {p.title}
                    </p>
                  ))}
                </div>
              )}
              {relatedExperience.length > 0 && (
                <div>
                  <p className="text-xs text-text-muted mb-1">Experience:</p>
                  {relatedExperience.map((e) => (
                    <p key={e.id} className="text-sm text-text-primary">
                      {e.company}
                    </p>
                  ))}
                </div>
              )}
              {relatedProjects.length === 0 && relatedExperience.length === 0 && (
                <p className="text-xs text-text-muted">
                  Proficiency: {skills.find((s) => s.name === selectedSkill)?.proficiency ?? '?'}/5
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SectionWrapper>
  );
}
