import React from 'react';
import type { ChartGradient } from '../types';
import {
  CartesianLineChart,
  type LineChartProps,
  type LineChartSelectionEvent,
} from './LineChart';

export type AreaChartSelectionEvent = LineChartSelectionEvent;

export interface AreaChartProps extends LineChartProps {
  /** Solid fill used below the line when fillGradient is not supplied. */
  fillColor?: string;
  /** Vertical top-to-bottom gradient used below the line. */
  fillGradient?: ChartGradient;
  /** Opacity applied to the full filled area. */
  fillOpacity?: number;
}

export function AreaChart({
  fillColor,
  fillGradient,
  fillOpacity,
  ...props
}: AreaChartProps) {
  return (
    <CartesianLineChart
      {...props}
      areaFill
      areaFillColor={fillColor}
      areaFillGradient={fillGradient}
      areaFillOpacity={fillOpacity}
    />
  );
}
