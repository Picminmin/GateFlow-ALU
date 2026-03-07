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

function isCollinear(a: Point, b: Point, c: Point): boolean {
  const abx = b.x - a.x;
  const aby = b.y - a.y;
  const bcx = c.x - b.x;
  const bcy = c.y - b.y;
  return abx * bcy - aby * bcx === 0;
}

function normalizePoints(points: Point[]): Point[] {
  const deduped = points.filter((point, index) => {
    if (index === 0) return true;
    const prev = points[index - 1];
    return !(prev.x === point.x && prev.y === point.y);
  });

  const simplified: Point[] = [];
  for (const point of deduped) {
    if (simplified.length < 2) {
      simplified.push(point);
      continue;
    }
    const a = simplified[simplified.length - 2];
    const b = simplified[simplified.length - 1];
    if (isCollinear(a, b, point)) {
      simplified[simplified.length - 1] = point;
    } else {
      simplified.push(point);
    }
  }

  return simplified;
}

export function buildRoutedWire(start: Point, end: Point, edgeId: string): RoutedWire {
  if (Math.abs(end.y - start.y) <= 4) {
    const straightPoints = [start, end];
    return {
      points: straightPoints,
      pathD: `M ${start.x} ${start.y} L ${end.x} ${end.y}`,
      labelPoint: getPointAlongPolyline(straightPoints, 0.5),
    };
  }

  const hash = hashSeed(edgeId);
  const horizontalSpan = Math.max(1, end.x - start.x);
  const verticalGap = Math.abs(end.y - start.y);

  // Rightward-first routing:
  // 1) move right from source
  // 2) use one vertical trunk in the middle area
  // 3) move right again toward destination
  // 4) final vertical align at destination X
  const laneOffset = verticalGap <= 20 ? 0 : ((hash % 3) - 1) * 6;
  const trunkX = Math.max(start.x + 32, Math.min(end.x - 28, start.x + horizontalSpan * 0.62));
  const targetY = end.y + laneOffset;
  const approachX = Math.max(start.x + 40, end.x - 12);

  const rawPoints: Point[] = [start, { x: trunkX, y: start.y }];

  if (targetY !== start.y) {
    rawPoints.push({ x: trunkX, y: targetY });
  }

  if (approachX !== trunkX || targetY !== end.y) {
    rawPoints.push({ x: approachX, y: targetY });
  }

  if (targetY !== end.y) {
    rawPoints.push({ x: approachX, y: end.y });
  }

  rawPoints.push(end);

  const points = normalizePoints(rawPoints);

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
