
import React, { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { ParticleShape } from '../types';
import { generateShapePositions } from '../utils/geometry';

interface ParticleSystemProps {
  shape: ParticleShape;
  color: string;
  handDistance: number;
  particleCount: number;
}

const vertexShader = `
  uniform float uTime;
  uniform float uHandDistance;
  uniform vec3 uColor;
  attribute vec3 aTarget;
  varying vec3 vColor;

  void main() {
    vec3 pos = position;
    
    // Noise based on time and hand distance (diffusion)
    float noise = sin(uTime * 2.0 + position.x * 5.0) * 0.1 * uHandDistance;
    pos += normalize(pos) * uHandDistance * 2.5; // Scale and diffusion
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = 4.0 * (1.0 / -mvPosition.z) * (1.0 + uHandDistance * 2.0);
    gl_Position = projectionMatrix * mvPosition;
    
    vColor = uColor;
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  void main() {
    float dist = distance(gl_PointCoord, vec2(0.5));
    if (dist > 0.5) discard;
    float alpha = 1.0 - smoothstep(0.4, 0.5, dist);
    gl_FragColor = vec4(vColor, alpha);
  }
`;

export const ParticleSystem: React.FC<ParticleSystemProps> = ({ shape, color, handDistance, particleCount }) => {
  const meshRef = useRef<THREE.Points>(null!);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);
  
  // Memoize positions for each shape and count
  const shapePositions = useMemo(() => generateShapePositions(shape, particleCount), [shape, particleCount]);
  
  // Use a ref to store the "current" target for lerping
  const targetPositions = useRef(new Float32Array(particleCount * 3));
  const currentPositions = useRef(new Float32Array(particleCount * 3));

  useEffect(() => {
    // When particleCount changes, resize internal tracking buffers
    if (targetPositions.current.length !== particleCount * 3) {
      targetPositions.current = new Float32Array(particleCount * 3);
      currentPositions.current = new Float32Array(particleCount * 3);
      // Initialize current positions to target to prevent huge jumps
      currentPositions.current.set(shapePositions);
    }
    targetPositions.current.set(shapePositions);
  }, [shapePositions, particleCount]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = t;
      materialRef.current.uniforms.uHandDistance.value = handDistance;
      materialRef.current.uniforms.uColor.value = new THREE.Color(color);
    }

    if (meshRef.current) {
      const posAttr = meshRef.current.geometry.attributes.position;
      // Safety check for length match during transitions
      const len = Math.min(currentPositions.current.length, targetPositions.current.length, posAttr.array.length);
      
      for (let i = 0; i < len; i++) {
        currentPositions.current[i] += (targetPositions.current[i] - currentPositions.current[i]) * 0.05;
      }
      
      posAttr.array.set(currentPositions.current);
      posAttr.needsUpdate = true;

      // Rotation
      meshRef.current.rotation.y = t * 0.1;
      meshRef.current.rotation.z = t * 0.05;
    }
  });

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(particleCount * 3), 3));
    return geo;
  }, [particleCount]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uHandDistance: { value: 0 },
    uColor: { value: new THREE.Color(color) }
  }), []);

  return (
    <points ref={meshRef} geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};
