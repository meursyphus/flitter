import type InlineSpan from "./Inline-span";
import Utils, { assert, getPooledFontString, getTextWidth } from "../../utils";
import type { SvgPaintContext } from "../../framework";
import type Offset from "./_offset";
import { TextDirection, TextAlign, TextWidthBasis } from "..";
import { FontStyle } from "./text-style";

function getTextHeight({ fontSize }: { fontSize: number }) {
  return fontSize;
}

const defaultTextStyle = {
  fontFamily: "serif",
  fontSize: 16,
  fontWeight: "normal",
  fontColor: "black",
  height: 1.2,
};

const HARD_BREAK = "\n";
const SOFT_HYPHEN = "\u00AD";
const FIT_EPSILON = 0.001;

const LINE_START_PROHIBITED = new Set([
  ",",
  ".",
  "!",
  "?",
  ":",
  ";",
  ")",
  "]",
  "}",
  "%",
  "”",
  "’",
  "»",
  "›",
  "、",
  "。",
  "，",
  "．",
  "！",
  "？",
  "：",
  "；",
  "）",
  "］",
  "｝",
  "》",
  "」",
  "』",
  "】",
  "ー",
  "…",
]);

const LINE_END_PROHIBITED = new Set([
  "(",
  "[",
  "{",
  "“",
  "‘",
  "«",
  "‹",
  "（",
  "［",
  "｛",
  "《",
  "「",
  "『",
  "【",
]);

type SegmentKind = "text" | "space" | "hard-break" | "soft-hyphen";

type LayoutCursor = {
  segmentIndex: number;
  graphemeIndex: number;
};

type SegmentSlice = {
  start: number;
  text: string;
};

type GraphemePart = {
  end: number;
  text: string;
};

type PreparedSpanStyle = {
  color: string;
  font: string;
  fontFamily: string;
  fontSize: number;
  fontStyle: FontStyle;
  fontStyleValue: string;
  fontWeight: string;
  height: number;
  lineHeight: number;
};

type PreparedSegment = PreparedSpanStyle & {
  boundaryOffsets: number[];
  containsCJK: boolean;
  content: string;
  end: number;
  graphemes: string[];
  hyphenWidth: number;
  kind: SegmentKind;
  prefixWidths: number[];
  start: number;
};

type LineLayoutResult = {
  line: ParagraphLine;
  nextCursor: LayoutCursor;
  trailingBlankLineStyle: PreparedSpanStyle | null;
};

type PendingBreak = {
  hyphenSegment?: PreparedSegment;
  nextCursor: LayoutCursor;
};

type ParagraphCaretInfo = {
  color: string;
  height: number;
  left: number;
  top: number;
  width: number;
};

type ParagraphSelectionRect = {
  end: number;
  height: number;
  start: number;
  y: number;
};

type Span = {
  color: string;
  content: string;
  fontFamily: string;
  fontSize: number;
  fontStyle: FontStyle;
  fontWeight: string;
  height: number;
};

let sharedWordSegmenter: SegmenterLike | null = null;
let sharedGraphemeSegmenter: SegmenterLike | null = null;

type SegmenterLike = {
  segment(text: string): Iterable<{
    index: number;
    isWordLike?: boolean;
    segment: string;
  }>;
};

function getSegmenter(granularity: "grapheme" | "word"): SegmenterLike | null {
  if (
    typeof Intl === "undefined" ||
    typeof (Intl as any).Segmenter !== "function"
  ) {
    return null;
  }

  if (granularity === "word") {
    sharedWordSegmenter ??= new (Intl as any).Segmenter(undefined, {
      granularity: "word",
    });
    return sharedWordSegmenter;
  }

  sharedGraphemeSegmenter ??= new (Intl as any).Segmenter(undefined, {
    granularity: "grapheme",
  });
  return sharedGraphemeSegmenter;
}

function resolveFontStyle(fontStyle: FontStyle = FontStyle.normal): string {
  return fontStyle === FontStyle.italic ? "italic" : "normal";
}

function containsCJK(text: string): boolean {
  return /[\u3000-\u303f\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uac00-\ud7af\uff00-\uffef]/u.test(
    text,
  );
}

function isWhitespaceOnly(text: string): boolean {
  return text.length > 0 && /^[^\S\r\n]+$/u.test(text);
}

function segmentTextContent(text: string): SegmentSlice[] {
  if (text.length === 0) {
    return [];
  }

  const segmenter = getSegmenter("word");
  if (segmenter != null) {
    const parts: SegmentSlice[] = [];
    for (const part of segmenter.segment(text)) {
      if (part.segment.length === 0) {
        continue;
      }
      parts.push({
        start: part.index,
        text: part.segment,
      });
    }
    if (parts.length > 0) {
      return parts;
    }
  }

  const parts: SegmentSlice[] = [];
  const regex = /[^\S\r\n]+|\S+/gu;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) != null) {
    parts.push({
      start: match.index,
      text: match[0],
    });
  }
  return parts;
}

function splitSoftHyphen(text: string, start: number): SegmentSlice[] {
  const parts: SegmentSlice[] = [];
  let cursor = 0;

  while (cursor < text.length) {
    const softHyphenIndex = text.indexOf(SOFT_HYPHEN, cursor);
    if (softHyphenIndex === -1) {
      parts.push({
        start: start + cursor,
        text: text.slice(cursor),
      });
      break;
    }

    if (softHyphenIndex > cursor) {
      parts.push({
        start: start + cursor,
        text: text.slice(cursor, softHyphenIndex),
      });
    }

    parts.push({
      start: start + softHyphenIndex,
      text: SOFT_HYPHEN,
    });
    cursor = softHyphenIndex + SOFT_HYPHEN.length;
  }

  return parts.filter(part => part.text.length > 0);
}

