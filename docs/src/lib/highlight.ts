import { codeToHtml } from "shiki";

/**
 * Both themes are emitted as CSS variables (`--shiki-dark` / `--shiki-light`);
 * globals.css picks one from the site theme. one-dark-pro matches the code
 * screenshots in /public/home.
 */
export const SHIKI_THEMES = { dark: "one-dark-pro", light: "github-light" } as const;

export function highlight(code: string, lang: string) {
  return codeToHtml(code.trim(), {
    lang,
    themes: SHIKI_THEMES,
    defaultColor: false,
  });
}
