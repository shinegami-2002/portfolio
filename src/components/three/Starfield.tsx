'use client';

import { Stars } from '@react-three/drei';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Points } from 'three';

export function Starfield() {
  const ref = useRef<Points>(null);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.01;
    }
  });

  return (
    <Stars
      ref={ref}
      radius={200}
      depth={100}
      count={2000}
      factor={4}
      saturation={0}
      fade
      speed={0.5}
    />
  );
}
