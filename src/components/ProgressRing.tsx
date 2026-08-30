import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { resolveTheme } from '../theme';
import type {
  ProgressRingCenterContent,
  SharedChartProps,
} from '../types';
import { defaultValueFormatter } from '../utils/format';
import { normalizeProgress } from '../utils/progress';

export interface ProgressRingProps extends SharedChartProps {
  value: number;
  max?: number;
  size?: number;
  thickness?: number;
  color?: string;
  trackColor?: string;
  label?: string;
  showValue?: boolean;
  centerContent?: ProgressRingCenterContent;
  emptyLabel?: string;
  onPress?: (value: number, max: number, progress: number) => void;
}

export function ProgressRing({
  value,
  max = 100,
  size = 180,
  thickness = 16,
  color,
  trackColor,
  label = 'Progress',
  showValue = true,
  centerContent,
  emptyLabel = 'Invalid maximum',
  accessibilityLabel = 'Progress ring',
  accessibilityHint,
  formatValue = defaultValueFormatter,
  labelStyle,
  style,
  theme,
  onPress,
}: ProgressRingProps) {
  const colors = useMemo(() => resolveTheme(theme), [theme]);
  const safeSize = Math.max(24, size);
  const safeThickness = Math.min(Math.max(1, thickness), safeSize / 2);
  const radius = (safeSize - safeThickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const normalized = normalizeProgress(value, max);
  const progressLength = normalized.progress * circumference;
  const formattedValue = formatValue(normalized.value);
  const formattedMax = formatValue(normalized.max);
  const formattedProgress = `${Math.round(normalized.progress * 100)}%`;
  const centerRenderProps = {
    ...normalized,
    formattedValue,
    formattedMax,
    formattedProgress,
  };

  if (normalized.max === 0) {
    return (
      <View
        accessibilityLabel={`${accessibilityLabel}. ${emptyLabel}`}
        accessibilityRole="image"
        style={[
          styles.empty,
          {
            minHeight: safeSize,
            backgroundColor: colors.backgroundColor,
          },
          style,
        ]}
      >
        <Text style={[styles.emptyText, { color: colors.labelColor }, labelStyle]}>
          {emptyLabel}
        </Text>
      </View>
    );
  }

  const accessibleValue = `${accessibilityLabel}. ${label}. ${formattedProgress}. ${formattedValue} of ${formattedMax}.`;

  const ring = (
    <View style={{ height: safeSize, width: safeSize }}>
      <Svg height={safeSize} width={safeSize}>
        <Circle
          cx={safeSize / 2}
          cy={safeSize / 2}
          fill="transparent"
          r={radius}
          stroke={trackColor ?? colors.ringTrackColor}
          strokeWidth={safeThickness}
        />
        {normalized.progress > 0 ? (
          <G transform={`rotate(-90 ${safeSize / 2} ${safeSize / 2})`}>
            <Circle
              cx={safeSize / 2}
              cy={safeSize / 2}
              fill="transparent"
              r={radius}
              stroke={color ?? colors.ringColor}
              strokeDasharray={`${progressLength} ${circumference - progressLength}`}
              strokeLinecap="round"
              strokeWidth={safeThickness}
            />
          </G>
        ) : null}
      </Svg>

      <View style={styles.center}>
        {typeof centerContent === 'function' ? (
          centerContent(centerRenderProps)
        ) : centerContent ? (
          centerContent
        ) : (
          <>
            <Text style={[styles.label, { color: colors.labelColor }, labelStyle]}>
              {label}
            </Text>
            <Text style={[styles.progress, { color: colors.valueColor }]}>
              {formattedProgress}
            </Text>
            {showValue ? (
              <Text style={[styles.value, { color: colors.labelColor }]}>
                {formattedValue} / {formattedMax}
              </Text>
            ) : null}
          </>
        )}
      </View>
    </View>
  );
  const containerStyle = [
    styles.root,
    {
      minHeight: safeSize,
      backgroundColor: colors.backgroundColor,
    },
    style,
  ];

  if (!onPress) {
    return (
      <View
        accessible
        accessibilityLabel={accessibleValue}
        accessibilityRole="image"
        style={containerStyle}
      >
        {ring}
      </View>
    );
  }

  return (
    <Pressable
      accessibilityHint={accessibilityHint}
      accessibilityLabel={accessibleValue}
      accessibilityRole="button"
      onPress={() =>
        onPress(normalized.value, normalized.max, normalized.progress)
      }
      style={containerStyle}
    >
      {ring}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    pointerEvents: 'none',
    position: 'absolute',
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
  label: {
    fontSize: 12,
  },
  progress: {
    fontSize: 28,
    fontWeight: '800',
    marginTop: 2,
  },
  root: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 11,
    marginTop: 3,
  },
});
