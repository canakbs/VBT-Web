'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useLenis } from 'lenis/react';
import * as THREE from 'three';

// Interface for each neural point node
interface NodeItem {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  seed: number;
}

// Pure deterministic pseudo-random number generator based on a seed.
// React Compiler rules forbid impure functions (like Math.random) during render.
function pureRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Generate static properties for a node purely based on its index.
function getDeterministicNode(index: number): NodeItem {
  const r1 = pureRandom(index * 123.456 + 1.1);
  const r2 = pureRandom(index * 234.567 + 2.2);
  const r3 = pureRandom(index * 345.678 + 3.3);
  const r4 = pureRandom(index * 456.789 + 4.4);
  const r5 = pureRandom(index * 567.890 + 5.5);
  const r6 = pureRandom(index * 678.901 + 6.6);
  const r7 = pureRandom(index * 789.012 + 7.7);

  // Distribute nodes evenly around the camera view box
  const x = (r1 - 0.5) * 36;
  const y = (r2 - 0.5) * 26;
  const z = (r3 - 0.5) * 45;

  // Elegant slow drift velocity
  const vx = (r4 - 0.5) * 0.005;
  const vy = (r5 - 0.5) * 0.005;
  const vz = (r6 - 0.5) * 0.003;

  const seed = r7 * 1000;

  return { x, y, z, vx, vy, vz, seed };
}

