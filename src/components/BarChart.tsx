import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Pressable,
  PixelRatio,
  Platform,
  StyleSheet,
  Text as NativeText,
  View,
  type GestureResponderEvent,
  type LayoutChangeEvent,
  type ViewStyle,
} from 'react-native';
import Svg, { Line, Rect, Text as SvgText } from 'react-native-svg';
import { resolveTheme } from '../theme';
import type {
  ChartDatum,
  ChartSelectionEvent,
  ReferenceLine,
  SharedChartProps,
} from '../types';
import {
  defaultCartesianPadding,
  getCartesianFrame,
  getYForValue,
} from '../utils/cartesian';
import {
  getWebToggleAccessibilityProps,
  normalizeFontScale,
  scaleCartesianPadding,
} from '../utils/accessibility';
import { defaultValueFormatter } from '../utils/format';
import { createTicks, getChartMaximum, toNonNegativeFinite } from '../utils/scales';
import {
  getBarSelectionTransition,
  hasMultipleSelectionModifier,
  type BarChartSelectionBehavior,
  type BarChartSelectionInteraction,
} from '../utils/selection';

export type BarChartSelectionEvent = ChartSelectionEvent;

export interface BarChartProps extends SharedChartProps {
  data: readonly ChartDatum[];
  width?: number;
  height?: number;
  barWidth?: number;
  /** Overrides the system font scale for SVG labels, clamped between 1 and 2. */
  fontScale?: number;
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

export function BarChart({
  data,
  width,
  height = 240,
  barWidth = 32,
  fontScale,
  referenceLine,
  selectedIndex,
  selectedIndices,
  selectionBehavior = 'single',
  emptyLabel = 'No data',
  accessibilityLabel = 'Bar chart',
  accessibilityHint,
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
  const resolvedFontScale = normalizeFontScale(
    fontScale ?? PixelRatio.getFontScale()
  );
  const padding = scaleCartesianPadding(
    defaultCartesianPadding,
    resolvedFontScale
  );
  const svgFontSize = 11 * resolvedFontScale;
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
  const { plotWidth, plotHeight } = getCartesianFrame(chartWidth, height, padding);
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
    getYForValue(value, scaleMaximum, plotHeight, padding);

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
                    x1={padding.left}
                    x2={chartWidth - padding.right}
                    y1={y}
                    y2={y}
                    stroke={colors.gridColor}
                    strokeWidth={1}
                  />
                  <SvgText
                    x={padding.left - 8 * resolvedFontScale}
                    y={y + 4 * resolvedFontScale}
                    fill={colors.labelColor}
                    fontSize={svgFontSize}
                    textAnchor="end"
                  >
                    {formatValue(tick)}
                  </SvgText>
                </React.Fragment>
              );
            })}

            {safeData.map((datum, index) => {
              const x = padding.left + slotWidth * index + (slotWidth - resolvedBarWidth) / 2;
              const y = yForValue(datum.value);
              const isSelected = selectedIndexSet.has(index);
              return (
                <React.Fragment key={`${datum.label}-${index}`}>
                  <Rect
                    x={x}
                    y={y}
                    width={resolvedBarWidth}
                    height={padding.top + plotHeight - y}
                    rx={Math.min(4, resolvedBarWidth / 2)}
                    fill={datum.color ?? (isSelected ? colors.selectedColor : colors.barColor)}
                    opacity={selectedIndexSet.size === 0 || isSelected ? 1 : 0.58}
                  />
                  <SvgText
                    x={x + resolvedBarWidth / 2}
                    y={height - 12 * resolvedFontScale}
                    fill={colors.labelColor}
                    fontSize={svgFontSize}
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
                  x1={padding.left}
                  x2={chartWidth - padding.right}
                  y1={yForValue(referenceLine.value)}
                  y2={yForValue(referenceLine.value)}
                  stroke={referenceLine.color ?? colors.referenceLineColor}
                  strokeDasharray="6 4"
                  strokeWidth={2}
                />
                {referenceLine.label ? (
                  <SvgText
                    x={chartWidth - padding.right}
                    y={yForValue(referenceLine.value) - 6 * resolvedFontScale}
                    fill={referenceLine.color ?? colors.referenceLineColor}
                    fontSize={svgFontSize}
                    textAnchor="end"
                  >
                    {referenceLine.label}
                  </SvgText>
                ) : null}
              </>
            ) : null}
          </Svg>

          {safeData.map((datum, index) => {
            const x = padding.left + slotWidth * index;
            const isSelected = selectedIndexSet.has(index);
            const valueLabel = datum.accessibilityLabel ?? `${datum.label}, ${formatValue(datum.value)}`;
            return (
              <Pressable
                accessibilityLabel={valueLabel}
                accessibilityHint={
                  onBarPress || onSelectionChange ? accessibilityHint : undefined
                }
                accessibilityRole={onBarPress || onSelectionChange ? 'button' : 'text'}
                accessibilityState={{ selected: isSelected }}
                {...getWebToggleAccessibilityProps(
                  isSelected,
                  Platform.OS === 'web' && Boolean(onBarPress || onSelectionChange)
                )}
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
                style={[styles.barTarget, { left: x, top: padding.top, width: slotWidth, height: plotHeight } as ViewStyle]}
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
