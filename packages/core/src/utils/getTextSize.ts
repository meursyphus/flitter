const OFFSET = 20;
const SCALE = 100;
const defaultWidthMapStr =
  "007LLmW'55;N0500LLLLLLLLLL00NNNLzWW\\\\WQb\\0FWLg\\bWb\\WQ\\WrWWQ000CL5LLFLL0LL**F*gLLLL5F0LF\\FFF5.5N";
export const DEFAULT_FONT_SIZE = 12;
export const DEFAULT_FONT_FAMILY = "sans-serif";
export const DEFAULT_FONT = `${DEFAULT_FONT_SIZE}px ${DEFAULT_FONT_FAMILY}`;
const DEFAULT_FONT_WEIGHT = "normal";
const DEFAULT_FONT_STYLE = "normal";
const MAX_FONT_CACHE_SIZE = 64;
const MAX_SEGMENT_CACHE_SIZE = 2048;

const FLITTER_TEXT_CACHE_KEY = "__flitter_text_cache__";

type TextMeasurementStore = {
  ctx: CanvasRenderingContext2D | null;
  currentFont: string;
  fontWidthCache: Map<string, Map<string, number>>;
  fontStringCache: Map<string, string>;
};

function getStore(): TextMeasurementStore | null {
  if (typeof window === "undefined") {
    return null;
  }

  const win = window as any;
  if (win[FLITTER_TEXT_CACHE_KEY] == null) {
    win[FLITTER_TEXT_CACHE_KEY] = {
      ctx: null,
      currentFont: "",
      fontWidthCache: new Map<string, Map<string, number>>(),
      fontStringCache: new Map<string, string>(),
    } satisfies TextMeasurementStore;
  }

  return win[FLITTER_TEXT_CACHE_KEY];
}

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

function getCtxOrNull(): CanvasRenderingContext2D | null {
  const store = getStore();
  if (store == null) {
    return null;
  }

  if (store.ctx == null) {
    store.ctx = document.createElement("canvas").getContext("2d")!;
  }

  return store.ctx;
}

export function getTextWidth({
  text,
  font,
}: {
  text: string;
  font: string;
}): number {
  const store = getStore();
  if (store != null) {
    const cachedWidth = getCachedWidth(store, font, text);
    if (cachedWidth != null) {
      return cachedWidth;
    }
  }

  const ctx = getCtxOrNull();
  let width: number;
  if (ctx != null) {
    const store = getStore()!;
    if (store.currentFont !== font) {
      ctx.font = font;
      store.currentFont = font;
    }
    width = Math.ceil(ctx.measureText(text).width);
  } else {
    // Use font size if there is no other method can be used.
    const res = /(\d+)px/.exec(font);
    const fontSize = (res && +res[1]) || DEFAULT_FONT_SIZE;
    width = 0;
    if (font.indexOf("mono") >= 0) {
      // is monospace
      width = fontSize * text.length;
    } else {
      for (let i = 0; i < text.length; i++) {
        const preCalcWidth = DEFAULT_TEXT_WIDTH_MAP[text[i]];
        width += preCalcWidth == null ? fontSize : preCalcWidth * fontSize;
      }
    }
  }

  width = Math.ceil(width);
  if (store != null) {
    setCachedWidth(store, font, text, width);
  }
  return width;
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

export function getPooledFontString({
  fontFamily = DEFAULT_FONT_FAMILY,
  fontSize = DEFAULT_FONT_SIZE,
  fontWeight = DEFAULT_FONT_WEIGHT,
  fontStyle = DEFAULT_FONT_STYLE,
}: {
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
  fontStyle?: string;
}): string {
  const store = getStore();
  const key = `${fontStyle}|${fontWeight}|${fontSize}|${fontFamily}`;

  if (store != null) {
    let font = store.fontStringCache.get(key);
    if (font != null) {
      return font;
    }
    const font_ = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
    store.fontStringCache.set(key, font_);
    return font_;
  }

  return `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
}

export function clearTextMeasurementCache() {
  const store = getStore();
  if (store != null) {
    store.fontWidthCache.clear();
    store.fontStringCache.clear();
    store.currentFont = "";
  }
}

function getCachedWidth(
  store: TextMeasurementStore,
  font: string,
  text: string,
): number | undefined {
  const fontCache = store.fontWidthCache.get(font);
  if (fontCache == null) {
    return undefined;
  }

  const cachedWidth = fontCache.get(text);
  if (cachedWidth == null) {
    return undefined;
  }

  fontCache.delete(text);
  fontCache.set(text, cachedWidth);

  return cachedWidth;
}

function getOrCreateFontCache(
  store: TextMeasurementStore,
  font: string,
): Map<string, number> {
  let fontCache = store.fontWidthCache.get(font);
  if (fontCache == null) {
    fontCache = new Map();
    store.fontWidthCache.set(font, fontCache);
    trimFontCache(store);
  } else {
    store.fontWidthCache.delete(font);
    store.fontWidthCache.set(font, fontCache);
  }
  return fontCache;
}

function setCachedWidth(
  store: TextMeasurementStore,
  font: string,
  text: string,
  width: number,
) {
  const fontCache = getOrCreateFontCache(store, font);
  if (fontCache.has(text)) {
    fontCache.delete(text);
  } else if (fontCache.size >= MAX_SEGMENT_CACHE_SIZE) {
    const oldestKey = fontCache.keys().next().value;
    if (oldestKey != null) {
      fontCache.delete(oldestKey);
    }
  }

  fontCache.set(text, width);
}

function trimFontCache(store: TextMeasurementStore) {
  while (store.fontWidthCache.size > MAX_FONT_CACHE_SIZE) {
    const oldestKey = store.fontWidthCache.keys().next().value;
    if (oldestKey == null) {
      break;
    }
    store.fontWidthCache.delete(oldestKey);
  }
}
