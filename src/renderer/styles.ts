import type { LogicValue } from '../types';

export function getSignalColor(value: LogicValue): string {
  return value === 1 ? '#1d9bf0' : '#6b7280';
}

export function getGateStrokeColor(value: LogicValue): string {
  return value === 1 ? '#0f766e' : '#374151';
}
