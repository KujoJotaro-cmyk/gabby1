
import React, { useState, useCallback, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { ParticleSystem } from './components/ParticleSystem';
import { HandTracker } from './components/HandTracker';
import { UIOverlay } from './components/UIOverlay';
import { AppState, ParticleShape } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    shape: ParticleShape.SATURN,
    color: '#6366f1',
    handDistance: 0,
    isCameraActive: false,
    isFullscreen: false,
    particleCount: 15000
  });

  const handleDistanceChange = useCallback((distance: number) => {
    setState(prev => ({ ...prev, handDistance: distance }));
  }, []);

  const handleActiveChange = useCallback((active: boolean) => {
    setState(prev => ({ ...prev, isCameraActive: active }));
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setState(prev => ({ ...prev, isFullscreen: true }));
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setState(prev => ({ ...prev, isFullscreen: false }));
      }
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setState(prev => ({ ...prev, isFullscreen: !!document.fullscreenElement }));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  return (
    <div className="relative w-full h-full bg-black select-none">
      {/* 3D Scene */}
      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={45} />
        <OrbitControls 
          enablePan={false} 
          enableZoom={true} 
          minDistance={5} 
          maxDistance={25}
          autoRotate 
          autoRotateSpeed={0.5}
        />
        
        <color attach="background" args={['#000000']} />
        
        <ParticleSystem 
          shape={state.shape} 
          color={state.color} 
          handDistance={state.handDistance}
          particleCount={state.particleCount}
        />

        <EffectComposer disableNormalPass>
          <Bloom 
            luminanceThreshold={0.1} 
            mipmapBlur 
            intensity={1.5} 
            radius={0.4} 
          />
        </EffectComposer>
      </Canvas>

      {/* Hand Tracking Layer */}
      <HandTracker 
        onDistanceChange={handleDistanceChange} 
        onActiveChange={handleActiveChange} 
      />

      {/* User Interface Layer */}
      <UIOverlay 
        state={state} 
        setState={setState} 
        onToggleFullscreen={toggleFullscreen} 
      />
      
      {/* Visual background gradient for atmosphere */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.15)_0%,transparent_70%)]" />
    </div>
  );
};

export default App;
