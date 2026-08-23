import { describe, expect, it } from 'vitest';
import {
  aggregateBreakdowns,
  monthlyData,
  resolveSelectionIndices,
} from '../example/data';

describe('example chart coordination', () => {
  it('aggregates every selected month for the donut chart', () => {
    const selectedIndices = [0, 1];
    const total = selectedIndices.reduce(
      (sum, index) => sum + (monthlyData[index]?.value ?? 0),
      0
    );

    expect(total).toBe(81_000);
    expect(aggregateBreakdowns(selectedIndices).map(({ value }) => value)).toEqual([
      35_280,
      19_410,
      10_110,
      16_200,
    ]);
  });

  it('falls back to all months when the selection is empty', () => {
    const effectiveIndices = resolveSelectionIndices([]);
    const total = effectiveIndices.reduce(
      (sum, index) => sum + (monthlyData[index]?.value ?? 0),
      0
    );

    expect(effectiveIndices).toEqual([0, 1, 2, 3, 4, 5]);
    expect(total).toBe(283_500);
    expect(aggregateBreakdowns(effectiveIndices).map(({ value }) => value)).toEqual([
      131_790,
      60_140,
      38_260,
      53_310,
    ]);
  });
});
