"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  DEFAULT_THEME,
  THEME_ATTRIBUTE,
  parseTheme,
  serializeThemeCookie,
  type Theme,
} from "./theme";

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): Theme {
  return (
    parseTheme(document.documentElement.getAttribute(THEME_ATTRIBUTE)) ??
    DEFAULT_THEME
  );
}

function getServerSnapshot(): Theme {
  return DEFAULT_THEME;
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute(THEME_ATTRIBUTE, theme);
  document.cookie = serializeThemeCookie(theme);
  listeners.forEach((listener) => listener());
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setTheme = useCallback((next: Theme) => applyTheme(next), []);
  const toggleTheme = useCallback(
    () => applyTheme(getSnapshot() === "dark" ? "light" : "dark"),
    [],
  );

  return { theme, isDark: theme === "dark", setTheme, toggleTheme };
}
