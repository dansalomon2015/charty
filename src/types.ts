import type { ReactNode } from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

export interface ChartDatum {
  label: string;
  value: number;
  color?: string;
  accessibilityLabel?: string;
}

export interface ChartTheme {
  backgroundColor: string;
  barColor: string;
  selectedColor: string;
  gridColor: string;
  labelColor: string;
  valueColor: string;
  referenceLineColor: string;
  donutColors: readonly string[];
  /** Defaults to barColor when omitted. */
  lineColor?: string;
  /** Defaults to lineColor when omitted. */
  pointColor?: string;
  /** Defaults to barColor when omitted. */
  ringColor?: string;
  /** Defaults to gridColor when omitted. */
  ringTrackColor?: string;
}

export interface ChartGradient {
  startColor: string;
  endColor: string;
  startOpacity?: number;
  endOpacity?: number;
}

export type ChartSelectionBehavior = 'single' | 'multiple';
export type ChartSelectionInteraction = 'press' | 'longPress' | 'modifierPress';

export interface ChartSelectionEvent {
  /** Gesture that produced the selection transition. */
  type: ChartSelectionInteraction;
  /** Data index targeted by the gesture. */
  index: number;
  /** Whether multiple-selection mode remains active after the transition. */
  multiple: boolean;
}

export interface ReferenceLine {
  value: number;
  label?: string;
  color?: string;
}

export type ValueFormatter = (value: number) => string;

export interface SharedChartProps {
  accessibilityLabel?: string;
  /** Hint announced for interactive chart values. */
  accessibilityHint?: string;
  formatValue?: ValueFormatter;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  theme?: Partial<ChartTheme>;
}

export interface DonutCenterRenderProps {
  total: number;
  formattedTotal: string;
}

export type DonutCenterContent = ReactNode | ((props: DonutCenterRenderProps) => ReactNode);

export interface ProgressRingCenterRenderProps {
  value: number;
  max: number;
  progress: number;
  formattedValue: string;
  formattedMax: string;
  formattedProgress: string;
}

export type ProgressRingCenterContent =
  | ReactNode
  | ((props: ProgressRingCenterRenderProps) => ReactNode);