// Subcomponent inside the R3F Canvas that handles updating point coordinates,
// lines calculation, and camera movement.
function NeuralNetwork({
  nodeCount,
  reducedMotion,
}: {
  nodeCount: number;
  reducedMotion: boolean;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const linesGeomRef = useRef<THREE.BufferGeometry>(null);

  // Scroll tracking from Lenis + native scroll fallback
  const scrollProgress = useRef(0);
  useLenis((lenis) => {
    scrollProgress.current = Math.min(Math.max(lenis.progress, 0), 1);
  });

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0) {
        const p = window.scrollY / maxScroll;
        scrollProgress.current = Math.min(Math.max(p, 0), 1);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mouse tracking for tilt parallax
  const mouse = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalise cursor to [-1, 1]
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Generate initial node positions, velocities, and drift seeds using the pure generator
  const nodes = useMemo(() => {
    const list: NodeItem[] = [];
    for (let i = 0; i < nodeCount; i++) {
      list.push(getDeterministicNode(i));
    }
    return list;
  }, [nodeCount]);

  // Keep a mutable ref of node coordinates to animate positions in useFrame loop
  // without triggering react re-renders.
  const nodesRef = useRef<NodeItem[]>([]);
  useEffect(() => {
    nodesRef.current = nodes.map((n) => ({ ...n }));
  }, [nodes]);

  // Color each instance node (Cyan, Blue, or White) to add depth variety
  useEffect(() => {
    if (!meshRef.current) return;
    const color = new THREE.Color();
    for (let i = 0; i < nodeCount; i++) {
      const r = pureRandom(i * 987.654 + 9.9);
      if (r < 0.70) {
        color.set('#00f2fe'); // Brand Cyan
      } else if (r < 0.85) {
        color.set('#ffffff'); // White accent
      } else {
        color.set('#3b82f6'); // Brand Blue
      }
      meshRef.current.setColorAt(i, color);
    }
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [nodeCount]);

  // Pre-allocated line buffers for maximum performance (800 connections)
  const MAX_CONNECTIONS = 800;
  const positions = useMemo(() => new Float32Array(MAX_CONNECTIONS * 2 * 3), []);
  const colors = useMemo(() => new Float32Array(MAX_CONNECTIONS * 2 * 3), []);

  const posArray = useRef(positions);
  const colArray = useRef(colors);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();
    const speedMultiplier = reducedMotion ? 0.05 : 1.0;

    // 1. Move Node Particles
    const tempObj = new THREE.Object3D();
    const count = nodesRef.current.length;

    for (let i = 0; i < count; i++) {
      const node = nodesRef.current[i];

      // Smooth wave drift + velocity
      const driftX = Math.sin(time * 0.15 + node.seed) * 0.003;
      const driftY = Math.cos(time * 0.2 + node.seed) * 0.003;
      const driftZ = Math.sin(time * 0.1 + node.seed) * 0.002;

      node.x += (node.vx + driftX) * speedMultiplier;
      node.y += (node.vy + driftY) * speedMultiplier;
      node.z += (node.vz + driftZ) * speedMultiplier;

      // Keep them enclosed in the view box (bounce velocities on X, relative wrap on Y and Z)
      const boundX = 20;

      if (node.x < -boundX || node.x > boundX) {
        node.vx = -node.vx;
        node.x = Math.max(-boundX, Math.min(boundX, node.x));
      }

      // Dynamically wrap Y and Z relative to camera position so particles never leave camera view at bottom of page
      const camY = state.camera.position.y;
      const camZ = state.camera.position.z;

      if (node.y > camY + 14) {
        node.y -= 28;
      } else if (node.y < camY - 14) {
        node.y += 28;
      }

      if (node.z > camZ + 8) {
        node.z -= 45;
      } else if (node.z < camZ - 38) {
        node.z += 45;
      }

      // Position instanced node
      tempObj.position.set(node.x, node.y, node.z);

      // Micro scaling animation (nodes look like they are breathing/pulsating)
      const pulseScale = 1.0 + Math.sin(time * 1.5 + node.seed) * 0.15;
      tempObj.scale.setScalar(pulseScale * 0.95);

      tempObj.updateMatrix();
      meshRef.current.setMatrixAt(i, tempObj.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;

    // 2. Compute Connection lines and opacities
    const pos = posArray.current;
    const col = colArray.current;
    let lineCount = 0;
    const threshold = 4.8;
    const thresholdSq = threshold * threshold;

    // Background color components normalized to blend lines out
    const bgR = 0.019; // #05070f normalized (5/255)
    const bgG = 0.027; // (7/255)
    const bgB = 0.059; // (15/255)

    // Line core color (Cyan #00f2fe)
    const activeR = 0.0;
    const activeG = 0.95;
    const activeB = 1.0;

    for (let i = 0; i < count; i++) {
      const nodeA = nodesRef.current[i];
      for (let j = i + 1; j < count; j++) {
        if (lineCount >= MAX_CONNECTIONS) break;
        const nodeB = nodesRef.current[j];

        const dx = nodeA.x - nodeB.x;
        const dy = nodeA.y - nodeB.y;
        const dz = nodeA.z - nodeB.z;
        const distSq = dx * dx + dy * dy + dz * dz;

        if (distSq < thresholdSq) {
          const dist = Math.sqrt(distSq);
          const opacity = 1.0 - dist / threshold;

          const vIdx = lineCount * 6;

          // Set segment vertex A and B positions
          pos[vIdx] = nodeA.x;
          pos[vIdx+1] = nodeA.y;
          pos[vIdx+2] = nodeA.z;

          pos[vIdx+3] = nodeB.x;
          pos[vIdx+4] = nodeB.y;
          pos[vIdx+5] = nodeB.z;

          // Blend line color to background color based on distance-based opacity
          col[vIdx] = bgR + (activeR - bgR) * opacity;
          col[vIdx+1] = bgG + (activeG - bgG) * opacity;
          col[vIdx+2] = bgB + (activeB - bgB) * opacity;

          col[vIdx+3] = bgR + (activeR - bgR) * opacity;
          col[vIdx+4] = bgG + (activeG - bgG) * opacity;
          col[vIdx+5] = bgB + (activeB - bgB) * opacity;

          lineCount++;
        }
      }
      if (lineCount >= MAX_CONNECTIONS) break;
    }

    if (linesGeomRef.current) {
      linesGeomRef.current.attributes.position.needsUpdate = true;
      linesGeomRef.current.attributes.color.needsUpdate = true;
      linesGeomRef.current.setDrawRange(0, lineCount * 2);
    }

    // 3. Smooth Camera movement matching scroll progress & mouse coordinates
    const rawProgress = scrollProgress.current;
    // Strictly clamp progress between 0 and 1 to prevent overscroll / rubber-banding camera drift at page bottom
    const progress = Math.min(Math.max(rawProgress, 0), 1);

    // Keep camera floating gracefully in front of the nodes field as you scroll the full page length
    const targetZ = THREE.MathUtils.lerp(8, 2, progress);
    const scrollParallaxY = THREE.MathUtils.lerp(0, -3.5, progress);
    const scrollParallaxX = Math.sin(progress * Math.PI * 2) * 2.0;

    // Mouse movement parallax (tilt)
    const mouseSpeed = reducedMotion ? 0.0 : 1.0;
    const mouseParallaxX = mouse.current.x * 1.5 * mouseSpeed;
    const mouseParallaxY = mouse.current.y * 1.2 * mouseSpeed;

    const targetX = scrollParallaxX + mouseParallaxX;
    const targetY = scrollParallaxY + mouseParallaxY;

    // Lerp coordinates smoothly
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.05);
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.05);

    // Keep camera look target aligned ahead
    const lookTarget = new THREE.Vector3(0, targetY * 0.5, state.camera.position.z - 10);
    state.camera.lookAt(lookTarget);
  });

  return (
    <>
      {/* Node Particles */}
      <instancedMesh ref={meshRef} args={[undefined, undefined, nodeCount]}>
        <sphereGeometry args={[0.065, 6, 6]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>

      {/* Network Edge Lines */}
      <lineSegments>
        <bufferGeometry ref={linesGeomRef}>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.45}
        />
      </lineSegments>
    </>
  );
}

export default function NeuralBackground() {
  const [nodeCount, setNodeCount] = useState(160);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Avoid synchronous state update inside effect body to prevent cascading render warnings
    const animationFrameId = requestAnimationFrame(() => {
      setMounted(true);
      setReducedMotion(mediaQuery.matches);
    });

    // Optimize node counts for performance (reduced by 50% for sleeker look & higher performance)
    const checkMobile = () => {
      if (window.innerWidth < 768) {
        setNodeCount(65);
      } else {
        setNodeCount(160);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Handle system accessibility prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const motionListener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', motionListener);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', checkMobile);
      mediaQuery.removeEventListener('change', motionListener);
    };
  }, []);

  if (!mounted) {
    return <div className="fixed inset-0 w-full h-full -z-10 bg-transparent" />;
  }

  return (
    <div className="fixed inset-0 w-full h-full -z-10 bg-transparent overflow-hidden pointer-events-none">
      {/* Three.js R3F Canvas */}
      <Canvas
        camera={{ fov: 60, near: 0.1, far: 250, position: [0, 0, 8] }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <NeuralNetwork nodeCount={nodeCount} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}
