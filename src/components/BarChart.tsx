import React, { useMemo, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text as NativeText,
  View,
  type LayoutChangeEvent,
  type ViewStyle,
} from 'react-native';
import Svg, { Line, Rect, Text as SvgText } from 'react-native-svg';
import { resolveTheme } from '../theme';
import type { ChartDatum, ReferenceLine, SharedChartProps } from '../types';
import { defaultValueFormatter } from '../utils/format';
import { createTicks, getChartMaximum, toNonNegativeFinite } from '../utils/scales';

export interface BarChartProps extends SharedChartProps {
  data: readonly ChartDatum[];
  width?: number;
  height?: number;
  barWidth?: number;
  referenceLine?: ReferenceLine;
  selectedIndex?: number;
  emptyLabel?: string;
  onBarPress?: (datum: ChartDatum, index: number) => void;
}

const PADDING = { top: 18, right: 12, bottom: 36, left: 52 } as const;

export function BarChart({
  data,
  width,
  height = 240,
  barWidth = 32,
  referenceLine,
  selectedIndex,
  emptyLabel = 'No data',
  accessibilityLabel = 'Bar chart',
  formatValue = defaultValueFormatter,
  labelStyle,
  style,
  theme,
  onBarPress,
}: BarChartProps) {
  const [measuredWidth, setMeasuredWidth] = useState(0);
  const colors = useMemo(() => resolveTheme(theme), [theme]);
  const chartWidth = width ?? measuredWidth;
  const safeData = useMemo(
    () => data.map((datum) => ({ ...datum, value: toNonNegativeFinite(datum.value) })),
    [data]
  );
  const maximum = getChartMaximum(
    safeData.map(({ value }) => value),
    referenceLine?.value ?? 0
  );
  const ticks = createTicks(maximum);
  const scaleMaximum = ticks[ticks.length - 1] ?? 0;
  const plotWidth = Math.max(0, chartWidth - PADDING.left - PADDING.right);
  const plotHeight = Math.max(0, height - PADDING.top - PADDING.bottom);
  const slotWidth = safeData.length > 0 ? plotWidth / safeData.length : plotWidth;
  const resolvedBarWidth = Math.max(2, Math.min(barWidth, slotWidth * 0.68));

  const onLayout = (event: LayoutChangeEvent) => {
    if (width === undefined) setMeasuredWidth(event.nativeEvent.layout.width);
  };

  if (safeData.length === 0 || maximum === 0) {
    return (
      <View
        accessibilityLabel={`${accessibilityLabel}. ${emptyLabel}`}
        accessibilityRole="image"
        onLayout={onLayout}
        style={[styles.empty, { height, backgroundColor: colors.backgroundColor }, style]}
      >
        <NativeText style={[styles.emptyText, { color: colors.labelColor }, labelStyle]}>
          {emptyLabel}
        </NativeText>
      </View>
    );
  }

  const yForValue = (value: number) =>
    PADDING.top + plotHeight - (toNonNegativeFinite(value) / scaleMaximum) * plotHeight;

  return (
    <View onLayout={onLayout} style={[{ height, backgroundColor: colors.backgroundColor }, style]}>
      {chartWidth > 0 ? (
        <>
          <View
            accessible
            accessibilityLabel={`${accessibilityLabel}. ${safeData.length} values.`}
            accessibilityRole="image"
            style={styles.accessibilitySummary}
          />
          <Svg width={chartWidth} height={height}>
            {ticks.map((tick) => {
              const y = yForValue(tick);
              return (
                <React.Fragment key={tick}>
                  <Line
                    x1={PADDING.left}
                    x2={chartWidth - PADDING.right}
                    y1={y}
                    y2={y}
                    stroke={colors.gridColor}
                    strokeWidth={1}
                  />
                  <SvgText
                    x={PADDING.left - 8}
                    y={y + 4}
                    fill={colors.labelColor}
                    fontSize={11}
                    textAnchor="end"
                  >
                    {formatValue(tick)}
                  </SvgText>
                </React.Fragment>
              );
            })}

            {safeData.map((datum, index) => {
              const x = PADDING.left + slotWidth * index + (slotWidth - resolvedBarWidth) / 2;
              const y = yForValue(datum.value);
              const isSelected = index === selectedIndex;
              return (
                <React.Fragment key={`${datum.label}-${index}`}>
                  <Rect
                    x={x}
                    y={y}
                    width={resolvedBarWidth}
                    height={PADDING.top + plotHeight - y}
                    rx={Math.min(4, resolvedBarWidth / 2)}
                    fill={datum.color ?? (isSelected ? colors.selectedColor : colors.barColor)}
                    opacity={selectedIndex === undefined || isSelected ? 1 : 0.58}
                  />
                  <SvgText
                    x={x + resolvedBarWidth / 2}
                    y={height - 12}
                    fill={colors.labelColor}
                    fontSize={11}
                    textAnchor="middle"
                  >
                    {datum.label}
                  </SvgText>
                </React.Fragment>
              );
            })}

            {referenceLine && referenceLine.value >= 0 ? (
              <>
                <Line
                  x1={PADDING.left}
                  x2={chartWidth - PADDING.right}
                  y1={yForValue(referenceLine.value)}
                  y2={yForValue(referenceLine.value)}
                  stroke={referenceLine.color ?? colors.referenceLineColor}
                  strokeDasharray="6 4"
                  strokeWidth={2}
                />
                {referenceLine.label ? (
                  <SvgText
                    x={chartWidth - PADDING.right}
                    y={yForValue(referenceLine.value) - 6}
                    fill={referenceLine.color ?? colors.referenceLineColor}
                    fontSize={11}
                    textAnchor="end"
                  >
                    {referenceLine.label}
                  </SvgText>
                ) : null}
              </>
            ) : null}
          </Svg>

          {safeData.map((datum, index) => {
            const x = PADDING.left + slotWidth * index;
            const valueLabel = datum.accessibilityLabel ?? `${datum.label}, ${formatValue(datum.value)}`;
            return (
              <Pressable
                accessibilityLabel={valueLabel}
                accessibilityRole={onBarPress ? 'button' : 'text'}
                disabled={!onBarPress}
                key={`${datum.label}-${index}-target`}
                onPress={() => onBarPress?.(datum, index)}
                style={[styles.barTarget, { left: x, top: PADDING.top, width: slotWidth, height: plotHeight } as ViewStyle]}
              />
            );
          })}
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  accessibilitySummary: {
    height: 1,
    opacity: 0,
    position: 'absolute',
    width: 1,
  },
  barTarget: {
    position: 'absolute',
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  emptyText: {
    fontSize: 14,
  },
});
