
import React, { useEffect, useRef } from 'react';

interface HandTrackerProps {
  onDistanceChange: (distance: number) => void;
  onActiveChange: (active: boolean) => void;
}

declare const Hands: any;
declare const Camera: any;

export const HandTracker: React.FC<HandTrackerProps> = ({ onDistanceChange, onActiveChange }) => {
  const videoRef = useRef<HTMLVideoElement>(null!);

  useEffect(() => {
    if (typeof Hands === 'undefined') return;

    const hands = new Hands({
      locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });

    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    hands.onResults((results: any) => {
      const landmarks = results.multiHandLandmarks;
      onActiveChange(landmarks && landmarks.length > 0);
      
      if (landmarks && landmarks.length === 2) {
        const h1 = landmarks[0][9];
        const h2 = landmarks[1][9];
        const dist = Math.sqrt(Math.pow(h1.x - h2.x, 2) + Math.pow(h1.y - h2.y, 2));
        const normalized = Math.min(Math.max((dist - 0.1) / 0.6, 0), 1);
        onDistanceChange(normalized);
      } else if (landmarks && landmarks.length === 1) {
        const hand = landmarks[0];
        const thumb = hand[4];
        const index = hand[8];
        const dist = Math.sqrt(Math.pow(thumb.x - index.x, 2) + Math.pow(thumb.y - index.y, 2));
        const normalized = Math.min(Math.max((dist - 0.05) / 0.3, 0), 1);
        onDistanceChange(normalized);
      } else {
        onDistanceChange(0);
      }
    });

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        await hands.send({ image: videoRef.current });
      },
      width: 640,
      height: 480
    });
    
    camera.start();

    return () => {
      camera.stop();
    };
  }, [onDistanceChange, onActiveChange]);

  return (
    <div className="fixed bottom-4 right-4 w-48 h-36 rounded-xl overflow-hidden glass border shadow-2xl z-50">
      <video ref={videoRef} className="w-full h-full object-cover scale-x-[-1]" />
      <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/40 text-[10px] text-white font-medium uppercase tracking-wider backdrop-blur-sm">
        Webcam Monitor
      </div>
    </div>
  );
};
