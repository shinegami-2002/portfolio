import { cn } from '@/lib/utils';

interface TechTagProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'blue' | 'gold' | 'muted';
  size?: 'sm' | 'md';
}

const variantStyles = {
  cyan: 'border-cyan-accent/20 text-cyan-accent',
  blue: 'border-blue-accent/20 text-blue-accent',
  gold: 'border-gold-accent/20 text-gold-accent',
  muted: 'border-gray-300 dark:border-white/15 text-text-muted',
};

export function TechTag({ children, variant = 'cyan', size = 'sm' }: TechTagProps) {
  return (
    <span
      className={cn(
        'inline-block font-mono rounded-full border',
        size === 'sm' ? 'text-[11px] px-2.5 py-0.5' : 'text-xs px-3 py-1',
        variantStyles[variant]
      )}
    >
      {children}
    </span>
  );
}
