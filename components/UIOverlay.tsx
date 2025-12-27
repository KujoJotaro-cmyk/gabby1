
import React from 'react';
import { ParticleShape, AppState } from '../types';
import { Maximize2, Minimize2, Heart, Flower2, Circle, User, Sparkles, Layers } from 'lucide-react';

interface UIOverlayProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  onToggleFullscreen: () => void;
}

const SHAPE_ICONS: Record<ParticleShape, React.ReactNode> = {
  [ParticleShape.HEART]: <Heart className="w-5 h-5" />,
  [ParticleShape.FLOWER]: <Flower2 className="w-5 h-5" />,
  [ParticleShape.SATURN]: <Circle className="w-5 h-5" />,
  [ParticleShape.ZEN]: <User className="w-5 h-5" />,
  [ParticleShape.FIREWORK]: <Sparkles className="w-5 h-5" />
};

export const UIOverlay: React.FC<UIOverlayProps> = ({ state, setState, onToggleFullscreen }) => {
  return (
    <div className="fixed inset-0 pointer-events-none flex flex-col justify-between p-6 z-40">
      {/* Top Header */}
      <div className="flex justify-between items-start">
        <div className="pointer-events-auto">
          <h1 className="text-3xl font-black text-white tracking-tighter italic">NEBULA<span className="text-indigo-500">HANDS</span></h1>
          <p className="text-white/50 text-xs font-medium uppercase tracking-[0.2em]">Real-time Gesture Particles</p>
        </div>

        <button 
          onClick={onToggleFullscreen}
          className="pointer-events-auto p-3 glass rounded-full text-white/70 hover:text-white transition-all hover:scale-110 active:scale-95"
        >
          {state.isFullscreen ? <Minimize2 /> : <Maximize2 />}
        </button>
      </div>

      {/* Main Controls Panel */}
      <div className="flex justify-center mb-8">
        <div className="pointer-events-auto glass p-2 rounded-2xl flex items-center gap-2">
          {Object.values(ParticleShape).map((shape) => (
            <button
              key={shape}
              onClick={() => setState(prev => ({ ...prev, shape }))}
              className={`p-3 rounded-xl transition-all flex flex-col items-center gap-1 min-w-[70px] ${
                state.shape === shape ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              {SHAPE_ICONS[shape]}
              <span className="text-[10px] font-bold">{shape.split(' ')[0]}</span>
            </button>
          ))}
          <div className="w-[1px] h-10 bg-white/10 mx-2" />
          <div className="flex flex-col items-center gap-1 px-4">
            <input 
              type="color" 
              value={state.color}
              onChange={(e) => setState(prev => ({ ...prev, color: e.target.value }))}
              className="w-8 h-8 rounded-full border-none cursor-pointer bg-transparent"
            />
            <span className="text-[10px] font-bold text-white/60">Color</span>
          </div>
        </div>
      </div>

      {/* Status & Settings Indicators */}
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-2">
          {/* Camera Status */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full glass transition-opacity duration-500 ${state.isCameraActive ? 'opacity-100' : 'opacity-40'}`}>
            <div className={`w-2 h-2 rounded-full ${state.isCameraActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-[10px] font-bold text-white uppercase tracking-wider">
              {state.isCameraActive ? 'Hand Detected' : 'No Gesture Found'}
            </span>
          </div>

          {/* Controls Card */}
          <div className="glass p-4 rounded-xl w-72 flex flex-col gap-4 pointer-events-auto">
            {/* Diffusion slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-white/50 uppercase">Diffusion Intensity</span>
                <span className="text-xs text-indigo-400 font-mono">{(state.handDistance * 100).toFixed(0)}%</span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 transition-all duration-75" 
                  style={{ width: `${state.handDistance * 100}%` }}
                />
              </div>
            </div>

            {/* Particle Count slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-1.5">
                  <Layers className="w-3 h-3 text-white/50" />
                  <span className="text-[10px] font-bold text-white/50 uppercase">Particle Density</span>
                </div>
                <span className="text-xs text-indigo-400 font-mono">{state.particleCount.toLocaleString()}</span>
              </div>
              <input 
                type="range"
                min="5000"
                max="50000"
                step="1000"
                value={state.particleCount}
                onChange={(e) => setState(prev => ({ ...prev, particleCount: parseInt(e.target.value) }))}
                className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400"
              />
            </div>

            <p className="text-[9px] text-white/30 italic">Pinch/Expand hands to diffuse. Adjust density for performance.</p>
          </div>
        </div>
        
        <div className="hidden md:block">
           <p className="text-white/20 text-[10px] text-right font-medium">Built with Three.js & MediaPipe<br/>World-class Visual Engineering</p>
        </div>
      </div>
    </div>
  );
};
