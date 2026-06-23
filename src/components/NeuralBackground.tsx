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

  const x = (r1 - 0.5) * 28;
  const y = (r2 - 0.5) * 18;
  const z = r3 * -30 + 5; // distributed from -25 to +5

  // Elegant drift velocity
  const vx = (r4 - 0.5) * 0.006;
  const vy = (r5 - 0.5) * 0.006;
  const vz = (r6 - 0.5) * 0.004;

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

  // Scroll tracking from Lenis
  const scrollProgress = useRef(0);
  useLenis((lenis) => {
    scrollProgress.current = lenis.progress; // Normalised scroll progress [0, 1]
  });

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
      // We use index-based seed for purity here as well
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

  // Pre-allocated line buffers for maximum performance (avoids memory allocation GC lag in frame loop)
  const MAX_CONNECTIONS = 1200;
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

      // Keep them enclosed in the boundary box (bounce velocities)
      const boundX = 14;
      const boundY = 9;
      const boundZMin = -25;
      const boundZMax = 5;

      if (node.x < -boundX || node.x > boundX) {
        node.vx = -node.vx;
        node.x = Math.max(-boundX, Math.min(boundX, node.x));
      }
      if (node.y < -boundY || node.y > boundY) {
        node.vy = -node.vy;
        node.y = Math.max(-boundY, Math.min(boundY, node.y));
      }
      if (node.z < boundZMin || node.z > boundZMax) {
        node.vz = -node.vz;
        node.z = Math.max(boundZMin, Math.min(boundZMax, node.z));
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
    const threshold = 3.2;
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
    const progress = scrollProgress.current;

    // Progress from Z=8 down to Z=-20 (flying into the network)
    const targetZ = THREE.MathUtils.lerp(8, -20, progress);

    // Lateral S-Curve scroll parallax
    const scrollParallaxX = Math.sin(progress * Math.PI * 1.5) * 3.2;
    const scrollParallaxY = Math.cos(progress * Math.PI) * 1.2;

    // Mouse movement parallax (tilt)
    const mouseSpeed = reducedMotion ? 0.0 : 1.0;
    const mouseParallaxX = mouse.current.x * 1.5 * mouseSpeed;
    const mouseParallaxY = mouse.current.y * 1.2 * mouseSpeed;

    const targetX = scrollParallaxX + mouseParallaxX;
    const targetY = scrollParallaxY + mouseParallaxY;

    // Lerp coordinates
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.05);
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.05);

    // Keep camera look target aligned ahead
    const lookTarget = new THREE.Vector3(0, 0, state.camera.position.z - 8);
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
  const [nodeCount, setNodeCount] = useState(220);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Handle system accessibility prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const motionListener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', motionListener);

    // Avoid synchronous state update inside effect body to prevent cascading render warnings
    const animationFrameId = requestAnimationFrame(() => {
      setMounted(true);
      setReducedMotion(mediaQuery.matches);
    });

    // Optimize node counts for performance based on mobile width
    const checkMobile = () => {
      if (window.innerWidth < 768) {
        setNodeCount(85);
      } else {
        setNodeCount(220);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', checkMobile);
      mediaQuery.removeEventListener('change', motionListener);
    };
  }, []);

  if (!mounted) {
    // Initial server-side render visual placeholder
    return <div className="fixed inset-0 w-full h-full -z-10 bg-[#05070f]" />;
  }

  return (
    <div className="fixed inset-0 w-full h-full -z-10 bg-[#05070f] overflow-hidden pointer-events-none">
      {/* Three.js R3F Canvas */}
      <Canvas
        camera={{ fov: 60, near: 0.1, far: 50, position: [0, 0, 8] }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 1.5]}
      >
        <color attach="background" args={['#05070f']} />
        <NeuralNetwork nodeCount={nodeCount} reducedMotion={reducedMotion} />
      </Canvas>

      {/* Layer 1: Dark Radial Vignette to mask mesh clipping at screen borders and add depth */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-85"
        style={{
          background: 'radial-gradient(circle at center, transparent 30%, #05070f 95%)'
        }}
      />

      {/* Layer 2: Subtle Vertical Gradients to ensure text readability on the home page */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, #05070f 0%, rgba(5, 7, 15, 0.4) 15%, rgba(5, 7, 15, 0.4) 85%, #05070f 100%)'
        }}
      />
    </div>
  );
}
