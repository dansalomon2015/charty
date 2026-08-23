import { describe, expect, it } from 'vitest';
import {
  getBarSelectionTransition,
  hasMultipleSelectionModifier,
} from '../src/utils/selection';

describe('bar chart selection', () => {
  it('toggles a selection in single mode', () => {
    expect(getBarSelectionTransition([], 1, 'single', false, 'press')).toEqual({
      indices: [1],
      multiple: false,
    });
    expect(getBarSelectionTransition([1], 1, 'single', false, 'press')).toEqual({
      indices: [],
      multiple: false,
    });
    expect(getBarSelectionTransition([1], 2, 'single', false, 'press')).toEqual({
      indices: [2],
      multiple: false,
    });
  });

  it('starts multiple selection with the long-pressed index', () => {
    expect(
      getBarSelectionTransition([0], 2, 'multiple', false, 'longPress')
    ).toEqual({ indices: [2], multiple: true });
  });

  it('adds and removes indices while multiple selection is active', () => {
    expect(
      getBarSelectionTransition([1], 3, 'multiple', true, 'press')
    ).toEqual({ indices: [1, 3], multiple: true });
    expect(
      getBarSelectionTransition([1, 3], 1, 'multiple', true, 'press')
    ).toEqual({ indices: [3], multiple: true });
  });

  it('returns to normal mode when the multiple selection becomes empty', () => {
    expect(
      getBarSelectionTransition([3], 3, 'multiple', true, 'press')
    ).toEqual({ indices: [], multiple: false });
  });

  it('normalizes duplicate and invalid controlled indices', () => {
    expect(
      getBarSelectionTransition([1, 1, -1, 1.5], 2, 'multiple', true, 'press')
    ).toEqual({ indices: [1, 2], multiple: true });
  });

  it('starts multiple selection with a web modifier click', () => {
    expect(
      getBarSelectionTransition([0], 2, 'multiple', false, 'modifierPress')
    ).toEqual({ indices: [2], multiple: true });
  });

  it('detects Control and Command modifiers on web press events', () => {
    expect(hasMultipleSelectionModifier({ ctrlKey: true })).toBe(true);
    expect(hasMultipleSelectionModifier({ nativeEvent: { metaKey: true } })).toBe(true);
    expect(hasMultipleSelectionModifier({ nativeEvent: {} })).toBe(false);
  });
});
