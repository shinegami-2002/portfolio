'use client';

import { useState, useEffect, useCallback } from 'react';

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [sectionProgress, setSectionProgress] = useState<Record<string, number>>({});

  const updateProgress = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const normalizedProgress = docHeight > 0 ? scrollTop / docHeight : 0;
    setProgress(Math.min(1, Math.max(0, normalizedProgress)));

    const sections = document.querySelectorAll<HTMLElement>('[data-section]');
    const newSectionProgress: Record<string, number> = {};
    sections.forEach((section) => {
      const id = section.dataset.section || '';
      const rect = section.getBoundingClientRect();
      const sectionStart = rect.top + scrollTop;
      const sectionHeight = rect.height;
      const relativeScroll = scrollTop - sectionStart + window.innerHeight;
      const sectionNormalized = Math.min(1, Math.max(0, relativeScroll / (sectionHeight + window.innerHeight)));
      newSectionProgress[id] = sectionNormalized;
    });
    setSectionProgress(newSectionProgress);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
    return () => window.removeEventListener('scroll', updateProgress);
  }, [updateProgress]);

  return { progress, sectionProgress };
}