function splitGraphemes(text: string): GraphemePart[] {
  const segmenter = getSegmenter("grapheme");
  if (segmenter != null) {
    const parts: GraphemePart[] = [];
    for (const part of segmenter.segment(text)) {
      parts.push({
        end: part.index + part.segment.length,
        text: part.segment,
      });
    }
    if (parts.length > 0) {
      return parts;
    }
  }

  const parts: GraphemePart[] = [];
  let offset = 0;
  for (const grapheme of Array.from(text)) {
    offset += grapheme.length;
    parts.push({
      end: offset,
      text: grapheme,
    });
  }
  return parts;
}

export default class TextPainter {
  text?: InlineSpan;
  textAlign: TextAlign;
  textDirection?: TextDirection;
  ellipsis?: string;
  textScaleFactor: number;
  maxLines?: number;
  textWidthBasis: TextWidthBasis;

  constructor({
    text,
    textAlign = TextAlign.start,
    textDirection,
    textScaleFactor = 1,
    maxLines,
    ellipsis,
    textWidthBasis = TextWidthBasis.parent,
  }: {
    text?: InlineSpan;
    textAlign?: TextAlign;
    textDirection?: TextDirection;
    softWrap?: boolean;
    textScaleFactor?: number;
    maxLines?: number;
    textWidthBasis?: TextWidthBasis;
    ellipsis?: string;
  }) {
    this.text = text;
    this.textAlign = textAlign;
    this.textDirection = textDirection;
    this.textScaleFactor = textScaleFactor;
    this.maxLines = maxLines;
    this.ellipsis = ellipsis;
    this.textWidthBasis = textWidthBasis;
  }

  get plainText(): string {
    return this.text?.toPlainText() || "";
  }

  paragraph?: Paragraph;

  get width(): number {
    if (this.paragraph == null) return 0;
    return this.paragraph.width;
  }

  get height(): number {
    if (this.paragraph == null) return 0;
    return this.paragraph.height;
  }

  get intrinsicWidth(): number {
    if (this.paragraph == null) return 0;
    return this.paragraph.intrinsicWidth;
  }

  get intrinsicHeight(): number {
    if (this.paragraph == null) return 0;
    return this.paragraph.intrinsicHeight;
  }

  get longestLine(): number {
    if (this.paragraph == null) return 0;
    return this.paragraph.longestLine;
  }

  paintOnCanvas(ctx: CanvasRenderingContext2D, offset: Offset): void {
    assert(this.paragraph != null, "paragraph should not be null");
    this.paragraph.lines.forEach(line => {
      line.spanBoxes.forEach(({ offset: { x, y }, font, content, color }) => {
        if (content.length === 0) {
          return;
        }
        ctx.font = font;
        ctx.textAlign = "start";
        ctx.textBaseline = "hanging";
        ctx.fillStyle = color;
        ctx.fillText(content, x + offset.x, y + offset.y);
      });
    });
  }

  paintOnSvg(textEl: SVGTextElement, { createSvgEl }: SvgPaintContext) {
    this.resetText(textEl);
    assert(this.paragraph != null, "paragraph should not be null");

    this.paragraph.lines.forEach(line => {
      line.spanBoxes.forEach(
        ({
          offset,
          fontFamily,
          content,
          fontSize,
          fontStyleValue,
          fontWeight,
          color,
        }) => {
          if (content.length === 0) {
            return;
          }
          const tspanEl = createSvgEl("tspan");
          tspanEl.setAttribute("x", `${offset.x}`);
          tspanEl.setAttribute("y", `${offset.y}`);
          tspanEl.setAttribute("text-anchor", "start");
          tspanEl.setAttribute("dominant-baseline", "hanging");
          tspanEl.setAttribute("fill", color);
          tspanEl.setAttribute("font-size", `${fontSize}`);
          tspanEl.setAttribute("font-family", `${fontFamily}`);
          tspanEl.setAttribute("font-weight", fontWeight);
          tspanEl.setAttribute("font-style", fontStyleValue);
          tspanEl.textContent = content;
          textEl.appendChild(tspanEl);
        },
      );
    });
  }

  layout({
    minWidth = 0,
    maxWidth = Infinity,
  }: {
    minWidth?: number;
    maxWidth?: number;
  } = {}) {
    const paragraph = this.ensureParagraph();
    this.layoutParagraph(paragraph, { minWidth, maxWidth });
  }

  private ensureParagraph(): Paragraph {
    if (this.paragraph == null || this.paragraph.sourceText !== this.text) {
      this.paragraph = new Paragraph(this.text ?? null, {
        ellipsis: this.ellipsis,
        maxLines: this.maxLines,
        textAlign: this.textAlign,
        textDirection: this.textDirection || TextDirection.ltr,
      });
      return this.paragraph;
    }

    this.paragraph.configure({
      ellipsis: this.ellipsis,
      maxLines: this.maxLines,
      textAlign: this.textAlign,
      textDirection: this.textDirection || TextDirection.ltr,
    });

    return this.paragraph;
  }

  private resetText(textEl: SVGTextElement) {
    while (textEl.firstChild) {
      textEl.removeChild(textEl.firstChild);
    }
  }

  private layoutParagraph(
    paragraph: Paragraph,
    {
      minWidth = 0,
      maxWidth = Infinity,
    }: {
      minWidth?: number;
      maxWidth?: number;
    },
  ) {
    paragraph.layout(maxWidth);

    if (minWidth !== maxWidth) {
      let newWidth: number;
      switch (this.textWidthBasis) {
        case TextWidthBasis.longestLine:
          newWidth = paragraph.longestLine;
          break;
        case TextWidthBasis.parent:
          newWidth = paragraph.intrinsicWidth;
          break;
        default:
          assert(false, `Unknown text width basis: ${this.textWidthBasis}`);
      }

      newWidth = Utils.clampDouble(newWidth, minWidth, maxWidth);

      if (newWidth !== paragraph.width) {
        paragraph.layout(newWidth);
      }
    }
  }
}

