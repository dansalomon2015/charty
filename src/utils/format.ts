import type { ValueFormatter } from '../types';

export const defaultValueFormatter: ValueFormatter = (value) =>
  new Intl.NumberFormat(undefined, {
    notation: Math.abs(value) >= 1_000 ? 'compact' : 'standard',
    maximumFractionDigits: 1,
  }).format(value);

export const formatPercent = (part: number, total: number): string => {
  if (total <= 0) return '0%';
  return `${Math.round((part / total) * 100)}%`;
};
