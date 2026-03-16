'use client';

import { useRef, useState, useMemo, useCallback } from 'react';
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Sparkles, Html, Line } from '@react-three/drei';
import { skills } from '@/data/skills';
import { SkillNode } from '@/types';
import * as THREE from 'three';

/* ─── colour map ─── */
const CATEGORY_COLORS: Record<string, string> = {
  'ai-ml': '#00f2ff',
  'languages': '#ff00c1',
  'cloud': '#4d88ff',
  'web': '#e0e6f0',
  'databases': '#40ffaa',
  'libraries': '#c060ff',
};

/* ─── helpers ─── */
function getColor(category: string): string {
  return CATEGORY_COLORS[category] ?? '#e0e6f0';
}

/** Build a name-to-skill lookup once */
function buildSkillMap(data: SkillNode[]): Map<string, SkillNode> {
  const map = new Map<string, SkillNode>();
  for (const s of data) map.set(s.name, s);
  return map;
}

/* ─── single skill sphere ─── */
interface SkillSphereProps {
  skill: SkillNode;
  hovered: string | null;
  connectedNames: Set<string>;
  onHover: (name: string | null) => void;
  onClick: (name: string) => void;
}

function SkillSphere({ skill, hovered, connectedNames, onHover, onClick }: SkillSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const color = getColor(skill.category);
  const radius = 0.2 + skill.proficiency * 0.08;

  const isHovered = hovered === skill.name;
  const isConnected = hovered !== null && connectedNames.has(skill.name);
  const isDimmed = hovered !== null && !isHovered && !isConnected;

  const targetScale = isHovered ? 1.3 : 1;
  const targetEmissive = isHovered ? 0.8 : 0.3;
  const targetOpacity = isDimmed ? 0.15 : 0.8;

  // Smooth animate with useFrame
  useFrame(() => {
    if (!meshRef.current) return;
    const s = meshRef.current.scale.x;
    const next = THREE.MathUtils.lerp(s, targetScale, 0.1);
    meshRef.current.scale.setScalar(next);

    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    if (mat) {
      mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, targetEmissive, 0.1);
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, 0.1);
    }
  });

  const handlePointerOver = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    onHover(skill.name);
    document.body.style.cursor = 'pointer';
  }, [onHover, skill.name]);

  const handlePointerOut = useCallback(() => {
    onHover(null);
    document.body.style.cursor = 'auto';
  }, [onHover]);

  const handleClick = useCallback((e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onClick(skill.name);
  }, [onClick, skill.name]);

  return (
    <mesh
      ref={meshRef}
      position={[skill.position.x, skill.position.y, skill.position.z]}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      <sphereGeometry args={[radius, 24, 24]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.3}
        transparent
        opacity={0.8}
      />
      {isHovered && (
        <Html
          center
          distanceFactor={20}
          style={{ pointerEvents: 'none' }}
        >
          <div className="whitespace-nowrap rounded-md bg-deep/90 border border-white/10 px-2.5 py-1 text-xs font-mono text-white shadow-lg backdrop-blur-sm">
            {skill.name}
          </div>
        </Html>
      )}
    </mesh>
  );
}

/* ─── connection lines ─── */
interface ConnectionLinesProps {
  skillMap: Map<string, SkillNode>;
  hovered: string | null;
  connectedNames: Set<string>;
}

function ConnectionLines({ skillMap, hovered, connectedNames }: ConnectionLinesProps) {
  const lines = useMemo(() => {
    const seen = new Set<string>();
    const result: { from: SkillNode; to: SkillNode; color: string }[] = [];

    for (const skill of skills) {
      for (const connName of skill.connections) {
        const target = skillMap.get(connName);
        if (!target) continue;

        const key = [skill.name, connName].sort().join('::');
        if (seen.has(key)) continue;
        seen.add(key);

        result.push({ from: skill, to: target, color: getColor(skill.category) });
      }
    }
    return result;
  }, [skillMap]);

  return (
    <>
      {lines.map(({ from, to, color }) => {
        const isHighlighted =
          hovered !== null &&
          (from.name === hovered || to.name === hovered) &&
          connectedNames.has(from.name) &&
          connectedNames.has(to.name);
        const isDimmed = hovered !== null && !isHighlighted;

        return (
          <Line
            key={`${from.name}::${to.name}`}
            points={[
              [from.position.x, from.position.y, from.position.z],
              [to.position.x, to.position.y, to.position.z],
            ]}
            color={color}
            lineWidth={isHighlighted ? 1.5 : 0.5}
            transparent
            opacity={isDimmed ? 0.04 : isHighlighted ? 0.5 : 0.12}
          />
        );
      })}
    </>
  );
}

/* ─── inner scene (rendered inside Canvas) ─── */
interface InnerSceneProps {
  onSkillClick: (name: string) => void;
}

function InnerScene({ onSkillClick }: InnerSceneProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  const skillMap = useMemo(() => buildSkillMap(skills), []);

  // Compute the set of names that should stay bright when something is hovered
  const connectedNames = useMemo<Set<string>>(() => {
    if (!hovered) return new Set();
    const hoveredSkill = skillMap.get(hovered);
    if (!hoveredSkill) return new Set();
    const names = new Set<string>(hoveredSkill.connections);
    names.add(hovered);
    return names;
  }, [hovered, skillMap]);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[20, 20, 20]} color="#00f2ff" intensity={0.6} distance={100} />
      <pointLight position={[-20, -20, -10]} color="#ff00c1" intensity={0.3} distance={100} />

      {/* Ambient particles */}
      <Sparkles
        count={30}
        size={1.5}
        scale={35}
        speed={0.3}
        opacity={0.2}
        color="#ffffff"
      />

      {/* Connection lines */}
      <ConnectionLines
        skillMap={skillMap}
        hovered={hovered}
        connectedNames={connectedNames}
      />

      {/* Skill spheres */}
      {skills.map((skill) => (
        <SkillSphere
          key={skill.name}
          skill={skill}
          hovered={hovered}
          connectedNames={connectedNames}
          onHover={setHovered}
          onClick={onSkillClick}
        />
      ))}

      {/* Orbit controls */}
      <OrbitControls
        enableZoom={false}
        autoRotate
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI * 0.7}
        minPolarAngle={Math.PI * 0.3}
      />
    </>
  );
}

/* ─── exported component ─── */
interface ConstellationSceneProps {
  onSkillClick: (name: string) => void;
}

export function ConstellationScene({ onSkillClick }: ConstellationSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 35], fov: 55 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <InnerScene onSkillClick={onSkillClick} />
    </Canvas>
  );
}

export default ConstellationScene;
