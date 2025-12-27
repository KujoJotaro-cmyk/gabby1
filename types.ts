
export enum ParticleShape {
  HEART = 'Heart',
  FLOWER = 'Flower',
  SATURN = 'Saturn',
  ZEN = 'Zen Statue',
  FIREWORK = 'Firework'
}

export interface AppState {
  shape: ParticleShape;
  color: string;
  handDistance: number; // 0 to 1
  isCameraActive: boolean;
  isFullscreen: boolean;
  particleCount: number;
}
