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
let _currentFont = "";
const FONT_WIDTH_CACHE = new Map<string, Map<string, number>>();
const FONT_STRING_CACHE = new Map<string, string>();

function getCtxOrNull(): CanvasRenderingContext2D | null {
  if (typeof window === "undefined") {
    return null;
  }

  if (_ctx == null) {
    _ctx = document.createElement("canvas").getContext("2d")!;
  }

  return _ctx;
}

export function getTextWidth({
  text,
  font,
}: {
  text: string;
  font: string;
}): number {
  const cachedWidth = getCachedWidth(font, text);
  if (cachedWidth != null) {
    return cachedWidth;
  }

  const ctx = getCtxOrNull();
  let width: number;
  if (ctx != null) {
    if (_currentFont !== font) {
      ctx.font = font;
      _currentFont = font;
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
  setCachedWidth(font, text, width);
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
  const key = `${fontStyle}|${fontWeight}|${fontSize}|${fontFamily}`;
  let font = FONT_STRING_CACHE.get(key);

  if (font == null) {
    font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
    FONT_STRING_CACHE.set(key, font);
  }

  return font;
}

export function clearTextMeasurementCache() {
  FONT_WIDTH_CACHE.clear();
  FONT_STRING_CACHE.clear();
  _currentFont = "";
}

function getCachedWidth(font: string, text: string): number | undefined {
  const fontCache = FONT_WIDTH_CACHE.get(font);
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

function getOrCreateFontCache(font: string): Map<string, number> {
  let fontCache = FONT_WIDTH_CACHE.get(font);
  if (fontCache == null) {
    fontCache = new Map();
    FONT_WIDTH_CACHE.set(font, fontCache);
    trimFontCache();
  } else {
    FONT_WIDTH_CACHE.delete(font);
    FONT_WIDTH_CACHE.set(font, fontCache);
  }
  return fontCache;
}

function setCachedWidth(font: string, text: string, width: number) {
  const fontCache = getOrCreateFontCache(font);
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

function trimFontCache() {
  while (FONT_WIDTH_CACHE.size > MAX_FONT_CACHE_SIZE) {
    const oldestKey = FONT_WIDTH_CACHE.keys().next().value;
    if (oldestKey == null) {
      break;
    }
    FONT_WIDTH_CACHE.delete(oldestKey);
  }
}
