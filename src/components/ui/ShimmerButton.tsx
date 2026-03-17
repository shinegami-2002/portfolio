import { cn } from '@/lib/utils';

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  href?: string;
}

export function ShimmerButton({ children, variant = 'primary', href, className, ...props }: ShimmerButtonProps) {
  const baseStyles = 'relative inline-flex items-center justify-center gap-2 px-6 py-3 font-heading text-sm font-medium rounded-lg transition-all duration-300 cursor-pointer';
  const variants = {
    primary: 'border border-cyan-accent/40 text-cyan-accent hover:bg-cyan-accent/10 hover:shadow-[0_0_20px_rgba(0,212,255,0.15)]',
    secondary: 'border border-white/10 text-text-muted hover:text-text-primary hover:border-white/20',
  };

  const content = (
    <button className={cn(baseStyles, variants[variant], className)} {...props}>
      {children}
    </button>
  );

  if (href) {
    return (
      <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}>
        {content}
      </a>
    );
  }

  return content;
}
