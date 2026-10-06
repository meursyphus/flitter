export type Theme = "dark" | "light";

export const DEFAULT_THEME: Theme = "dark";
export const THEME_COOKIE = "flitter-theme";
export const THEME_ATTRIBUTE = "data-theme";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export function parseTheme(value: string | null | undefined): Theme | null {
  return value === "dark" || value === "light" ? value : null;
}

/** Reads the theme out of a raw `Cookie` header (or `document.cookie`). */
export function readThemeCookie(cookieHeader: string | null | undefined): Theme | null {
  if (!cookieHeader) return null;
  for (const part of cookieHeader.split(";")) {
    const [name, value] = part.trim().split("=");
    if (name === THEME_COOKIE) return parseTheme(value);
  }
  return null;
}

export function serializeThemeCookie(theme: Theme): string {
  return `${THEME_COOKIE}=${theme}; path=/; max-age=${ONE_YEAR_SECONDS}; samesite=lax`;
}

/**
 * Runs before first paint. The worker already stamps the attribute from the
 * cookie on deployed HTML; this covers `next dev` and any host without it.
 */
export const themeInitScript = `(function(){try{var m=document.cookie.match(/(?:^|; )${THEME_COOKIE}=(dark|light)/);if(m)document.documentElement.setAttribute("${THEME_ATTRIBUTE}",m[1]);}catch(e){}})();`;
