import { describe, expect, it } from 'vitest';
import { createTicks, getChartMaximum, niceStep, toNonNegativeFinite } from '../src/utils/scales';

describe('chart scales', () => {
  it('normalizes invalid and negative values', () => {
    expect(toNonNegativeFinite(-12)).toBe(0);
    expect(toNonNegativeFinite(Number.NaN)).toBe(0);
    expect(toNonNegativeFinite(12)).toBe(12);
  });

  it('creates readable steps', () => {
    expect(niceStep(18)).toBe(20);
    expect(niceStep(2_300)).toBe(5_000);
  });

  it('creates ticks whose final value contains the maximum', () => {
    const ticks = createTicks(59_000);
    expect(ticks[0]).toBe(0);
    expect(ticks[ticks.length - 1]).toBeGreaterThanOrEqual(59_000);
  });

  it('includes a reference line in the chart maximum', () => {
    expect(getChartMaximum([10, 20], 30)).toBe(30);
  });
});
