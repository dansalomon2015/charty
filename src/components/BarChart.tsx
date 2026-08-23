import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text as NativeText,
  View,
  type GestureResponderEvent,
  type LayoutChangeEvent,
  type ViewStyle,
} from 'react-native';
import Svg, { Line, Rect, Text as SvgText } from 'react-native-svg';
import { resolveTheme } from '../theme';
import type { ChartDatum, ReferenceLine, SharedChartProps } from '../types';
import { defaultValueFormatter } from '../utils/format';
import { createTicks, getChartMaximum, toNonNegativeFinite } from '../utils/scales';
import {
  getBarSelectionTransition,
  hasMultipleSelectionModifier,
  type BarChartSelectionBehavior,
  type BarChartSelectionInteraction,
} from '../utils/selection';

export interface BarChartSelectionEvent {
  /** Gesture that produced the selection transition. */
  type: BarChartSelectionInteraction;
  /** Data index targeted by the gesture. */
  index: number;
  /** Whether multiple-selection mode remains active after the transition. */
  multiple: boolean;
}

export interface BarChartProps extends SharedChartProps {
  data: readonly ChartDatum[];
  width?: number;
  height?: number;
  barWidth?: number;
  referenceLine?: ReferenceLine;
  /** Backwards-compatible single selected index. Ignored when selectedIndices is supplied. */
  selectedIndex?: number;
  /** Controlled selected indices. Supply onSelectionChange to update them. */
  selectedIndices?: readonly number[];
  /** Selection state machine. Multiple selection must be explicitly enabled. */
  selectionBehavior?: BarChartSelectionBehavior;
  emptyLabel?: string;
  /** Backwards-compatible callback invoked for ordinary presses. */
  onBarPress?: (datum: ChartDatum, index: number) => void;
  /** Receives the next selection after a press or enabled long press. */
  onSelectionChange?: (indices: number[], event: BarChartSelectionEvent) => void;
}

const PADDING = { top: 18, right: 12, bottom: 36, left: 52 } as const;

export function BarChart({
  data,
  width,
  height = 240,
  barWidth = 32,
  referenceLine,
  selectedIndex,
  selectedIndices,
  selectionBehavior = 'single',
  emptyLabel = 'No data',
  accessibilityLabel = 'Bar chart',
  formatValue = defaultValueFormatter,
  labelStyle,
  style,
  theme,
  onBarPress,
  onSelectionChange,
}: BarChartProps) {
  const [measuredWidth, setMeasuredWidth] = useState(0);
  const [multipleSelectionActive, setMultipleSelectionActive] = useState(false);
  const suppressNextPress = useRef(false);
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
  const resolvedSelectedIndices = useMemo(
    () => selectedIndices ?? (selectedIndex === undefined ? [] : [selectedIndex]),
    [selectedIndex, selectedIndices]
  );
  const selectedIndexSet = useMemo(
    () => new Set(resolvedSelectedIndices),
    [resolvedSelectedIndices]
  );

  useEffect(() => {
    if (selectionBehavior === 'single' || resolvedSelectedIndices.length === 0) {
      setMultipleSelectionActive(false);
    }
  }, [resolvedSelectedIndices.length, selectionBehavior]);

  const changeSelection = (
    datum: ChartDatum,
    index: number,
    interaction: BarChartSelectionInteraction
  ) => {
    if (interaction === 'press') onBarPress?.(datum, index);
    if (!onSelectionChange) return;

    const transition = getBarSelectionTransition(
      resolvedSelectedIndices,
      index,
      selectionBehavior,
      multipleSelectionActive,
      interaction
    );
    setMultipleSelectionActive(transition.multiple);
    onSelectionChange(transition.indices, {
      type: interaction,
      index,
      multiple: transition.multiple,
    });
  };

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
              const isSelected = selectedIndexSet.has(index);
              return (
                <React.Fragment key={`${datum.label}-${index}`}>
                  <Rect
                    x={x}
                    y={y}
                    width={resolvedBarWidth}
                    height={PADDING.top + plotHeight - y}
                    rx={Math.min(4, resolvedBarWidth / 2)}
                    fill={datum.color ?? (isSelected ? colors.selectedColor : colors.barColor)}
                    opacity={selectedIndexSet.size === 0 || isSelected ? 1 : 0.58}
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
            const isSelected = selectedIndexSet.has(index);
            const valueLabel = datum.accessibilityLabel ?? `${datum.label}, ${formatValue(datum.value)}`;
            return (
              <Pressable
                accessibilityLabel={valueLabel}
                accessibilityRole={onBarPress || onSelectionChange ? 'button' : 'text'}
                accessibilityState={{ selected: isSelected }}
                disabled={!onBarPress && !onSelectionChange}
                key={`${datum.label}-${index}-target`}
                onLongPress={
                  selectionBehavior === 'multiple' && onSelectionChange
                    ? () => {
                        suppressNextPress.current = true;
                        changeSelection(datum, index, 'longPress');
                      }
                    : undefined
                }
                onPress={(event: GestureResponderEvent) => {
                  if (suppressNextPress.current) {
                    suppressNextPress.current = false;
                    return;
                  }
                  changeSelection(
                    datum,
                    index,
                    selectionBehavior === 'multiple' &&
                      hasMultipleSelectionModifier(event)
                      ? 'modifierPress'
                      : 'press'
                  );
                }}
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
