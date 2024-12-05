import type { MiddlewareHandler } from "astro";

const SUPPORTED_LANGUAGES = ["ko", "en"] as const;
const DEFAULT_LANGUAGE = "en";

function detectLanguage(
  context: Parameters<MiddlewareHandler>[0],
): (typeof SUPPORTED_LANGUAGES)[number] {
  const preferredLocales = context.preferredLocaleList;

  if (!preferredLocales) {
    return DEFAULT_LANGUAGE;
  }

  for (const locale of preferredLocales) {
    const shortLang = locale.slice(0, 2).toLowerCase();
    if (
      SUPPORTED_LANGUAGES.includes(
        shortLang as (typeof SUPPORTED_LANGUAGES)[number],
      )
    ) {
      return shortLang as (typeof SUPPORTED_LANGUAGES)[number];
    }
  }

  return DEFAULT_LANGUAGE;
}

export const onRequest: MiddlewareHandler = async (context, next) => {
  const url = new URL(context.request.url);

  // Only process /tutorial routes
  if (url.pathname.startsWith("/tutorial")) {
    const pathSegments = url.pathname.split("/").filter(Boolean);

    // If we're at /tutorial or there's no language segment after /tutorial
    if (
      pathSegments.length === 1 ||
      !SUPPORTED_LANGUAGES.includes(
        pathSegments[1] as (typeof SUPPORTED_LANGUAGES)[number],
      )
    ) {
      const preferredLang = detectLanguage(context);
      const pathWithoutTutorial = url.pathname.replace(/^\/tutorial\/?/, "");

      return context.redirect(
        `/tutorial/${preferredLang}/${pathWithoutTutorial}`,
      );
    }
  }

  return next();
};
