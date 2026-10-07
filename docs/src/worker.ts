import { THEME_ATTRIBUTE, readThemeCookie } from "./lib/theme";

type Env = { ASSETS: { fetch: (req: Request) => Promise<Response> } };

type HtmlElement = { setAttribute(name: string, value: string): void };
declare const HTMLRewriter: new () => {
  on(
    selector: string,
    handlers: { element(element: HtmlElement): void },
  ): { transform(response: Response): Response };
};

export default {
  async fetch(request: Request, env: Env) {
    const response = await env.ASSETS.fetch(request);

    const isHtml = response.headers
      .get("content-type")
      ?.includes("text/html");
    if (!isHtml) return response;

    // The exported HTML is dark; only a stored light preference needs a rewrite.
    const theme = readThemeCookie(request.headers.get("cookie"));
    const themed =
      theme === "light"
        ? new HTMLRewriter()
            .on("html", {
              element(element) {
                element.setAttribute(THEME_ATTRIBUTE, theme);
              },
            })
            .transform(response)
        : new Response(response.body, response);

    themed.headers.append("Vary", "Cookie");
    return themed;
  },
};
