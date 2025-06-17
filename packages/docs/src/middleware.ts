import type { MiddlewareHandler } from "astro";
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from "./i18n";

// Static redirects configuration
const STATIC_REDIRECTS: Record<string, string> = {
  "/docs": "/docs/getting-started/introduction",
  "/tutorial": "/tutorial/quick-start/installation",
};

function detectLanguage(
  context: Parameters<MiddlewareHandler>[0],
): (typeof SUPPORTED_LANGUAGES)[number] {
  const acceptLanguage = context.request.headers.get("accept-language");

  if (!acceptLanguage) {
    return DEFAULT_LANGUAGE;
  }

  const langs = acceptLanguage.split(",").map((lang) => lang.split(";")[0]);
  for (const lang of langs) {
    const shortLang = lang.slice(0, 2).toLowerCase();
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

// Handle static redirects
function handleStaticRedirects(
  context: Parameters<MiddlewareHandler>[0],
): Response | null {
  const url = new URL(context.request.url);
  const redirectPath = STATIC_REDIRECTS[url.pathname];
  
  if (redirectPath) {
    return context.redirect(redirectPath);
  }
  
  return null;
}

export const onRequest: MiddlewareHandler = async (context, next) => {
  // Pipeline 1: Handle static redirects first
  const staticRedirect = handleStaticRedirects(context);
  if (staticRedirect) {
    return staticRedirect;
  }

  // Pipeline 2: Handle language detection and routing
  const url = new URL(context.request.url);

  // Only process /tutorial and /docs routes for language detection
  if (
    url.pathname.startsWith("/tutorial") ||
    url.pathname.startsWith("/docs")
  ) {
    const pathSegments = url.pathname.split("/").filter(Boolean);
    const [category, lang] = pathSegments;

    if (
      pathSegments.length === 1 ||
      !SUPPORTED_LANGUAGES.includes(
        lang as (typeof SUPPORTED_LANGUAGES)[number],
      )
    ) {
      const preferredLang = detectLanguage(context);
      const path = pathSegments.slice(1).join("/");

      return context.redirect(`/${category}/${preferredLang}/${path}`);
    }
  }

  return next();
};
