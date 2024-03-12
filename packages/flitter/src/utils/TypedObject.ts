type TypedEntries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

function entries<T extends object>(obj: T): TypedEntries<T> {
  return Object.entries(obj) as TypedEntries<T>;
}

function keys<T extends object>(obj: T): Array<keyof T> {
  return Object.keys(obj) as Array<keyof T>;
}

export default {
  entries,
  keys,
};
