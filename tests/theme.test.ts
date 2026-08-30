import { describe, expect, it } from 'vitest';
import {
  chartThemes,
  darkChartTheme,
  defaultChartTheme,
  lightChartTheme,
  resolveTheme,
} from '../src/theme';

describe('chart themes', () => {
  it('keeps the default theme aligned with the light preset', () => {
    expect(defaultChartTheme).toBe(lightChartTheme);
    expect(chartThemes.light).toBe(lightChartTheme);
    expect(chartThemes.dark).toBe(darkChartTheme);
  });

  it('uses a legacy bar color for new line and point colors', () => {
    const theme = resolveTheme({ barColor: '#123456' });

    expect(theme.barColor).toBe('#123456');
    expect(theme.lineColor).toBe('#123456');
    expect(theme.pointColor).toBe('#123456');
    expect(theme.ringColor).toBe('#123456');
  });

  it('lets line and point colors be customized independently', () => {
    const theme = resolveTheme({
      lineColor: '#ABCDEF',
      pointColor: '#FEDCBA',
    });

    expect(theme.lineColor).toBe('#ABCDEF');
    expect(theme.pointColor).toBe('#FEDCBA');
  });

  it('uses a custom grid color for the progress track', () => {
    expect(resolveTheme({ gridColor: '#654321' }).ringTrackColor).toBe('#654321');
  });
});