export class Paragraph {
  ellipsis?: string;
  maxLines?: number;
  source: Span[] = [];
  sourceText: InlineSpan | null;
  lines: ParagraphLine[] = [];
  textDirection: TextDirection;
  textAlign: TextAlign;
  width: number = 0;

  private defaultLineStyle: PreparedSpanStyle = Paragraph.toPreparedStyle({});
  private lastLayoutWidth?: number;
  private prepared = false;
  private preparedIntrinsicHeight = this.defaultLineStyle.lineHeight;
  private preparedIntrinsicWidth = 0;
  private preparedLongestLine = 0;
  private preparedSegments: PreparedSegment[] = [];
  private preparedTextLength = 0;

  constructor(
    text: InlineSpan | null,
    {
      textAlign,
      ellipsis,
      maxLines,
      textDirection,
    }: {
      textAlign: TextAlign;
      ellipsis?: string;
      maxLines?: number;
      textDirection: TextDirection;
    },
  ) {
    this.sourceText = text;
    this.ellipsis = ellipsis;
    this.maxLines = maxLines;
    this.textAlign = textAlign;
    this.textDirection = textDirection;
    this.build(text);
  }

  get height(): number {
    return this.lines.reduce((acc, line) => acc + line.height, 0);
  }

  get longestLine(): number {
    return this.lines.reduce((acc, line) => Math.max(acc, line.width), 0);
  }

  get intrinsicWidth(): number {
    this.prepare();
    return this.preparedIntrinsicWidth;
  }

  get intrinsicHeight(): number {
    this.prepare();
    if (this.lines.length > 0) {
      return this.height;
    }
    return this.preparedIntrinsicHeight;
  }

  configure({
    ellipsis,
    maxLines,
    textAlign,
    textDirection,
  }: {
    ellipsis?: string;
    maxLines?: number;
    textAlign: TextAlign;
    textDirection: TextDirection;
  }) {
    if (
      this.ellipsis === ellipsis &&
      this.maxLines === maxLines &&
      this.textAlign === textAlign &&
      this.textDirection === textDirection
    ) {
      return;
    }

    this.ellipsis = ellipsis;
    this.maxLines = maxLines;
    this.textAlign = textAlign;
    this.textDirection = textDirection;
    this.lastLayoutWidth = undefined;
  }

  build(text: InlineSpan | null) {
    text?.build(this);
  }

  layout(width: number = Infinity) {
    this.prepare();
    if (this.lastLayoutWidth === width) {
      this.width = width;
      return;
    }

    this.width = width;
    this.lines = [];
    this.lastLayoutWidth = width;

    if (this.preparedSegments.length === 0) {
      this.lines.push(
        new ParagraphLine({
          defaultStyle: this.defaultLineStyle,
          startOffset: 0,
        }),
      );
      this.align();
      return;
    }

    const maxLineCount = this.maxLines ?? Infinity;
    let cursor: LayoutCursor = {
      segmentIndex: 0,
      graphemeIndex: 0,
    };
    let trailingBlankLineStyle: PreparedSpanStyle | null = null;

    while (cursor.segmentIndex < this.preparedSegments.length) {
      if (this.lines.length >= maxLineCount) {
        break;
      }

      const result = this.layoutNextLine(cursor, width);
      this.lines.push(result.line);
      cursor = result.nextCursor;
      trailingBlankLineStyle = result.trailingBlankLineStyle;
    }

    const isTruncated = cursor.segmentIndex < this.preparedSegments.length;
    if (
      !isTruncated &&
      trailingBlankLineStyle != null &&
      this.lines.length < maxLineCount
    ) {
      this.lines.push(
        new ParagraphLine({
          defaultStyle: trailingBlankLineStyle,
          startOffset: this.preparedTextLength,
        }),
      );
    }

    if (
      isTruncated &&
      this.maxLines != null &&
      this.ellipsis != null &&
      this.lines.length > 0
    ) {
      const lastLineIndex = this.lines.length - 1;
      this.lines[lastLineIndex] = this.applyEllipsisToLine(
        this.lines[lastLineIndex],
        width,
      );
    }

    if (this.lines.length === 0) {
      this.lines.push(
        new ParagraphLine({
          defaultStyle: this.defaultLineStyle,
          startOffset: 0,
        }),
      );
    }

    this.align();
  }

  getCaretInfo(position: number): ParagraphCaretInfo {
    const clampedPosition = Utils.clampDouble(
      position,
      0,
      this.preparedTextLength,
    );
    const lineIndex = this.findLineIndexForPosition(clampedPosition);
    const line = this.lines[lineIndex] ?? this.lines[this.lines.length - 1];
    const left = line.xForPosition(clampedPosition);
    const color = line.colorForPosition(clampedPosition);

    return {
      color,
      height: line.height,
      left,
      top: line.offsetY,
      width: 0,
    };
  }

  getPositionForOffset(x: number, y: number): number {
    if (this.lines.length === 0) {
      return 0;
    }

    const lineIndex = this.findLineIndexForOffsetY(y);
    const line = this.lines[lineIndex] ?? this.lines[this.lines.length - 1];
    return line.positionForX(x);
  }

  getSelectionRects(start: number, end: number): ParagraphSelectionRect[] {
    const rangeStart = Utils.clampDouble(
      Math.min(start, end),
      0,
      this.preparedTextLength,
    );
    const rangeEnd = Utils.clampDouble(
      Math.max(start, end),
      0,
      this.preparedTextLength,
    );
    if (rangeStart === rangeEnd) {
      return [];
    }

    const rects: ParagraphSelectionRect[] = [];
    this.lines.forEach(line => {
      const selectionStart = Math.max(rangeStart, line.startOffset);
      const selectionEnd = Math.min(rangeEnd, line.endOffset);
      if (selectionEnd < selectionStart) {
        return;
      }

      const startX = line.xForPosition(selectionStart);
      const endX = line.xForPosition(selectionEnd);
      rects.push({
        end: endX,
        height: line.height,
        start: startX,
        y: line.offsetY,
      });
    });

    return rects;
  }

