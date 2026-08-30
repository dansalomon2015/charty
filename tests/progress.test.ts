import { describe, expect, it } from 'vitest';
import { normalizeProgress } from '../src/utils/progress';

describe('progress normalization', () => {
  it('calculates progress within the target', () => {
    expect(normalizeProgress(36, 50)).toEqual({
      value: 36,
      max: 50,
      progress: 0.72,
    });
  });

  it('clamps the rendered progress while preserving values above the target', () => {
    expect(normalizeProgress(125, 100)).toEqual({
      value: 125,
      max: 100,
      progress: 1,
    });
  });

  it('normalizes negative and non-finite values', () => {
    expect(normalizeProgress(-10, 100)).toEqual({
      value: 0,
      max: 100,
      progress: 0,
    });
    expect(normalizeProgress(Number.NaN, Number.POSITIVE_INFINITY)).toEqual({
      value: 0,
      max: 0,
      progress: 0,
    });
  });
});
