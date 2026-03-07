import type { CircuitGraph, LogicValue, SimulationState } from '../types';
import { createSimulationEngine } from './engine';

export interface StepPlaybackController {
  getSnapshot(): SimulationState;
  reset(): SimulationState;
  step(): SimulationState;
}

export function createStepPlaybackController(params: {
  circuit: CircuitGraph;
  inputs: Record<string, LogicValue>;
}): StepPlaybackController {
  const engine = createSimulationEngine();

  function initialize(): SimulationState {
    engine.setCircuit(params.circuit);
    engine.setInputs(params.inputs);
    return engine.snapshot();
  }

  let snapshot = initialize();

  return {
    getSnapshot() {
      return snapshot;
    },
    reset() {
      snapshot = initialize();
      return snapshot;
    },
    step() {
      snapshot = engine.step();
      return snapshot;
    },
  };
}

export function runStepSequence(
  controller: StepPlaybackController,
  steps: number,
): SimulationState[] {
  const frames: SimulationState[] = [];

  for (let i = 0; i < steps; i += 1) {
    frames.push(controller.step());
  }

  return frames;
}

export function verifyDeterministicStepping(params: {
  circuit: CircuitGraph;
  inputs: Record<string, LogicValue>;
  steps: number;
}): boolean {
  const runA = runStepSequence(createStepPlaybackController(params), params.steps);
  const runB = runStepSequence(createStepPlaybackController(params), params.steps);

  return JSON.stringify(runA) === JSON.stringify(runB);
}
