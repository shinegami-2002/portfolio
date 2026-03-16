'use client';

import dynamic from 'next/dynamic';
import { Component, type ReactNode } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const Scene = dynamic(() => import('./Scene').then((mod) => mod.Scene), {
  ssr: false,
  loading: () => null,
});

class R3FErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('R3F Error:', error);
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

function hasWebGL(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl') || canvas.getContext('webgl2'));
  } catch {
    return false;
  }
}

export function SceneContainer() {
  const reducedMotion = useReducedMotion();

  const cssBackground = (
    <div
      className="fixed inset-0 -z-10"
      style={{
        background: `radial-gradient(ellipse at 20% 20%, rgba(0,242,255,0.08) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 80%, rgba(255,0,193,0.06) 0%, transparent 50%),
          radial-gradient(ellipse at 50% 50%, rgba(77,136,255,0.05) 0%, transparent 60%),
          radial-gradient(ellipse at 50% 40%, rgba(0,0,0,0.6) 0%, transparent 40%),
          radial-gradient(ellipse at 30% 70%, rgba(140,0,255,0.04) 0%, transparent 45%),
          #050510`,
      }}
    />
  );

  if (reducedMotion || (typeof window !== 'undefined' && !hasWebGL())) {
    return cssBackground;
  }

  return (
    <>
      {cssBackground}
      <R3FErrorBoundary fallback={null}>
        <Scene />
      </R3FErrorBoundary>
    </>
  );
}