  addText({
    fontFamily = defaultTextStyle.fontFamily,
    fontSize = defaultTextStyle.fontSize,
    fontWeight = defaultTextStyle.fontWeight,
    content = "",
    height = defaultTextStyle.height,
    fontStyle = FontStyle.normal,
    color = defaultTextStyle.fontColor,
  }: {
    fontSize?: number;
    fontFamily?: string;
    content?: string;
    fontStyle?: FontStyle;
    fontWeight?: string;
    color?: string;
    height?: number;
  }) {
    const resolvedStyle = Paragraph.toPreparedStyle({
      color,
      fontFamily,
      fontSize,
      fontStyle,
      fontWeight,
      height,
    });

    if (this.source.length === 0) {
      this.defaultLineStyle = resolvedStyle;
    }

    this.source.push({
      color,
      content,
      fontFamily,
      fontSize,
      fontStyle,
      fontWeight,
      height,
    });
    this.prepared = false;
    this.lastLayoutWidth = undefined;
  }

  private align() {
    let currentHeight = 0;
    this.lines.forEach(line => {
      line.layout(this.resolvedTextAlign, {
        offsetY: currentHeight,
        paragraphWidth: this.width,
      });
      currentHeight += line.height;
    });
  }

  private applyEllipsisToLine(
    line: ParagraphLine,
    width: number,
  ): ParagraphLine {
    if (this.ellipsis == null) {
      return line;
    }

    const style = line.lastStyle ?? this.defaultLineStyle;
    const ellipsisBox = this.createSyntheticSpanBox({
      content: this.ellipsis,
      offset: line.endOffset,
      style,
      width: getTextWidth({ text: this.ellipsis, font: style.font }),
    });

    if (!Number.isFinite(width)) {
      line.addSpanBox(ellipsisBox);
      return line;
    }

    const availableWidth = Math.max(0, width - ellipsisBox.size.width);
    const truncatedLine = new ParagraphLine({
      defaultStyle: line.defaultStyle,
      startOffset: line.startOffset,
    });

    for (const spanBox of line.spanBoxes) {
      if (spanBox.startOffset === spanBox.endOffset) {
        continue;
      }

      if (
        truncatedLine.width + spanBox.size.width <=
        availableWidth + FIT_EPSILON
      ) {
        truncatedLine.addSpanBox(spanBox.clone());
        continue;
      }

      const maxSpanWidth = Math.max(0, availableWidth - truncatedLine.width);
      const boundaryIndex = spanBox.fitBoundaryIndexForWidth(maxSpanWidth);
      if (boundaryIndex > 0) {
        truncatedLine.addSpanBox(spanBox.sliceToBoundary(boundaryIndex));
      }
      break;
    }

    truncatedLine.addSpanBox(ellipsisBox);
    return truncatedLine;
  }

  private createPreparedSegment(
    style: PreparedSpanStyle,
    content: string,
    start: number,
  ): PreparedSegment {
    const kind: SegmentKind =
      content === SOFT_HYPHEN
        ? "soft-hyphen"
        : isWhitespaceOnly(content)
          ? "space"
          : "text";

    if (kind === "soft-hyphen") {
      return {
        ...style,
        boundaryOffsets: [0, content.length],
        containsCJK: false,
        content,
        end: start + content.length,
        graphemes: [content],
        hyphenWidth: getTextWidth({ text: "-", font: style.font }),
        kind,
        prefixWidths: [0, 0],
        start,
      };
    }

    const graphemeParts = splitGraphemes(content);
    const boundaryOffsets = [0];
    const prefixWidths = [0];
    const graphemes: string[] = [];
    let prefix = "";

    graphemeParts.forEach(part => {
      graphemes.push(part.text);
      prefix += part.text;
      boundaryOffsets.push(part.end);
      prefixWidths.push(getTextWidth({ text: prefix, font: style.font }));
    });

    return {
      ...style,
      boundaryOffsets,
      containsCJK: kind === "text" && containsCJK(content),
      content,
      end: start + content.length,
      graphemes,
      hyphenWidth: 0,
      kind,
      prefixWidths,
      start,
    };
  }

  private createSpanBoxFromSegment(
    segment: PreparedSegment,
    startGraphemeIndex: number,
    endGraphemeIndex: number,
  ): SpanBox | null {
    if (segment.kind === "hard-break" || segment.kind === "soft-hyphen") {
      return null;
    }

    const localStart = segment.boundaryOffsets[startGraphemeIndex] ?? 0;
    const localEnd =
      segment.boundaryOffsets[endGraphemeIndex] ?? segment.content.length;
    const boundaryOffsets = [0];
    const prefixWidths = [0];
    const baseWidth = segment.prefixWidths[startGraphemeIndex] ?? 0;

    for (
      let index = startGraphemeIndex + 1;
      index <= endGraphemeIndex;
      index++
    ) {
      boundaryOffsets.push(
        (segment.boundaryOffsets[index] ?? localEnd) - localStart,
      );
      prefixWidths.push((segment.prefixWidths[index] ?? baseWidth) - baseWidth);
    }

    const content = segment.content.slice(localStart, localEnd);
    return new SpanBox({
      boundaryOffsets,
      color: segment.color,
      content,
      endOffset: segment.start + localEnd,
      font: segment.font,
      fontFamily: segment.fontFamily,
      fontSize: segment.fontSize,
      fontStyle: segment.fontStyle,
      fontStyleValue: segment.fontStyleValue,
      fontWeight: segment.fontWeight,
      height: segment.height,
      prefixWidths,
      startOffset: segment.start + localStart,
      width: this.getSegmentWidthBetween(
        segment,
        startGraphemeIndex,
        endGraphemeIndex,
      ),
    });
  }

