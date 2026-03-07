import type { LogicValue } from './circuit';

export interface SignalChangeEvent {
  id: string;
  time: number;
  nodeId: string;
  value: LogicValue;
  sourceNodeId?: string;
}

export interface WireSignal {
  edgeId: string;
  value: LogicValue;
  startTime: number;
  endTime: number;
}

export interface SimulationState {
  elapsedTime: number;
  values: Record<string, LogicValue>;
  eventQueue: SignalChangeEvent[];
  activeSignals: WireSignal[];
  selectedGateId: string | null;
  isPlaying: boolean;
  speedMultiplier: number;
}
