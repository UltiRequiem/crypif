export type MaybeError<T> = T | { error: string };

export function percentageChange(oldNumber: number, newNumber: number) {
  return ((oldNumber - newNumber) / oldNumber) * 100;
}

export function percentage(partialValue: number, totalValue: number) {
  return (100 * partialValue) / totalValue;
}

export async function fetcher(url: string) {
  const response = await fetch(url);
  return response.json();
}
