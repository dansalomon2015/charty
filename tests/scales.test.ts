import { describe, expect, it } from 'vitest';
import {
  createAreaPath,
  createLinearPath,
  getCartesianFrame,
  getXForPoint,
  getYForValue,
} from '../src/utils/cartesian';
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

describe('cartesian coordinates', () => {
  it('creates a non-negative plot frame', () => {
    expect(getCartesianFrame(320, 240)).toEqual({
      plotWidth: 256,
      plotHeight: 186,
    });
    expect(getCartesianFrame(20, 20)).toEqual({
      plotWidth: 0,
      plotHeight: 0,
    });
  });

  it('positions line points from the first to the last plot coordinate', () => {
    expect(getXForPoint(0, 3, 200)).toBe(52);
    expect(getXForPoint(1, 3, 200)).toBe(152);
    expect(getXForPoint(2, 3, 200)).toBe(252);
    expect(getXForPoint(0, 1, 200)).toBe(152);
  });

  it('maps values and builds a deterministic linear SVG path', () => {
    expect(getYForValue(50, 100, 200)).toBe(118);
    expect(
      createLinearPath([
        { x: 52, y: 218 },
        { x: 152, y: 118 },
        { x: 252, y: 18 },
      ])
    ).toBe('M 52 218 L 152 118 L 252 18');
  });

  it('closes an area path against its baseline', () => {
    expect(
      createAreaPath(
        [
          { x: 52, y: 218 },
          { x: 152, y: 118 },
          { x: 252, y: 18 },
        ],
        218
      )
    ).toBe('M 52 218 L 152 118 L 252 18 L 252 218 L 52 218 Z');
    expect(createAreaPath([], 218)).toBe('');
  });
});
