'use client';

import { Stars } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { Points } from 'three';

export function Starfield() {
  const ref = useRef<Points>(null);
  const brightRef = useRef<Points>(null);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.01;
    }
    if (brightRef.current) {
      brightRef.current.rotation.y -= delta * 0.005;
    }
  });

  // Bright foreground stars geometry
  const brightStars = useMemo(() => {
    const positions = new Float32Array(200 * 3);
    const sizes = new Float32Array(200);
    for (let i = 0; i < 200; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 40 + Math.random() * 120;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      sizes[i] = 1.5 + Math.random() * 3;
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    return geom;
  }, []);

  return (
    <group>
      {/* Dense background stars */}
      <Stars
        ref={ref}
        radius={200}
        depth={100}
        count={4000}
        factor={6}
        saturation={0.1}
        fade
        speed={0.5}
      />
      {/* Bright foreground layer */}
      <points ref={brightRef} geometry={brightStars}>
        <pointsMaterial
          color="#ffffff"
          size={2.5}
          sizeAttenuation
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
