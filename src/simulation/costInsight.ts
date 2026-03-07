import type { LogicValue } from '../types';

export interface CostEstimate {
  operation: 'addition' | 'multiplication';
  estimatedDelay: number;
  estimatedEvents: number;
}

export interface CarryPropagationInsight {
  bitIndex: number;
  carryArrivalTime: number;
  isActive: boolean;
}

export interface CostInsightResult {
  bitWidth: number;
  cin: LogicValue;
  addition: CostEstimate;
  multiplication: CostEstimate;
  costRatio: number;
  carryPath: CarryPropagationInsight[];
}

export function estimateCostInsight(params: {
  bitWidth: number;
  cin: LogicValue;
  currentTime: number;
}): CostInsightResult {
  const bitWidth = Math.max(1, Math.min(32, params.bitWidth));
  const carryStepDelay = 1.2;
  const baseAddDelay = 2.2;
  const carryChainLength = params.cin === 1 ? bitWidth : Math.max(1, Math.round(bitWidth * 0.2));

  const addDelay = baseAddDelay + carryChainLength * carryStepDelay;
  const addEvents = bitWidth * 9 + carryChainLength * 4;

  const multDelay = 1.6 * bitWidth * bitWidth + 3.4 * bitWidth;
  const multEvents = 22 * bitWidth * bitWidth + 10 * bitWidth;

  const carryPath: CarryPropagationInsight[] = Array.from({ length: bitWidth }, (_, bitIndex) => {
    const arrival = bitIndex * carryStepDelay;
    const active = params.cin === 1 && params.currentTime >= arrival;
    return {
      bitIndex,
      carryArrivalTime: arrival,
      isActive: active,
    };
  });

  return {
    bitWidth,
    cin: params.cin,
    addition: {
      operation: 'addition',
      estimatedDelay: addDelay,
      estimatedEvents: addEvents,
    },
    multiplication: {
      operation: 'multiplication',
      estimatedDelay: multDelay,
      estimatedEvents: multEvents,
    },
    costRatio: multDelay / addDelay,
    carryPath,
  };
}
