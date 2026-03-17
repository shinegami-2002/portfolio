'use client';
import { SectionWrapper } from '@/components/layout/SectionWrapper';
import { GlassCard } from '@/components/ui/GlassCard';
import { publications } from '@/data/publications';

export function Publications() {
  return (
    <SectionWrapper id="publications" title="Publications" number={5}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {publications.map((pub, i) => (
          <GlassCard key={i} glowColor={pub.publisher === 'springer' ? 'cyan' : 'blue'}>
            <h3 className="font-heading text-lg font-medium text-text-primary mb-2">{pub.title}</h3>
            <p className="text-sm text-text-muted italic mb-2">{pub.authors}</p>
            <p className="text-sm text-text-primary/70">{pub.venue}, {pub.year}</p>
            <div className="flex items-center gap-3 mt-3">
              <span className={`text-xs font-mono px-2 py-0.5 rounded border ${
                pub.publisher === 'springer'
                  ? 'border-cyan-accent/30 text-cyan-accent'
                  : 'border-blue-accent/30 text-blue-accent'
              }`}>
                {pub.publisher === 'springer' ? 'Springer' : 'IEEE'}
              </span>
              <span className="text-xs text-green-400">{pub.status}</span>
            </div>
          </GlassCard>
        ))}
      </div>
    </SectionWrapper>
  );
}
