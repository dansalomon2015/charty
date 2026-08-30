import type { ChartTheme } from './types';

export type ResolvedChartTheme = Required<ChartTheme>;

export const lightChartTheme: ResolvedChartTheme = {
  backgroundColor: 'transparent',
  barColor: '#14B2C0',
  selectedColor: '#FD7119',
  gridColor: '#DCEAEC',
  labelColor: '#526168',
  valueColor: '#0F6564',
  referenceLineColor: '#FD7119',
  donutColors: ['#0F6564', '#14B2C0', '#FD7119', '#FFC122', '#5A88FF', '#FC6AFF'],
  lineColor: '#14B2C0',
  pointColor: '#0F6564',
};

export const darkChartTheme: ResolvedChartTheme = {
  backgroundColor: '#17343D',
  barColor: '#4FD1DA',
  selectedColor: '#FF9A56',
  gridColor: '#31515A',
  labelColor: '#AFC5C9',
  valueColor: '#F3FAFA',
  referenceLineColor: '#FF9A56',
  donutColors: ['#4FD1DA', '#FF9A56', '#7EA6FF', '#FFD164', '#ED8BFF', '#6DD7A8'],
  lineColor: '#4FD1DA',
  pointColor: '#F3FAFA',
};

/** Backwards-compatible name for the default light theme. */
export const defaultChartTheme = lightChartTheme;

export const chartThemes = {
  light: lightChartTheme,
  dark: darkChartTheme,
} as const;

export const resolveTheme = (theme?: Partial<ChartTheme>): ResolvedChartTheme => {
  const merged = {
    ...defaultChartTheme,
    ...theme,
    donutColors: theme?.donutColors ?? defaultChartTheme.donutColors,
  };

  return {
    ...merged,
    lineColor: theme?.lineColor ?? theme?.barColor ?? merged.lineColor,
    pointColor:
      theme?.pointColor ?? theme?.lineColor ?? theme?.barColor ?? merged.pointColor,
  };
};
