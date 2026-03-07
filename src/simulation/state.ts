import type { SimulationState } from '../types';

export function createInitialSimulationState(): SimulationState {
  return {
    elapsedTime: 0,
    values: {},
    eventQueue: [],
    activeSignals: [],
    selectedGateId: null,
    isPlaying: false,
    speedMultiplier: 1,
  };
}