  private createSyntheticSpanBox({
    content,
    offset,
    style,
    width,
  }: {
    content: string;
    offset: number;
    style: PreparedSpanStyle;
    width: number;
  }): SpanBox {
    return new SpanBox({
      boundaryOffsets: [0],
      color: style.color,
      content,
      endOffset: offset,
      font: style.font,
      fontFamily: style.fontFamily,
      fontSize: style.fontSize,
      fontStyle: style.fontStyle,
      fontStyleValue: style.fontStyleValue,
      fontWeight: style.fontWeight,
      height: style.height,
      prefixWidths: [0],
      startOffset: offset,
      width,
    });
  }

  private findLineIndexForOffsetY(y: number): number {
    let low = 0;
    let high = this.lines.length - 1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const line = this.lines[mid];
      const lineTop = line.offsetY;
      const lineBottom = lineTop + line.height;

      if (y >= lineTop && y < lineBottom) {
        return mid;
      }

      if (y < lineTop) {
        high = mid - 1;
      } else {
        low = mid + 1;
      }
    }

    if (y < 0) {
      return 0;
    }

    return this.lines.length - 1;
  }

  private findLineIndexForPosition(position: number): number {
    let low = 0;
    let high = this.lines.length - 1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const line = this.lines[mid];

      if (position < line.startOffset) {
        high = mid - 1;
      } else if (position > line.endOffset) {
        low = mid + 1;
      } else {
        return mid;
      }
    }

    if (position <= (this.lines[0]?.startOffset ?? 0)) {
      return 0;
    }

    return this.lines.length - 1;
  }

  private fitSegmentToWidth(
    segment: PreparedSegment,
    startGraphemeIndex: number,
    maxWidth: number,
  ): {
    endGrapheme: number;
    width: number;
  } {
    const totalGraphemes = segment.boundaryOffsets.length - 1;
    let fittedEnd = startGraphemeIndex;
    let fittedWidth = 0;
    let lastBreakEnd = startGraphemeIndex;
    let lastBreakWidth = 0;

    for (
      let graphemeIndex = startGraphemeIndex + 1;
      graphemeIndex <= totalGraphemes;
      graphemeIndex++
    ) {
      const fragmentWidth = this.getSegmentWidthBetween(
        segment,
        startGraphemeIndex,
        graphemeIndex,
      );
      if (fragmentWidth > maxWidth + FIT_EPSILON) {
        break;
      }

      fittedEnd = graphemeIndex;
      fittedWidth = fragmentWidth;
      if (
        graphemeIndex < totalGraphemes &&
        this.canBreakInsideSegment(segment, graphemeIndex)
      ) {
        lastBreakEnd = graphemeIndex;
        lastBreakWidth = fragmentWidth;
      }
    }

    if (fittedEnd === totalGraphemes) {
      return {
        endGrapheme: fittedEnd,
        width: fittedWidth,
      };
    }

    if (lastBreakEnd > startGraphemeIndex) {
      return {
        endGrapheme: lastBreakEnd,
        width: lastBreakWidth,
      };
    }

    if (fittedEnd > startGraphemeIndex) {
      return {
        endGrapheme: fittedEnd,
        width: fittedWidth,
      };
    }

    const forcedEnd = Math.min(startGraphemeIndex + 1, totalGraphemes);
    return {
      endGrapheme: forcedEnd,
      width: this.getSegmentWidthBetween(
        segment,
        startGraphemeIndex,
        forcedEnd,
      ),
    };
  }

  private getCursorTextOffset(cursor: LayoutCursor): number {
    if (cursor.segmentIndex >= this.preparedSegments.length) {
      return this.preparedTextLength;
    }

    const segment = this.preparedSegments[cursor.segmentIndex];
    if (cursor.graphemeIndex <= 0) {
      return segment.start;
    }

    const localOffset =
      segment.boundaryOffsets[cursor.graphemeIndex] ?? segment.content.length;
    return segment.start + localOffset;
  }

  private getDefaultStyleForCursor(cursor: LayoutCursor): PreparedSpanStyle {
    if (cursor.segmentIndex >= this.preparedSegments.length) {
      return this.preparedSegments[this.preparedSegments.length - 1]?.font !=
        null
        ? this.preparedSegments[this.preparedSegments.length - 1]
        : this.defaultLineStyle;
    }

    return this.preparedSegments[cursor.segmentIndex];
  }

  private getSegmentWidthBetween(
    segment: PreparedSegment,
    startGraphemeIndex: number,
    endGraphemeIndex: number,
  ): number {
    const endWidth =
      segment.prefixWidths[endGraphemeIndex] ??
      segment.prefixWidths[segment.prefixWidths.length - 1] ??
      0;
    const startWidth = segment.prefixWidths[startGraphemeIndex] ?? 0;
    return endWidth - startWidth;
  }

  private layoutNextLine(
    startCursor: LayoutCursor,
    width: number,
  ): LineLayoutResult {
    const line = new ParagraphLine({
      defaultStyle: this.getDefaultStyleForCursor(startCursor),
      startOffset: this.getCursorTextOffset(startCursor),
    });
    const maxWidth = Number.isFinite(width) ? width : Infinity;
    let cursor: LayoutCursor = {
      graphemeIndex: startCursor.graphemeIndex,
      segmentIndex: startCursor.segmentIndex,
    };
    let pendingBreak: PendingBreak | null = null;

    const finalizePendingBreak = () => {
      if (
        pendingBreak?.hyphenSegment != null &&
        line.width + pendingBreak.hyphenSegment.hyphenWidth <=
          maxWidth + FIT_EPSILON
      ) {
        line.addSpanBox(
          this.createSyntheticSpanBox({
            content: "-",
            offset: pendingBreak.hyphenSegment.start,
            style: pendingBreak.hyphenSegment,
            width: pendingBreak.hyphenSegment.hyphenWidth,
          }),
        );
      }

      return {
        line,
        nextCursor: pendingBreak?.nextCursor ?? cursor,
        trailingBlankLineStyle: null,
      };
    };

    while (cursor.segmentIndex < this.preparedSegments.length) {
      const segment = this.preparedSegments[cursor.segmentIndex];

      if (segment.kind === "hard-break") {
        return {
          line,
          nextCursor: {
            graphemeIndex: 0,
            segmentIndex: cursor.segmentIndex + 1,
          },
          trailingBlankLineStyle:
            cursor.segmentIndex + 1 >= this.preparedSegments.length
              ? segment
              : null,
        };
      }

      if (segment.kind === "soft-hyphen") {
        pendingBreak = {
          hyphenSegment: segment,
          nextCursor: {
            graphemeIndex: 0,
            segmentIndex: cursor.segmentIndex + 1,
          },
        };
        cursor = {
          graphemeIndex: 0,
          segmentIndex: cursor.segmentIndex + 1,
        };
        continue;
      }

      const totalGraphemes = segment.boundaryOffsets.length - 1;
      const remainingWidth = this.getSegmentWidthBetween(
        segment,
        cursor.graphemeIndex,
        totalGraphemes,
      );

      if (
        !Number.isFinite(maxWidth) ||
        line.width + remainingWidth <= maxWidth + FIT_EPSILON
      ) {
        const spanBox = this.createSpanBoxFromSegment(
          segment,
          cursor.graphemeIndex,
          totalGraphemes,
        );
        if (spanBox != null) {
          line.addSpanBox(spanBox);
        }

        if (segment.kind === "space") {
          pendingBreak = {
            nextCursor: {
              graphemeIndex: 0,
              segmentIndex: cursor.segmentIndex + 1,
            },
          };
        }

        cursor = {
          graphemeIndex: 0,
          segmentIndex: cursor.segmentIndex + 1,
        };
        continue;
      }

      if (pendingBreak != null && line.spanBoxes.length > 0) {
        return finalizePendingBreak();
      }

      if (line.spanBoxes.length > 0) {
        return {
          line,
          nextCursor: cursor,
          trailingBlankLineStyle: null,
        };
      }

      const fitted = this.fitSegmentToWidth(
        segment,
        cursor.graphemeIndex,
        Math.max(0, maxWidth),
      );
      const spanBox = this.createSpanBoxFromSegment(
        segment,
        cursor.graphemeIndex,
        fitted.endGrapheme,
      );
      if (spanBox != null) {
        line.addSpanBox(spanBox);
      }

      return {
        line,
        nextCursor:
          fitted.endGrapheme >= totalGraphemes
            ? {
                graphemeIndex: 0,
                segmentIndex: cursor.segmentIndex + 1,
              }
            : {
                graphemeIndex: fitted.endGrapheme,
                segmentIndex: cursor.segmentIndex,
              },
        trailingBlankLineStyle: null,
      };
    }

    return {
      line,
      nextCursor: cursor,
      trailingBlankLineStyle: null,
    };
  }

  private prepare() {
    if (this.prepared) {
      return;
    }

    this.prepared = true;
    this.preparedSegments = [];
    this.preparedTextLength = 0;
    this.preparedIntrinsicWidth = 0;
    this.preparedIntrinsicHeight = this.defaultLineStyle.lineHeight;
    this.preparedLongestLine = 0;

    let lineWidth = 0;
    for (const sourceSpan of this.source) {
      const style = Paragraph.toPreparedStyle(sourceSpan);
      const spanStart = this.preparedTextLength;
      if (sourceSpan.content.length === 0) {
        continue;
      }

      const chunks = sourceSpan.content.split(/(\n)/u);
      let localOffset = 0;
      chunks.forEach(chunk => {
        if (chunk.length === 0) {
          return;
        }

        if (chunk === HARD_BREAK) {
          this.preparedSegments.push({
            ...style,
            boundaryOffsets: [],
            containsCJK: false,
            content: chunk,
            end: spanStart + localOffset + chunk.length,
            graphemes: [],
            hyphenWidth: 0,
            kind: "hard-break",
            prefixWidths: [],
            start: spanStart + localOffset,
          });
          this.preparedIntrinsicWidth = Math.max(
            this.preparedIntrinsicWidth,
            lineWidth,
          );
          lineWidth = 0;
          localOffset += chunk.length;
          return;
        }

        for (const part of segmentTextContent(chunk)) {
          for (const piece of splitSoftHyphen(part.text, part.start)) {
            const absoluteStart = spanStart + localOffset + piece.start;
            const segment = this.createPreparedSegment(
              style,
              piece.text,
              absoluteStart,
            );
            this.preparedSegments.push(segment);
            if (segment.kind !== "soft-hyphen") {
              lineWidth += this.getSegmentWidthBetween(
                segment,
                0,
                segment.boundaryOffsets.length - 1,
              );
            }
          }
        }

        localOffset += chunk.length;
      });

      this.preparedTextLength = spanStart + sourceSpan.content.length;
    }

    this.preparedIntrinsicWidth = Math.max(
      this.preparedIntrinsicWidth,
      lineWidth,
    );
    this.preparedLongestLine = this.preparedIntrinsicWidth;
  }

  get resolvedTextAlign(): TextAlign {
    if (this.textAlign === TextAlign.start) {
      return this.textDirection === TextDirection.ltr
        ? TextAlign.left
        : TextAlign.right;
    }

    if (this.textAlign === TextAlign.end) {
      return this.textDirection === TextDirection.ltr
        ? TextAlign.right
        : TextAlign.left;
    }

    return this.textAlign;
  }

  private static toPreparedStyle({
    color = defaultTextStyle.fontColor,
    fontFamily = defaultTextStyle.fontFamily,
    fontSize = defaultTextStyle.fontSize,
    fontStyle = FontStyle.normal,
    fontWeight = defaultTextStyle.fontWeight,
    height = defaultTextStyle.height,
  }: Partial<Span>): PreparedSpanStyle {
    const fontStyleValue = resolveFontStyle(fontStyle);
    return {
      color,
      font: getPooledFontString({
        fontFamily,
        fontSize,
        fontStyle: fontStyleValue,
        fontWeight,
      }),
      fontFamily,
      fontSize,
      fontStyle,
      fontStyleValue,
      fontWeight,
      height,
      lineHeight: getTextHeight({ fontSize }) * height,
    };
  }

  private canBreakInsideSegment(
    segment: PreparedSegment,
    graphemeIndex: number,
  ): boolean {
    if (graphemeIndex <= 0 || graphemeIndex >= segment.graphemes.length) {
      return false;
    }

    if (segment.kind === "space") {
      return true;
    }

    const previousGrapheme = segment.graphemes[graphemeIndex - 1];
    const nextGrapheme = segment.graphemes[graphemeIndex];

    if (
      LINE_END_PROHIBITED.has(previousGrapheme) ||
      LINE_START_PROHIBITED.has(nextGrapheme)
    ) {
      return false;
    }

    if (segment.containsCJK) {
      return true;
    }

    return segment.kind === "text";
  }
}

