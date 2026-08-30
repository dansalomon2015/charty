export interface NormalizedProgress {
  value: number;
  max: number;
  progress: number;
}

export function normalizeProgress(value: number, max: number): NormalizedProgress {
  const safeValue = Number.isFinite(value) ? Math.max(0, value) : 0;
  const safeMax = Number.isFinite(max) && max > 0 ? max : 0;

  return {
    value: safeValue,
    max: safeMax,
    progress: safeMax === 0 ? 0 : Math.min(1, safeValue / safeMax),
  };
}
