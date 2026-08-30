import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text as NativeText,
  View,
  type GestureResponderEvent,
  type LayoutChangeEvent,
  type ViewStyle,
} from 'react-native';
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Line,
  Path,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import { resolveTheme } from '../theme';
import type {
  ChartDatum,
  ChartGradient,
  ChartSelectionBehavior,
  ChartSelectionEvent,
  ChartSelectionInteraction,
  ReferenceLine,
  SharedChartProps,
} from '../types';
import {
  createLinearPath,
  defaultCartesianPadding,
  getCartesianFrame,
  getXForPoint,
  getYForValue,
} from '../utils/cartesian';
import { defaultValueFormatter } from '../utils/format';
import { createTicks, getChartMaximum, toNonNegativeFinite } from '../utils/scales';
import {
  getSelectionTransition,
  hasMultipleSelectionModifier,
} from '../utils/selection';

export type LineChartSelectionEvent = ChartSelectionEvent;

export interface LineChartProps extends SharedChartProps {
  data: readonly ChartDatum[];
  width?: number;
  height?: number;
  strokeWidth?: number;
  showPoints?: boolean;
  pointRadius?: number;
  lineColor?: string;
  lineGradient?: ChartGradient;
  referenceLine?: ReferenceLine;
  selectedIndex?: number;
  selectedIndices?: readonly number[];
  selectionBehavior?: ChartSelectionBehavior;
  emptyLabel?: string;
  onPointPress?: (datum: ChartDatum, index: number) => void;
  onSelectionChange?: (indices: number[], event: LineChartSelectionEvent) => void;
}

const PADDING = defaultCartesianPadding;

function clampOpacity(value: number | undefined, fallback: number) {
  if (value === undefined || !Number.isFinite(value)) return fallback;
  return Math.max(0, Math.min(1, value));
}

export function LineChart({
  data,
  width,
  height = 240,
  strokeWidth = 3,
  showPoints = true,
  pointRadius = 4,
  lineColor,
  lineGradient,
  referenceLine,
  selectedIndex,
  selectedIndices,
  selectionBehavior = 'single',
  emptyLabel = 'No data',
  accessibilityLabel = 'Line chart',
  formatValue = defaultValueFormatter,
  labelStyle,
  style,
  theme,
  onPointPress,
  onSelectionChange,
}: LineChartProps) {
  const [measuredWidth, setMeasuredWidth] = useState(0);
  const [multipleSelectionActive, setMultipleSelectionActive] = useState(false);
  const suppressNextPress = useRef(false);
  const reactId = useId();
  const gradientId = `charty-line-${reactId.replace(/:/g, '')}`;
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
  const { plotWidth, plotHeight } = getCartesianFrame(chartWidth, height, PADDING);
  const points = safeData.map((datum, index) => ({
    x: getXForPoint(index, safeData.length, plotWidth, PADDING),
    y: getYForValue(datum.value, scaleMaximum, plotHeight, PADDING),
  }));
  const path = createLinearPath(points);
  const resolvedSelectedIndices = useMemo(
    () => selectedIndices ?? (selectedIndex === undefined ? [] : [selectedIndex]),
    [selectedIndex, selectedIndices]
  );
  const selectedIndexSet = useMemo(
    () => new Set(resolvedSelectedIndices),
    [resolvedSelectedIndices]
  );
  const resolvedLineColor = lineColor ?? colors.lineColor;

  useEffect(() => {
    if (selectionBehavior === 'single' || resolvedSelectedIndices.length === 0) {
      setMultipleSelectionActive(false);
    }
  }, [resolvedSelectedIndices.length, selectionBehavior]);

  const changeSelection = (
    datum: ChartDatum,
    index: number,
    interaction: ChartSelectionInteraction
  ) => {
    if (interaction === 'press') onPointPress?.(datum, index);
    if (!onSelectionChange) return;

    const transition = getSelectionTransition(
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
    getYForValue(value, scaleMaximum, plotHeight, PADDING);
  const stepWidth = safeData.length > 1 ? plotWidth / (safeData.length - 1) : plotWidth;

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
            {lineGradient ? (
              <Defs>
                <LinearGradient id={gradientId} x1="0%" x2="100%" y1="0%" y2="0%">
                  <Stop
                    offset="0%"
                    stopColor={lineGradient.startColor}
                    stopOpacity={clampOpacity(lineGradient.startOpacity, 1)}
                  />
                  <Stop
                    offset="100%"
                    stopColor={lineGradient.endColor}
                    stopOpacity={clampOpacity(lineGradient.endOpacity, 1)}
                  />
                </LinearGradient>
              </Defs>
            ) : null}

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

            <Path
              d={path}
              fill="none"
              stroke={lineGradient ? `url(#${gradientId})` : resolvedLineColor}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={Math.max(1, strokeWidth)}
            />

            {points.map((point, index) => {
              const datum = safeData[index];
              if (!datum) return null;
              const isSelected = selectedIndexSet.has(index);
              return (
                <React.Fragment key={`${datum.label}-${index}`}>
                  {showPoints || isSelected ? (
                    <Circle
                      cx={point.x}
                      cy={point.y}
                      fill={isSelected ? colors.selectedColor : datum.color ?? colors.pointColor}
                      opacity={selectedIndexSet.size === 0 || isSelected ? 1 : 0.55}
                      r={isSelected ? Math.max(3, pointRadius) + 2 : Math.max(2, pointRadius)}
                      stroke={isSelected ? colors.backgroundColor : 'transparent'}
                      strokeWidth={isSelected ? 2 : 0}
                    />
                  ) : null}
                  <SvgText
                    x={point.x}
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
            const point = points[index];
            if (!point) return null;
            const isSelected = selectedIndexSet.has(index);
            const left = index === 0 ? PADDING.left : point.x - stepWidth / 2;
            const right =
              index === safeData.length - 1
                ? chartWidth - PADDING.right
                : point.x + stepWidth / 2;
            const valueLabel =
              datum.accessibilityLabel ?? `${datum.label}, ${formatValue(datum.value)}`;

            return (
              <Pressable
                accessibilityLabel={valueLabel}
                accessibilityRole={onPointPress || onSelectionChange ? 'button' : 'text'}
                accessibilityState={{ selected: isSelected }}
                disabled={!onPointPress && !onSelectionChange}
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
                style={[
                  styles.pointTarget,
                  {
                    left,
                    top: PADDING.top,
                    width: Math.max(1, right - left),
                    height: plotHeight,
                  } as ViewStyle,
                ]}
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
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  emptyText: {
    fontSize: 14,
  },
  pointTarget: {
    position: 'absolute',
  },
});
