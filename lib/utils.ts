export type MaybeError<T> = T | { error: string };

export function percentageChange(oldNumber: number, newNumber: number) {
  return ((oldNumber - newNumber) / oldNumber) * 100;
}

export function percentage(partialValue: number, totalValue: number) {
  return (100 * partialValue) / totalValue;
}

export function getKeyByValue<T, K>(object: T, value: K) {
  return Object.keys(object).find((key) => object[key] === value);
}
