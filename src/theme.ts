import type { ChartTheme } from './types';

export const defaultChartTheme: ChartTheme = {
  backgroundColor: 'transparent',
  barColor: '#14B2C0',
  selectedColor: '#FD7119',
  gridColor: '#DCEAEC',
  labelColor: '#526168',
  valueColor: '#0F6564',
  referenceLineColor: '#FD7119',
  donutColors: ['#0F6564', '#14B2C0', '#FD7119', '#FFC122', '#5A88FF', '#FC6AFF'],
};

export const resolveTheme = (theme?: Partial<ChartTheme>): ChartTheme => ({
  ...defaultChartTheme,
  ...theme,
  donutColors: theme?.donutColors ?? defaultChartTheme.donutColors,
});
