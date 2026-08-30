import type { CartesianPadding } from './cartesian';

export interface WebToggleAccessibilityProps {
  'aria-pressed'?: boolean;
}

export function getWebToggleAccessibilityProps(
  selected: boolean,
  enabled: boolean
): WebToggleAccessibilityProps {
  return enabled
    ? {
        'aria-pressed': selected,
      }
    : {};
}

export function normalizeFontScale(fontScale: number) {
  if (!Number.isFinite(fontScale)) return 1;
  return Math.max(1, Math.min(2, fontScale));
}

export function scaleCartesianPadding(
  padding: CartesianPadding,
  fontScale: number
): CartesianPadding {
  const scale = normalizeFontScale(fontScale);
  return {
    top: padding.top * scale,
    right: padding.right * scale,
    bottom: padding.bottom * scale,
    left: padding.left * scale,
  };
}
