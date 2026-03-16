'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useEffect } from 'react';

export function CameraController() {
  const { camera, gl } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const domElement = gl.domElement;

    const handler = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };

    domElement.addEventListener('pointermove', handler);
    return () => {
      domElement.removeEventListener('pointermove', handler);
    };
  }, [gl]);

  useFrame(() => {
    const targetX = mouse.current.x * 3;
    const targetY = -mouse.current.y * 3;

    camera.position.x += (targetX - camera.position.x) * 0.02;
    camera.position.y += (targetY - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);
  });

  return null;
}
