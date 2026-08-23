export const toNonNegativeFinite = (value: number): number =>
  Number.isFinite(value) ? Math.max(0, value) : 0;

export const niceStep = (roughStep: number): number => {
  if (!Number.isFinite(roughStep) || roughStep <= 0) return 1;

  const exponent = Math.floor(Math.log10(roughStep));
  const magnitude = 10 ** exponent;
  const fraction = roughStep / magnitude;
  const niceFraction = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10;

  return niceFraction * magnitude;
};

export const createTicks = (maximum: number, targetCount = 5): number[] => {
  const safeMaximum = toNonNegativeFinite(maximum);
  if (safeMaximum === 0) return [0];

  const safeCount = Math.max(2, Math.floor(targetCount));
  const step = niceStep(safeMaximum / (safeCount - 1));
  const top = Math.ceil(safeMaximum / step) * step;
  const ticks: number[] = [];

  for (let value = 0; value <= top + step / 2; value += step) {
    ticks.push(Number(value.toPrecision(12)));
  }

  return ticks;
};

export const getChartMaximum = (values: number[], referenceValue = 0): number =>
  Math.max(0, toNonNegativeFinite(referenceValue), ...values.map(toNonNegativeFinite));
