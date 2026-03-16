'use client';

import { SectionWrapper } from '@/components/layout/SectionWrapper';
import { FeatureCarousel } from '@/components/ui/feature-carousel';

export function Projects() {
  return (
    <SectionWrapper id="projects" title="Projects">
      <FeatureCarousel />
    </SectionWrapper>
  );
}
