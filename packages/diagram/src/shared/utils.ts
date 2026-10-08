// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function classToFn<V extends new (...args: any[]) => any>(Constructor: V) {
  return (...args: ConstructorParameters<V>) =>
    new Constructor(...args) as InstanceType<V>;
}

type NoInfer<T> = [T][T extends any ? 0 : never];

export type DeepPartial<T> = T extends (...args: any[]) => any
  ? T
  : T extends Date
    ? Date
    : T extends Array<infer U>
      ? DeepPartial<U>[]
      : T extends object
        ? { [K in keyof T]?: DeepPartial<T[K]> }
        : T;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function deepMerge<T extends object>(
  base: T,
  override?: DeepPartial<NoInfer<T>>,
): T {
  if (!override) return base;
  const result = { ...base } as Record<string, unknown>;
  for (const key of Object.keys(override as Record<string, unknown>)) {
    const ov = (override as Record<string, unknown>)[key];
    const current = result[key];
    if (isPlainObject(ov) && isPlainObject(current)) {
      result[key] = deepMerge(current, ov as Record<string, unknown>);
    } else if (ov !== undefined) {
      result[key] = ov;
    }
  }
  return result as T;
}

let idCounter = 0;
/** Short unique id for nodes/edges created by the engine. */
export function createId(prefix = "id"): string {
  idCounter += 1;
  return `${prefix}_${Date.now().toString(36)}_${idCounter.toString(36)}`;
}

export const isMacOs = (): boolean =>
  typeof navigator !== "undefined" && /Mac/.test(navigator.platform ?? "");
