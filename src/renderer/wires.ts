import type { Point } from '../types';

export interface RoutedWire {
  points: Point[];
  pathD: string;
  labelPoint: Point;
}

function hashSeed(text: string): number {
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function distance(a: Point, b: Point): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.hypot(dx, dy);
}

function pointAlongSegment(a: Point, b: Point, t: number): Point {
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
  };
}

export function buildRoutedWire(start: Point, end: Point, edgeId: string): RoutedWire {
  const hash = hashSeed(edgeId);
  const laneOffset = ((hash % 5) - 2) * 10;
  const spanX = Math.max(70, (end.x - start.x) * 0.45);
  const bendX = Math.min(end.x - 24, start.x + spanX);
  const targetY = end.y + laneOffset;
  const nearEndX = Math.max(start.x + 24, end.x - 28);

  const points: Point[] = [
    start,
    { x: bendX, y: start.y },
    { x: bendX, y: targetY },
    { x: nearEndX, y: targetY },
    { x: nearEndX, y: end.y },
    end,
  ];

  const pathD = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');
  const labelPoint = getPointAlongPolyline(points, 0.52);

  return { points, pathD, labelPoint };
}

export function getPointAlongPolyline(points: Point[], progress: number): Point {
  if (points.length <= 1) {
    return points[0] ?? { x: 0, y: 0 };
  }

  const lengths: number[] = [];
  let totalLength = 0;
  for (let i = 0; i < points.length - 1; i += 1) {
    const segmentLength = distance(points[i], points[i + 1]);
    lengths.push(segmentLength);
    totalLength += segmentLength;
  }

  const clampedProgress = Math.min(1, Math.max(0, progress));
  let targetLength = totalLength * clampedProgress;

  for (let i = 0; i < lengths.length; i += 1) {
    const segmentLength = lengths[i];
    if (targetLength <= segmentLength) {
      const t = segmentLength === 0 ? 0 : targetLength / segmentLength;
      return pointAlongSegment(points[i], points[i + 1], t);
    }
    targetLength -= segmentLength;
  }

  return points[points.length - 1];
}