class SpanBox {
  boundaryOffsets: number[];
  color: string;
  content: string;
  endOffset: number;
  font: string;
  fontFamily: string;
  fontSize: number;
  fontStyle: FontStyle;
  fontStyleValue: string;
  fontWeight: string;
  height: number;
  offset: { x: number; y: number } = { x: 0, y: 0 };
  prefixWidths: number[];
  size: { width: number; height: number };
  startOffset: number;

  constructor({
    boundaryOffsets,
    color,
    content,
    endOffset,
    font,
    fontFamily,
    fontSize,
    fontStyle,
    fontStyleValue,
    fontWeight,
    height,
    prefixWidths,
    startOffset,
    width,
  }: Omit<PreparedSpanStyle, "lineHeight"> & {
    boundaryOffsets: number[];
    content: string;
    endOffset: number;
    lineHeight?: number;
    prefixWidths: number[];
    startOffset: number;
    width: number;
  }) {
    this.boundaryOffsets = boundaryOffsets;
    this.color = color;
    this.content = content;
    this.endOffset = endOffset;
    this.font = font;
    this.fontFamily = fontFamily;
    this.fontSize = fontSize;
    this.fontStyle = fontStyle;
    this.fontStyleValue = fontStyleValue;
    this.fontWeight = fontWeight;
    this.height = height;
    this.prefixWidths = prefixWidths;
    this.size = {
      height: getTextHeight({ fontSize }),
      width,
    };
    this.startOffset = startOffset;
  }

