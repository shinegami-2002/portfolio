import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        'deep': '#0a0a0f',
        'card': '#111116',
        'elevated': '#1a1a22',
        'cyan-accent': '#00d4ff',
        'blue-accent': '#6b8afd',
        'gold-accent': '#e8b04a',
        'text-primary': '#f0ece2',
        'text-muted': '#9ca3af',
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      animation: {
        'shimmer': 'shimmer 8s infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'scan-line': 'scan-line 4s linear infinite',
        'drift': 'drift 25s ease-in-out infinite',
        'drift-reverse': 'drift 30s ease-in-out infinite reverse',
        'drift-slow': 'drift 20s ease-in-out infinite 2s',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        'scan-line': {
          '0%': { top: '-2px' },
          '100%': { top: '100%' },
        },
        drift: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -20px) scale(1.05)' },
          '66%': { transform: 'translate(-20px, 15px) scale(0.95)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
