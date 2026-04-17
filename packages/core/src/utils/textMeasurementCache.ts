const CACHE_SYMBOL = Symbol.for("__flitterTextMeasureCache__");
const CAPACITY = 2000;
const SEPARATOR = "\x1f";

type Cache = Map<string, number>;

let resolved: Cache | null = null;

function getCache(): Cache | null {
  if (resolved !== null) return resolved;
  if (typeof window === "undefined") return null;
  const w = window as unknown as Record<symbol, Cache | undefined>;
  let existing = w[CACHE_SYMBOL];
  if (existing === undefined) {
    existing = new Map<string, number>();
    w[CACHE_SYMBOL] = existing;
  }
  resolved = existing;
  return resolved;
}

function makeKey(text: string, font: string): string {
  return `${text}${SEPARATOR}${font}`;
}

export function getCachedWidth(
  text: string,
  font: string,
): number | undefined {
  const cache = getCache();
  if (cache === null) return undefined;
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
  const cache = getCache();
  if (cache === null) return;
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
  const cache = getCache();
  if (cache === null) return;
  cache.clear();
}
