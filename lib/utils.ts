export type MaybeError<T> = T | { error: string };

export function percentageChange(oldNumber: number, newNumber: number) {
  return ((oldNumber - newNumber) / oldNumber) * 100;
}
