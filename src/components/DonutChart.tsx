import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { resolveTheme } from '../theme';
import type { ChartDatum, DonutCenterContent, SharedChartProps } from '../types';
import { defaultValueFormatter, formatPercent } from '../utils/format';
import { toNonNegativeFinite } from '../utils/scales';

export interface DonutChartProps extends SharedChartProps {
  data: readonly ChartDatum[];
  size?: number;
  thickness?: number;
  gapAngle?: number;
  centerContent?: DonutCenterContent;
  showLegend?: boolean;
  emptyLabel?: string;
  onSlicePress?: (datum: ChartDatum, index: number) => void;
}

export function DonutChart({
  data,
  size = 200,
  thickness = 20,
  gapAngle = 2,
  centerContent,
  showLegend = true,
  emptyLabel = 'No data',
  accessibilityLabel = 'Donut chart',
  formatValue = defaultValueFormatter,
  labelStyle,
  style,
  theme,
  onSlicePress,
}: DonutChartProps) {
  const colors = useMemo(() => resolveTheme(theme), [theme]);
  const safeThickness = Math.min(Math.max(1, thickness), size / 2);
  const radius = (size - safeThickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const safeData = useMemo(
    () =>
      data
        .map((datum, originalIndex) => ({
          ...datum,
          value: toNonNegativeFinite(datum.value),
          originalIndex,
        }))
        .filter(({ value }) => value > 0),
    [data]
  );
  const total = safeData.reduce((sum, datum) => sum + datum.value, 0);
  const gapLength = Math.max(0, Math.min(12, gapAngle)) / 360 * circumference;
  let offset = 0;

  if (total === 0) {
    return (
      <View
        accessibilityLabel={`${accessibilityLabel}. ${emptyLabel}`}
        accessibilityRole="image"
        style={[styles.empty, { minHeight: size, backgroundColor: colors.backgroundColor }, style]}
      >
        <Text style={[styles.emptyText, { color: colors.labelColor }, labelStyle]}>{emptyLabel}</Text>
      </View>
    );
  }

  const formattedTotal = formatValue(total);

  return (
    <View style={[styles.root, { backgroundColor: colors.backgroundColor }, style]}>
      <View style={{ height: size, width: size }}>
        <View
          accessible
          accessibilityLabel={`${accessibilityLabel}. Total ${formattedTotal}. ${safeData.length} categories.`}
          accessibilityRole="image"
          style={styles.accessibilityItem}
        />
        <Svg height={size} width={size}>
          <G transform={`rotate(-90 ${size / 2} ${size / 2})`}>
            {safeData.map((datum, index) => {
              const segmentLength = (datum.value / total) * circumference;
              const visibleLength = Math.max(0, segmentLength - gapLength);
              const segment = (
                <Circle
                  key={`${datum.label}-${datum.originalIndex}`}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke={datum.color ?? colors.donutColors[index % colors.donutColors.length]}
                  strokeDasharray={`${visibleLength} ${circumference - visibleLength}`}
                  strokeDashoffset={-offset}
                  strokeWidth={safeThickness}
                />
              );
              offset += segmentLength;
              return segment;
            })}
          </G>
        </Svg>

        <View style={styles.center}>
          {typeof centerContent === 'function' ? (
            centerContent({ total, formattedTotal })
          ) : centerContent ? (
            centerContent
          ) : (
            <>
              <Text style={[styles.totalLabel, { color: colors.labelColor }]}>Total</Text>
              <Text style={[styles.totalValue, { color: colors.valueColor }]}>{formattedTotal}</Text>
            </>
          )}
        </View>
      </View>

      {safeData.map((datum, index) => {
        const percent = formatPercent(datum.value, total);
        const itemLabel =
          datum.accessibilityLabel ?? `${datum.label}, ${formatValue(datum.value)}, ${percent}`;
        return (
          <Pressable
            accessibilityLabel={itemLabel}
            accessibilityRole={onSlicePress ? 'button' : 'text'}
            disabled={!onSlicePress}
            key={`${datum.label}-${datum.originalIndex}-accessible`}
            onPress={() => onSlicePress?.(datum, datum.originalIndex)}
            style={showLegend ? styles.legendItem : styles.accessibilityItem}
          >
            {showLegend ? (
              <>
                <View
                  accessible={false}
                  style={[
                    styles.swatch,
                    { backgroundColor: datum.color ?? colors.donutColors[index % colors.donutColors.length] },
                  ]}
                />
                <Text style={[styles.legendLabel, { color: colors.labelColor }, labelStyle]} numberOfLines={1}>
                  {datum.label}
                </Text>
                <Text style={[styles.legendValue, { color: colors.valueColor }]}>{percent}</Text>
              </>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}

/** @deprecated Use DonutChart. This alias will be removed in 1.0. */
export const PieChart = DonutChart;

const styles = StyleSheet.create({
  accessibilityItem: {
    height: 1,
    opacity: 0,
    position: 'absolute',
    width: 1,
  },
  center: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    pointerEvents: 'box-none',
    right: 0,
    top: 0,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  emptyText: {
    fontSize: 14,
  },
  legendItem: {
    alignItems: 'center',
    flexDirection: 'row',
    minHeight: 36,
    width: '100%',
  },
  legendLabel: {
    flex: 1,
    fontSize: 13,
    marginRight: 12,
  },
  legendValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  root: {
    alignItems: 'center',
    gap: 4,
  },
  swatch: {
    borderRadius: 5,
    height: 10,
    marginRight: 8,
    width: 10,
  },
  totalLabel: {
    fontSize: 12,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 2,
  },
});
