'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

interface GeometryConfig {
  type: 'icosahedron' | 'octahedron' | 'dodecahedron' | 'torusKnot';
  position: [number, number, number];
  orbitRadius: number;
  orbitSpeed: number;
  rotationSpeed: number;
  scale: number;
  color: string;
  opacity: number;
  floatIntensity: number;
}

const GEOMETRIES: GeometryConfig[] = [
  {
    type: 'icosahedron',
    position: [20, 12, -15],
    orbitRadius: 2,
    orbitSpeed: 0.3,
    rotationSpeed: 0.4,
    scale: 2.5,
    color: '#00f2ff',
    opacity: 0.2,
    floatIntensity: 1.5,
  },
  {
    type: 'octahedron',
    position: [-18, -10, -20],
    orbitRadius: 3,
    orbitSpeed: 0.25,
    rotationSpeed: 0.3,
    scale: 2,
    color: '#ff00c1',
    opacity: 0.18,
    floatIntensity: 2,
  },
  {
    type: 'dodecahedron',
    position: [15, -15, -25],
    orbitRadius: 2.5,
    orbitSpeed: 0.2,
    rotationSpeed: 0.25,
    scale: 1.8,
    color: '#4d88ff',
    opacity: 0.15,
    floatIntensity: 1.2,
  },
  {
    type: 'torusKnot',
    position: [-22, 8, -30],
    orbitRadius: 1.5,
    orbitSpeed: 0.35,
    rotationSpeed: 0.5,
    scale: 1.5,
    color: '#00f2ff',
    opacity: 0.25,
    floatIntensity: 1.8,
  },
  {
    type: 'icosahedron',
    position: [0, 20, -35],
    orbitRadius: 3,
    orbitSpeed: 0.15,
    rotationSpeed: 0.2,
    scale: 3,
    color: '#ff00c1',
    opacity: 0.12,
    floatIntensity: 1,
  },
];

function GeometryMesh({ config }: { config: GeometryConfig }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();

    meshRef.current.rotation.x += config.rotationSpeed * 0.005;
    meshRef.current.rotation.z += config.rotationSpeed * 0.003;

    meshRef.current.position.x =
      config.position[0] + Math.sin(t * config.orbitSpeed) * config.orbitRadius;
    meshRef.current.position.y =
      config.position[1] +
      Math.cos(t * config.orbitSpeed * 0.7) * config.orbitRadius;
  });

  const renderGeometry = () => {
    switch (config.type) {
      case 'icosahedron':
        return <icosahedronGeometry args={[1, 0]} />;
      case 'octahedron':
        return <octahedronGeometry args={[1, 0]} />;
      case 'dodecahedron':
        return <dodecahedronGeometry args={[1, 0]} />;
      case 'torusKnot':
        return <torusKnotGeometry args={[0.8, 0.3, 64, 8]} />;
    }
  };

  return (
    <Float
      speed={1.5}
      rotationIntensity={0.3}
      floatIntensity={config.floatIntensity}
    >
      <mesh ref={meshRef} position={config.position} scale={config.scale}>
        {renderGeometry()}
        <meshStandardMaterial
          color={config.color}
          emissive={config.color}
          emissiveIntensity={0.3}
          wireframe
          transparent
          opacity={config.opacity}
        />
      </mesh>
    </Float>
  );
}

export function FloatingGeometries() {
  return (
    <group>
      {GEOMETRIES.map((config, i) => (
        <GeometryMesh key={i} config={config} />
      ))}
    </group>
  );
}
