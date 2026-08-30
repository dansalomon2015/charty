// @vitest-environment jsdom

import React from 'react';
import { cleanup, render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { afterEach, describe, expect, it } from 'vitest';
import {
  AreaChart,
  BarChart,
  DonutChart,
  LineChart,
  ProgressRing,
} from '../src';

const cartesianData = [
  { label: 'Jan', value: 42_000 },
  { label: 'Feb', value: 39_000 },
  { label: 'Mar', value: 54_500 },
];

afterEach(cleanup);

describe('chart DOM accessibility', () => {
  it('has no detectable axe violations across all five charts', async () => {
    const { container, getByRole } = render(
      <main>
        <LineChart
          accessibilityHint="Selects this month"
          accessibilityLabel="Monthly trend"
          data={cartesianData}
          onSelectionChange={() => undefined}
          selectedIndices={[0]}
          width={420}
        />
        <AreaChart
          accessibilityHint="Selects this month"
          accessibilityLabel="Savings balance"
          data={cartesianData}
          onSelectionChange={() => undefined}
          selectedIndices={[0]}
          width={420}
        />
        <ProgressRing
          accessibilityLabel="Emergency fund"
          max={100}
          value={72}
        />
        <BarChart
          accessibilityHint="Selects this month"
          accessibilityLabel="Monthly spending"
          data={cartesianData}
          onSelectionChange={() => undefined}
          selectedIndices={[0]}
          width={420}
        />
        <DonutChart
          accessibilityLabel="Spending breakdown"
          data={[
            { label: 'Housing', value: 60 },
            { label: 'Food', value: 40 },
          ]}
        />
      </main>
    );

    const results = await axe(container, {
      // jsdom has no layout/canvas implementation; color contrast is covered
      // separately with deterministic theme calculations.
      rules: { 'color-contrast': { enabled: false } },
    });
    expect(results.violations).toEqual([]);
    expect(
      getByRole('img', {
        name: 'Emergency fund. Progress. 72%. 72 of 100.',
      }).getAttribute('aria-disabled')
    ).toBeNull();
  });

  it('renders selected interactive values as pressed web buttons', () => {
    const { getByRole } = render(
      <BarChart
        accessibilityLabel="Monthly spending"
        data={cartesianData}
        formatValue={(value) => value.toLocaleString('en-US')}
        onSelectionChange={() => undefined}
        selectedIndices={[0]}
        width={420}
      />
    );

    expect(
      getByRole('button', { name: 'Jan, 42,000' }).getAttribute('aria-pressed')
    ).toBe('true');
    expect(
      getByRole('button', { name: 'Feb, 39,000' }).getAttribute('aria-pressed')
    ).toBe('false');
  });
});
