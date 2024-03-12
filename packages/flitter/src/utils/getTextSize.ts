const OFFSET = 20;
const SCALE = 100;
const defaultWidthMapStr = `007LLmW'55;N0500LLLLLLLLLL00NNNLzWW\\\\WQb\\0FWLg\\bWb\\WQ\\WrWWQ000CL5LLFLL0LL**F*gLLLL5F0LF\\FFF5.5N`;
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
    _ctx = document.createElement("canvas").getContext("2d");
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
  const ctx = getCtxOrNull();
  if (ctx != null) {
    ctx.font = font;
    const width = Math.ceil(ctx.measureText(text).width);
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
