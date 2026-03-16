'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';

interface FlipCardProps {
  icon: string;
  title: string;
  detail: string;
}

export function FlipCard({ icon, title, detail }: FlipCardProps) {
  const [flipped, setFlipped] = useState(false);

  const icons = LucideIcons as unknown as Record<
    string,
    React.ComponentType<{ className?: string }>
  >;
  const IconComponent = icons[icon] || LucideIcons.Star;

  return (
    <div
      className="perspective-[800px] h-48 cursor-pointer"
      onClick={() => setFlipped(!flipped)}
    >
      <div
        className={cn(
          'relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d]',
          flipped && '[transform:rotateY(180deg)]'
        )}
      >
        {/* Front */}
        <div className="absolute inset-0 glass-card flex flex-col items-center justify-center gap-3 [backface-visibility:hidden] hover:shadow-[0_0_20px_rgba(0,242,255,0.1)] transition-shadow">
          <IconComponent className="w-8 h-8 text-cyan-accent" />
          <h3 className="font-heading text-sm font-medium text-white">
            {title}
          </h3>
          <p className="text-xs text-text-muted">Click to flip</p>
        </div>

        {/* Back */}
        <div className="absolute inset-0 glass-card flex items-center justify-center p-4 [backface-visibility:hidden] [transform:rotateY(180deg)] border-cyan-accent/20">
          <p className="text-sm text-text-primary/80 text-center">{detail}</p>
        </div>
      </div>
    </div>
  );
}
