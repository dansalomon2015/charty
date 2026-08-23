const categories = [
  { label: 'Housing', color: '#0F6564' },
  { label: 'Food', color: '#FD7119' },
  { label: 'Transport', color: '#5A88FF' },
  { label: 'Leisure', color: '#FC6AFF' },
] as const;

type SpendingShares = readonly [number, number, number, number];

function createBreakdown(total: number, shares: SpendingShares) {
  let allocated = 0;

  return categories.map((category, index) => {
    const value =
      index === categories.length - 1
        ? total - allocated
        : Math.round(total * shares[index]);
    allocated += value;
    return { ...category, value };
  });
}

export const monthlyData = [
  { label: 'Jan', value: 42_000, breakdown: createBreakdown(42_000, [0.45, 0.23, 0.12, 0.2]) },
  { label: 'Feb', value: 39_000, breakdown: createBreakdown(39_000, [0.42, 0.25, 0.13, 0.2]) },
  { label: 'Mar', value: 54_500, breakdown: createBreakdown(54_500, [0.48, 0.18, 0.14, 0.2]) },
  { label: 'Apr', value: 59_000, breakdown: createBreakdown(59_000, [0.51, 0.19, 0.11, 0.19]) },
  { label: 'May', value: 55_000, breakdown: createBreakdown(55_000, [0.46, 0.21, 0.15, 0.18]) },
  { label: 'Jun', value: 34_000, breakdown: createBreakdown(34_000, [0.44, 0.24, 0.17, 0.15]) },
];

export function resolveSelectionIndices(indices: readonly number[]) {
  return indices.length > 0 ? indices : monthlyData.map((_, index) => index);
}

export function aggregateBreakdowns(indices: readonly number[]) {
  return categories.map((category, categoryIndex) => ({
    ...category,
    value: indices.reduce(
      (total, monthIndex) =>
        total + (monthlyData[monthIndex]?.breakdown[categoryIndex]?.value ?? 0),
      0
    ),
  }));
}