  clone(): SpanBox {
    return new SpanBox({
      boundaryOffsets: [...this.boundaryOffsets],
      color: this.color,
      content: this.content,
      endOffset: this.endOffset,
      font: this.font,
      fontFamily: this.fontFamily,
      fontSize: this.fontSize,
      fontStyle: this.fontStyle,
      fontStyleValue: this.fontStyleValue,
      fontWeight: this.fontWeight,
      height: this.height,
      prefixWidths: [...this.prefixWidths],
      startOffset: this.startOffset,
      width: this.size.width,
    });
  }

  fitBoundaryIndexForWidth(width: number): number {
    if (this.boundaryOffsets.length <= 1) {
      return 0;
    }

    let fittedBoundaryIndex = 0;
    for (let index = 1; index < this.prefixWidths.length; index++) {
      if (this.prefixWidths[index] > width + FIT_EPSILON) {
        break;
      }
      fittedBoundaryIndex = index;
    }

    return fittedBoundaryIndex;
  }

  positionForX(localX: number): number {
    if (
      this.startOffset === this.endOffset ||
      this.boundaryOffsets.length <= 1
    ) {
      return this.startOffset;
    }

    if (localX <= 0) {
      return this.startOffset;
    }

    if (localX >= this.size.width) {
      return this.endOffset;
    }

    for (let index = 1; index < this.prefixWidths.length; index++) {
      const nextWidth = this.prefixWidths[index];
      if (localX > nextWidth) {
        continue;
      }

      const previousWidth = this.prefixWidths[index - 1];
      const previousDistance = localX - previousWidth;
      const nextDistance = nextWidth - localX;
      const boundaryIndex =
        previousDistance <= nextDistance ? index - 1 : index;
      return this.startOffset + this.boundaryOffsets[boundaryIndex];
    }

    return this.endOffset;
  }

  sliceToBoundary(boundaryIndex: number): SpanBox {
    const safeBoundaryIndex = Math.max(
      0,
      Math.min(boundaryIndex, this.boundaryOffsets.length - 1),
    );
    const contentEnd = this.boundaryOffsets[safeBoundaryIndex];
    return new SpanBox({
      boundaryOffsets: this.boundaryOffsets.slice(0, safeBoundaryIndex + 1),
      color: this.color,
      content: this.content.slice(0, contentEnd),
      endOffset: this.startOffset + contentEnd,
      font: this.font,
      fontFamily: this.fontFamily,
      fontSize: this.fontSize,
      fontStyle: this.fontStyle,
      fontStyleValue: this.fontStyleValue,
      fontWeight: this.fontWeight,
      height: this.height,
      prefixWidths: this.prefixWidths.slice(0, safeBoundaryIndex + 1),
      startOffset: this.startOffset,
      width: this.prefixWidths[safeBoundaryIndex] ?? 0,
    });
  }

