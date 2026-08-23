export type BarChartSelectionBehavior = 'single' | 'multiple';
export type BarChartSelectionInteraction = 'press' | 'longPress' | 'modifierPress';

export interface BarChartSelectionTransition {
  indices: number[];
  multiple: boolean;
}

function uniqueIndices(indices: readonly number[]) {
  return [...new Set(indices.filter((index) => Number.isInteger(index) && index >= 0))];
}

export function hasMultipleSelectionModifier(event: unknown) {
  if (!event || typeof event !== 'object') return false;

  const candidate = event as {
    ctrlKey?: boolean;
    metaKey?: boolean;
    nativeEvent?: { ctrlKey?: boolean; metaKey?: boolean };
  };

  return Boolean(
    candidate.ctrlKey ||
      candidate.metaKey ||
      candidate.nativeEvent?.ctrlKey ||
      candidate.nativeEvent?.metaKey
  );
}

export function getBarSelectionTransition(
  selectedIndices: readonly number[],
  index: number,
  behavior: BarChartSelectionBehavior,
  multiple: boolean,
  interaction: BarChartSelectionInteraction
): BarChartSelectionTransition {
  const current = uniqueIndices(selectedIndices);

  const startsMultipleSelection =
    interaction === 'longPress' || interaction === 'modifierPress';

  if (behavior === 'multiple' && startsMultipleSelection && !multiple) {
    return { indices: [index], multiple: true };
  }

  if (behavior === 'multiple' && multiple) {
    const indices = current.includes(index)
      ? current.filter((selectedIndex) => selectedIndex !== index)
      : [...current, index];

    return { indices, multiple: indices.length > 0 };
  }

  const isOnlySelectedIndex = current.length === 1 && current[0] === index;
  return {
    indices: isOnlySelectedIndex ? [] : [index],
    multiple: false,
  };
}
