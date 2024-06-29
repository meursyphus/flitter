export function normalizePath(path: string) {
  return path.endsWith("/") ? path.slice(0, -1) : path;
}
