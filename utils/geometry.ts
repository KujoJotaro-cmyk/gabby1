
import * as THREE from 'three';
import { ParticleShape } from '../types';

export const generateShapePositions = (shape: ParticleShape, count: number): Float32Array => {
  const positions = new Float32Array(count * 3);
  
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    let x = 0, y = 0, z = 0;

    switch (shape) {
      case ParticleShape.HEART: {
        const t = Math.random() * Math.PI * 2;
        const u = Math.random() * 2 - 1;
        // 3D heart parametric approx
        x = 16 * Math.pow(Math.sin(t), 3);
        y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
        z = u * 5; // Thickness
        // Normalize scale
        x *= 0.1; y *= 0.1; z *= 0.1;
        break;
      }
      case ParticleShape.FLOWER: {
        const phi = Math.random() * Math.PI * 2;
        const theta = Math.random() * Math.PI;
        const r = 2 * Math.sin(4 * phi) * Math.sin(theta);
        x = r * Math.sin(theta) * Math.cos(phi);
        y = r * Math.sin(theta) * Math.sin(phi);
        z = r * Math.cos(theta);
        break;
      }
      case ParticleShape.SATURN: {
        const isRing = Math.random() > 0.4;
        if (isRing) {
          const angle = Math.random() * Math.PI * 2;
          const radius = 2.5 + Math.random() * 1.5;
          x = Math.cos(angle) * radius;
          y = (Math.random() - 0.5) * 0.2;
          z = Math.sin(angle) * radius;
        } else {
          const u = Math.random();
          const v = Math.random();
          const theta = 2 * Math.PI * u;
          const phi = Math.acos(2 * v - 1);
          const r = 1.8;
          x = r * Math.sin(phi) * Math.cos(theta);
          y = r * Math.sin(phi) * Math.sin(theta);
          z = r * Math.cos(phi);
        }
        break;
      }
      case ParticleShape.ZEN: {
        // Simple stacked spheres for a "Zen" silhouette
        const part = Math.random();
        let r = 0, offset = 0;
        if (part < 0.5) { // Base
          r = 2; offset = -1.5;
        } else if (part < 0.8) { // Body
          r = 1.5; offset = 0;
        } else { // Head
          r = 0.8; offset = 1.5;
        }
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        x = r * Math.sin(phi) * Math.cos(theta);
        y = r * Math.sin(phi) * Math.sin(theta) + offset;
        z = r * Math.cos(phi);
        break;
      }
      case ParticleShape.FIREWORK: {
        const phi = Math.random() * Math.PI * 2;
        const costheta = Math.random() * 2 - 1;
        const theta = Math.acos(costheta);
        const r = 3 * Math.pow(Math.random(), 0.5);
        x = r * Math.sin(theta) * Math.cos(phi);
        y = r * Math.sin(theta) * Math.sin(phi);
        z = r * Math.cos(theta);
        break;
      }
    }

    positions[i3] = x;
    positions[i3 + 1] = y;
    positions[i3 + 2] = z;
  }

  return positions;
};
