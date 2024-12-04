export function normalizePath(path: string) {
  return path.endsWith("/") ? path.slice(0, -1) : path;
}
const NAV_GROUP: Record<string, number> = {
  "Basic Widgets": 3,
  "Core Concepts": 2,
  "Interactions and Animations": 5,
  Layout: 4,
  Widgets: 999,
  "Getting Started": 1,
  "Advanced Features": 6,
};

export function getNavOrder(navGroup: string) {
  return NAV_GROUP[navGroup] ?? 9999;
}