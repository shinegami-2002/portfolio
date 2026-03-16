'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function createRadialGradientTexture(
  color: string,
  size = 256
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const gradient = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2
  );
  gradient.addColorStop(0, color);
  gradient.addColorStop(0.4, color.replace(')', ', 0.3)').replace('rgb', 'rgba'));
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

interface CloudConfig {
  position: [number, number, number];
  color: string;
  scale: number;
  speed: number;
  phaseOffset: number;
}

const CLOUDS: CloudConfig[] = [
  {
    position: [-25, 10, -40],
    color: 'rgb(0, 242, 255)',
    scale: 40,
    speed: 0.15,
    phaseOffset: 0,
  },
  {
    position: [30, -8, -50],
    color: 'rgb(255, 0, 193)',
    scale: 35,
    speed: 0.12,
    phaseOffset: 2.1,
  },
  {
    position: [5, 15, -60],
    color: 'rgb(77, 136, 255)',
    scale: 45,
    speed: 0.1,
    phaseOffset: 4.2,
  },
];

function NebulaCloud({ config }: { config: CloudConfig }) {
  const meshRef = useRef<THREE.Mesh>(null);

  const texture = useMemo(
    () => createRadialGradientTexture(config.color),
    [config.color]
  );

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime() * config.speed + config.phaseOffset;
    meshRef.current.position.x = config.position[0] + Math.sin(t) * 3;
    meshRef.current.position.y = config.position[1] + Math.cos(t * 0.7) * 2;
  });

  return (
    <mesh ref={meshRef} position={config.position}>
      <planeGeometry args={[config.scale, config.scale]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={0.08}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

export function NebulaClouds() {
  return (
    <group>
      {CLOUDS.map((config, i) => (
        <NebulaCloud key={i} config={config} />
      ))}
    </group>
  );
}
