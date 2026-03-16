'use client';

import { Canvas } from '@react-three/fiber';
import { Preload, PerformanceMonitor } from '@react-three/drei';
import { Suspense, useState } from 'react';
import { Starfield } from './Starfield';
import { NebulaClouds } from './NebulaClouds';
import { FloatingGeometries } from './FloatingGeometries';
import { CameraController } from './CameraController';

export function Scene() {
  const [dpr, setDpr] = useState(1.5);

  return (
    <div className="fixed inset-0 -z-10" aria-hidden="true">
      <Canvas
        dpr={dpr}
        camera={{ position: [0, 0, 60], fov: 55 }}
        gl={{ antialias: true, alpha: true }}
      >
        <PerformanceMonitor
          onDecline={() => setDpr(1)}
          onIncline={() => setDpr(1.5)}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.3} />
            <directionalLight position={[5, 10, 7]} intensity={0.3} />
            <pointLight
              position={[20, 10, 30]}
              color="#00f2ff"
              intensity={0.5}
              distance={150}
            />
            <pointLight
              position={[-20, -5, -20]}
              color="#ff00c1"
              intensity={0.3}
              distance={150}
            />
            <CameraController />
            <Starfield />
            <NebulaClouds />
            <FloatingGeometries />
            <Preload all />
          </Suspense>
        </PerformanceMonitor>
      </Canvas>
    </div>
  );
}
