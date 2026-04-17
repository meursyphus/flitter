const KEY = "__flitterTextMeasureCache__";
const CAPACITY = 2000;
const SEPARATOR = "\x1f";

const g = globalThis as unknown as Record<
  string,
  Map<string, number> | undefined
>;
const cache: Map<string, number> =
  g[KEY] ?? (g[KEY] = new Map<string, number>());

function makeKey(text: string, font: string): string {
  return `${text}${SEPARATOR}${font}`;
}

export function getCachedWidth(
  text: string,
  font: string,
): number | undefined {
  const key = makeKey(text, font);
  const value = cache.get(key);
  if (value === undefined) return undefined;
  cache.delete(key);
  cache.set(key, value);
  return value;
}

export function setCachedWidth(
  text: string,
  font: string,
  width: number,
): void {
  const key = makeKey(text, font);
  if (cache.has(key)) {
    cache.delete(key);
  } else if (cache.size >= CAPACITY) {
    const oldest = cache.keys().next().value;
    if (oldest !== undefined) {
      cache.delete(oldest);
    }
  }
  cache.set(key, width);
}

export function clearMeasurementCache(): void {
  cache.clear();
}
