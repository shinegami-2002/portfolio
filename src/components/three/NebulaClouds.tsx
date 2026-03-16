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

function createVortexTexture(size = 512): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Dark vortex with subtle colored rim
  const gradient = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2
  );
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0.8)');
  gradient.addColorStop(0.3, 'rgba(5, 5, 30, 0.4)');
  gradient.addColorStop(0.5, 'rgba(20, 0, 40, 0.2)');
  gradient.addColorStop(0.7, 'rgba(0, 50, 80, 0.1)');
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
  opacity: number;
}

const CLOUDS: CloudConfig[] = [
  {
    position: [-30, 12, -40],
    color: 'rgb(0, 242, 255)',
    scale: 55,
    speed: 0.15,
    phaseOffset: 0,
    opacity: 0.18,
  },
  {
    position: [35, -10, -50],
    color: 'rgb(255, 0, 193)',
    scale: 50,
    speed: 0.12,
    phaseOffset: 2.1,
    opacity: 0.15,
  },
  {
    position: [5, 18, -60],
    color: 'rgb(77, 136, 255)',
    scale: 60,
    speed: 0.1,
    phaseOffset: 4.2,
    opacity: 0.17,
  },
  {
    position: [-15, -20, -45],
    color: 'rgb(140, 0, 255)',
    scale: 45,
    speed: 0.08,
    phaseOffset: 1.5,
    opacity: 0.12,
  },
  {
    position: [25, 20, -55],
    color: 'rgb(0, 180, 200)',
    scale: 40,
    speed: 0.13,
    phaseOffset: 3.3,
    opacity: 0.14,
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
        opacity={config.opacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

function DarkVortex() {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useMemo(() => createVortexTexture(), []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.z = clock.getElapsedTime() * 0.02;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -70]}>
      <planeGeometry args={[80, 80]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

export function NebulaClouds() {
  return (
    <group>
      <DarkVortex />
      {CLOUDS.map((config, i) => (
        <NebulaCloud key={i} config={config} />
      ))}
    </group>
  );
}
