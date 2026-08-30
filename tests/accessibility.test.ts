import { describe, expect, it } from 'vitest';
import { lightChartTheme } from '../src/theme';
import {
  getWebToggleAccessibilityProps,
  normalizeFontScale,
  scaleCartesianPadding,
} from '../src/utils/accessibility';

function channelToLinear(channel: number) {
  const normalized = channel / 255;
  return normalized <= 0.04045
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string) {
  const value = hex.replace('#', '');
  const channels = [0, 2, 4].map((offset) =>
    channelToLinear(Number.parseInt(value.slice(offset, offset + 2), 16))
  );
  return 0.2126 * channels[0]! + 0.7152 * channels[1]! + 0.0722 * channels[2]!;
}

function contrastRatio(foreground: string, background: string) {
  const lighter = Math.max(luminance(foreground), luminance(background));
  const darker = Math.min(luminance(foreground), luminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}

describe('accessibility utilities', () => {
  it('publishes toggle state only for interactive web values', () => {
    expect(getWebToggleAccessibilityProps(true, true)).toEqual({
      'aria-pressed': true,
    });
    expect(getWebToggleAccessibilityProps(false, true)).toEqual({
      'aria-pressed': false,
    });
    expect(getWebToggleAccessibilityProps(true, false)).toEqual({});
  });

  it('clamps font scaling and grows cartesian padding with labels', () => {
    expect(normalizeFontScale(Number.NaN)).toBe(1);
    expect(normalizeFontScale(0.5)).toBe(1);
    expect(normalizeFontScale(1.5)).toBe(1.5);
    expect(normalizeFontScale(3)).toBe(2);
    expect(
      scaleCartesianPadding({ top: 10, right: 20, bottom: 30, left: 40 }, 1.5)
    ).toEqual({ top: 15, right: 30, bottom: 45, left: 60 });
  });

  it('keeps light-theme informational colors readable on white', () => {
    for (const color of [
      lightChartTheme.labelColor,
      lightChartTheme.valueColor,
      lightChartTheme.selectedColor,
      lightChartTheme.referenceLineColor,
    ]) {
      expect(contrastRatio(color, '#FFFFFF')).toBeGreaterThanOrEqual(4.5);
    }
  });
});
