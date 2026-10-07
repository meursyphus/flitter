const OFFSET = 20;
const SCALE = 100;
const defaultWidthMapStr =
  "007LLmW'55;N0500LLLLLLLLLL00NNNLzWW\\\\WQb\\0FWLg\\bWb\\WQ\\WrWWQ000CL5LLFLL0LL**F*gLLLL5F0LF\\FFF5.5N";
export const DEFAULT_FONT_SIZE = 12;
export const DEFAULT_FONT_FAMILY = "sans-serif";
export const DEFAULT_FONT = `${DEFAULT_FONT_SIZE}px ${DEFAULT_FONT_FAMILY}`;

function getTextWidthMap(mapStr: string): Record<string, number> {
  const map: Record<string, number> = {};
  if (typeof JSON === "undefined") {
    return map;
  }
  for (let i = 0; i < mapStr.length; i++) {
    const char = String.fromCharCode(i + 32);
    const size = (mapStr.charCodeAt(i) - OFFSET) / SCALE;
    map[char] = size;
  }
  return map;
}

export const DEFAULT_TEXT_WIDTH_MAP = getTextWidthMap(defaultWidthMapStr);

let _ctx: CanvasRenderingContext2D;

function getCtxOrNull(): CanvasRenderingContext2D | null {
  if (typeof window === "undefined") {
    return null;
  }

  if (_ctx == null) {
    _ctx = document.createElement("canvas").getContext("2d")!;
  }

  return _ctx;
}

/*
  Flyweight cache for canvas text measurement. `ctx.measureText` is the dominant
  cost of text layout and its result is fully determined by (font, text), so the
  measured width is shared across every caller and every relayout — measure each
  distinct pair once while it remains in the bounded LRU cache. The cache is bound to `window` (never a
  module global) so it cannot leak across renders in a long-running Node SSR
  process, and it is cleared when web fonts finish loading so a width measured
  with a fallback font is never reused after the real font arrives.
*/
const TEXT_WIDTH_CACHE_KEY = Symbol.for("flitter.textWidthMeasurementCache");
const TEXT_WIDTH_CACHE_LIMIT = 8192;
const TEXT_WIDTH_GENERATION_KEY = Symbol.for(
  "flitter.textWidthMeasurementGeneration",
);

/** Share the generation with the width cache, including across bundled copies. */
export function getTextMeasurementGeneration(): number {
  if (typeof window === "undefined") return 0;
  return (
    (window as unknown as Record<symbol, number | undefined>)[
      TEXT_WIDTH_GENERATION_KEY
    ] ?? 0
  );
}

const fontPool = new Map<
  string,
  Map<string, Map<number, Map<boolean, string>>>
>();
let pooledFonts = 0;
/** Pool resolved font strings; segment preparation never formats per word. */
export function getTextFont({
  fontFamily,
  fontWeight,
  fontSize,
  italic = false,
}: {
  fontFamily: string;
  fontWeight: string;
  fontSize: number;
  italic?: boolean;
}): string {
  if (pooledFonts >= 256) {
    fontPool.clear();
    pooledFonts = 0;
  }
  let weights = fontPool.get(fontFamily);
  if (!weights) fontPool.set(fontFamily, (weights = new Map()));
  let sizes = weights.get(fontWeight);
  if (!sizes) weights.set(fontWeight, (sizes = new Map()));
  let styles = sizes.get(fontSize);
  if (!styles) sizes.set(fontSize, (styles = new Map()));
  let font = styles.get(italic);
  if (!font) {
    font = `${italic ? "italic " : ""}${fontWeight} ${fontSize}px ${fontFamily}`;
    styles.set(italic, font);
    pooledFonts++;
  }
  return font;
}

function getTextWidthCache(): Map<string, number> | null {
  if (typeof window === "undefined") {
    return null;
  }
  const host = window as unknown as Record<symbol, Map<string, number>>;
  let cache = host[TEXT_WIDTH_CACHE_KEY];
  if (cache == null) {
    cache = new Map<string, number>();
    host[TEXT_WIDTH_CACHE_KEY] = cache;
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    if (fonts != null && typeof fonts.addEventListener === "function") {
      fonts.addEventListener("loadingdone", () => {
        cache!.clear();
        const generations = window as unknown as Record<symbol, number>;
        generations[TEXT_WIDTH_GENERATION_KEY] =
          getTextMeasurementGeneration() + 1;
      });
    }
  }
  return cache;
}

export function getTextWidth({
  text,
  font,
}: {
  text: string;
  font: string;
}): number {
  const ctx = getCtxOrNull();
  if (ctx != null) {
    const cache = getTextWidthCache();
    const cacheKey = cache != null ? `${font}\u0000${text}` : null;
    if (cache != null && cacheKey != null) {
      const cached = cache.get(cacheKey);
      if (cached !== undefined) {
        // LRU: hot axis labels survive a stream of unique live-data values.
        cache.delete(cacheKey);
        cache.set(cacheKey, cached);
        return cached;
      }
    }

    if (ctx.font !== font) ctx.font = font;
    const width = Math.ceil(ctx.measureText(text).width);

    if (cache != null && cacheKey != null) {
      if (cache.size >= TEXT_WIDTH_CACHE_LIMIT) {
        cache.delete(cache.keys().next().value!);
      }
      cache.set(cacheKey, width);
    }
    return width;
  }

  // Use font size if there is no other method can be used.
  const res = /(\d+)px/.exec(font);
  const fontSize = (res && +res[1]) || DEFAULT_FONT_SIZE;
  let width = 0;
  if (font.indexOf("mono") >= 0) {
    // is monospace
    width = fontSize * text.length;
  } else {
    for (let i = 0; i < text.length; i++) {
      const preCalcWidth = DEFAULT_TEXT_WIDTH_MAP[text[i]];
      width += preCalcWidth == null ? fontSize : preCalcWidth * fontSize;
    }
  }

  return Math.ceil(width);
}
/*
 * Calculate height of canvas text
 * https://developer.mozilla.org/en-US/docs/Web/API/TextMetrics
 * */
export function getTextHeight({ font }: { text: string; font: string }) {
  return getFontHeight(font);
}

function getFontHeight(font: string) {
  const fontSize = font.match(/\d+(?=px)/);
  return parseInt(String(Number(fontSize)), 10);
}
