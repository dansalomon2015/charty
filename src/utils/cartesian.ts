import { toNonNegativeFinite } from './scales';

export interface CartesianPadding {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface CartesianFrame {
  plotWidth: number;
  plotHeight: number;
}

export const defaultCartesianPadding: CartesianPadding = {
  top: 18,
  right: 12,
  bottom: 36,
  left: 52,
};

export function getCartesianFrame(
  width: number,
  height: number,
  padding: CartesianPadding = defaultCartesianPadding
): CartesianFrame {
  return {
    plotWidth: Math.max(0, width - padding.left - padding.right),
    plotHeight: Math.max(0, height - padding.top - padding.bottom),
  };
}

export function getYForValue(
  value: number,
  maximum: number,
  plotHeight: number,
  padding: CartesianPadding = defaultCartesianPadding
) {
  if (maximum <= 0) return padding.top + plotHeight;
  return (
    padding.top +
    plotHeight -
    (toNonNegativeFinite(value) / maximum) * plotHeight
  );
}

export function getXForPoint(
  index: number,
  count: number,
  plotWidth: number,
  padding: CartesianPadding = defaultCartesianPadding
) {
  if (count <= 1) return padding.left + plotWidth / 2;
  return padding.left + (index / (count - 1)) * plotWidth;
}

export function createLinearPath(points: readonly { x: number; y: number }[]) {
  return points
    .map(({ x, y }, index) => `${index === 0 ? 'M' : 'L'} ${x} ${y}`)
    .join(' ');
}

export function createAreaPath(
  points: readonly { x: number; y: number }[],
  baseline: number
) {
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];
  if (!firstPoint || !lastPoint) return '';

  return `${createLinearPath(points)} L ${lastPoint.x} ${baseline} L ${firstPoint.x} ${baseline} Z`;
}