  xForPosition(position: number): number {
    if (
      this.startOffset === this.endOffset ||
      this.boundaryOffsets.length <= 1
    ) {
      return this.offset.x;
    }

    if (position <= this.startOffset) {
      return this.offset.x;
    }

    if (position >= this.endOffset) {
      return this.offset.x + this.size.width;
    }

    let resolvedBoundaryIndex = 0;
    for (let index = 1; index < this.boundaryOffsets.length; index++) {
      const boundaryOffset = this.startOffset + this.boundaryOffsets[index];
      if (position < boundaryOffset) {
        break;
      }
      resolvedBoundaryIndex = index;
    }

    return this.offset.x + (this.prefixWidths[resolvedBoundaryIndex] ?? 0);
  }
}

class ParagraphLine {
  defaultStyle: PreparedSpanStyle;
  endOffset: number;
  offsetY: number = 0;
  spanBoxes: SpanBox[] = [];
  startOffset: number;

  constructor({
    defaultStyle,
    startOffset,
  }: {
    defaultStyle: PreparedSpanStyle;
    startOffset: number;
  }) {
    this.defaultStyle = defaultStyle;
    this.endOffset = startOffset;
    this.startOffset = startOffset;
  }

  get height() {
    if (this.spanBoxes.length === 0) {
      return this.defaultStyle.lineHeight;
    }

    return this.spanBoxes.reduce(
      (acc, { size, height }) => Math.max(acc, size.height * height),
      0,
    );
  }

  get lastStyle(): PreparedSpanStyle | undefined {
    const lastSpanBox = this.spanBoxes[this.spanBoxes.length - 1];
    if (lastSpanBox == null) {
      return undefined;
    }

    return {
      color: lastSpanBox.color,
      font: lastSpanBox.font,
      fontFamily: lastSpanBox.fontFamily,
      fontSize: lastSpanBox.fontSize,
      fontStyle: lastSpanBox.fontStyle,
      fontStyleValue: lastSpanBox.fontStyleValue,
      fontWeight: lastSpanBox.fontWeight,
      height: lastSpanBox.height,
      lineHeight: lastSpanBox.size.height * lastSpanBox.height,
    };
  }

  get width() {
    return this.spanBoxes.reduce((acc, { size }) => acc + size.width, 0);
  }

  addSpanBox(spanBox: SpanBox) {
    this.spanBoxes.push(spanBox);
    this.endOffset = Math.max(this.endOffset, spanBox.endOffset);
    if (this.spanBoxes.length === 1) {
      this.startOffset = Math.min(this.startOffset, spanBox.startOffset);
    }
  }

  colorForPosition(position: number): string {
    const visibleBoxes = this.spanBoxes.filter(
      spanBox => spanBox.startOffset !== spanBox.endOffset,
    );
    if (visibleBoxes.length === 0) {
      return this.defaultStyle.color;
    }

    for (const spanBox of visibleBoxes) {
      if (position <= spanBox.endOffset) {
        return spanBox.color;
      }
    }

    return visibleBoxes[visibleBoxes.length - 1].color;
  }

  layout(
    textAlign: TextAlign,
    { paragraphWidth, offsetY }: { offsetY: number; paragraphWidth: number },
  ) {
    this.offsetY = offsetY;
    this.spanBoxes.forEach(spanBox => {
      spanBox.offset.y = offsetY - spanBox.size.height + this.height;
    });

    const effectiveParagraphWidth = Number.isFinite(paragraphWidth)
      ? paragraphWidth
      : this.width;

    switch (textAlign) {
      case TextAlign.left:
        this.alignHorizontally(0);
        break;
      case TextAlign.right:
        this.alignHorizontally(effectiveParagraphWidth - this.width);
        break;
      case TextAlign.center:
        this.alignHorizontally((effectiveParagraphWidth - this.width) / 2);
        break;
    }
  }

  positionForX(x: number): number {
    const visibleBoxes = this.spanBoxes.filter(
      spanBox => spanBox.startOffset !== spanBox.endOffset,
    );

    if (visibleBoxes.length === 0) {
      return this.startOffset;
    }

    if (x <= visibleBoxes[0].offset.x) {
      return visibleBoxes[0].startOffset;
    }

    const lastVisibleBox = visibleBoxes[visibleBoxes.length - 1];
    if (x >= lastVisibleBox.offset.x + lastVisibleBox.size.width) {
      return lastVisibleBox.endOffset;
    }

    for (const spanBox of visibleBoxes) {
      const boxStart = spanBox.offset.x;
      const boxEnd = boxStart + spanBox.size.width;
      if (x < boxStart) {
        return spanBox.startOffset;
      }
      if (x <= boxEnd) {
        return spanBox.positionForX(x - boxStart);
      }
    }

    return this.endOffset;
  }

  xForPosition(position: number): number {
    const visibleBoxes = this.spanBoxes.filter(
      spanBox => spanBox.startOffset !== spanBox.endOffset,
    );

    if (visibleBoxes.length === 0) {
      return 0;
    }

    if (position <= visibleBoxes[0].startOffset) {
      return visibleBoxes[0].offset.x;
    }

    for (const spanBox of visibleBoxes) {
      if (position <= spanBox.endOffset) {
        return spanBox.xForPosition(position);
      }
    }

    const lastVisibleBox = visibleBoxes[visibleBoxes.length - 1];
    return lastVisibleBox.offset.x + lastVisibleBox.size.width;
  }

  private alignHorizontally(offsetX: number) {
    let currentX = offsetX;
    this.spanBoxes.forEach(spanBox => {
      spanBox.offset.x = currentX;
      currentX += spanBox.size.width;
    });
  }
}
