import type InlineSpan from "../Inline-span";
import Utils, {
  assert,
  getPooledFontString,
  getTextWidth,
} from "../../../utils";
import type { SvgPaintContext } from "../../../framework";
import type Offset from "../_offset";
import { TextDirection, TextAlign, TextWidthBasis } from "../..";
import { FontStyle } from "../text-style";
import {
  measureSpanText,
  combineMeasuredSpans,
  type MeasuredSpanResult,
} from "./layout";
import type { PreparedLineBreakData } from "./line-break";
import { walkPreparedLines, type InternalLayoutLine } from "./line-break";
import type { SegmentBreakKind } from "./analysis";

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

const FIT_EPSILON = 0.005;

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

function resolveFontStyle(fontStyle: FontStyle = FontStyle.normal): string {
  return fontStyle === FontStyle.italic ? "italic" : "normal";
}

// Prepared segment info: tracks which source style each segment belongs to,
// plus the segment text and character offset for SpanBox creation.
type PreparedSegmentInfo = {
  style: PreparedSpanStyle;
  text: string;
  // Absolute character offset in the full paragraph text
  charStart: number;
  charEnd: number;
  kind: SegmentBreakKind;
};

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
  private preparedTextLength = 0;

  // Pretext pipeline data
  private preparedLineBreakData: PreparedLineBreakData | null = null;
  private preparedSegmentInfos: PreparedSegmentInfo[] = [];

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

    if (
      this.preparedLineBreakData == null ||
      this.preparedSegmentInfos.length === 0
    ) {
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
    const layoutLines: InternalLayoutLine[] = [];

    // Use pretext's fast line walker
    walkPreparedLines(this.preparedLineBreakData, width, line => {
      if (layoutLines.length < maxLineCount) {
        layoutLines.push(line);
      }
    });

    const isTruncated =
      layoutLines.length >= maxLineCount &&
      this.hasMoreContentAfterLine(layoutLines[layoutLines.length - 1]);

    // Convert InternalLayoutLines to ParagraphLines with SpanBoxes
    for (const layoutLine of layoutLines) {
      const paragraphLine = this.buildParagraphLine(layoutLine);
      this.lines.push(paragraphLine);
    }

    // Handle trailing blank line (when text ends with \n)
    if (
      !isTruncated &&
      layoutLines.length > 0 &&
      layoutLines.length < maxLineCount
    ) {
      const lastLayoutLine = layoutLines[layoutLines.length - 1]!;
      const lastSegIdx = lastLayoutLine.endSegmentIndex - 1;
      if (
        lastSegIdx >= 0 &&
        lastSegIdx < this.preparedSegmentInfos.length &&
        this.preparedSegmentInfos[lastSegIdx]!.kind === "hard-break"
      ) {
        const style = this.preparedSegmentInfos[lastSegIdx]!.style;
        this.lines.push(
          new ParagraphLine({
            defaultStyle: style,
            startOffset: this.preparedTextLength,
          }),
        );
      }
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

  private hasMoreContentAfterLine(
    line: InternalLayoutLine | undefined,
  ): boolean {
    if (line == null || this.preparedLineBreakData == null) return false;
    return (
      line.endSegmentIndex < this.preparedLineBreakData.widths.length ||
      line.endGraphemeIndex > 0
    );
  }

  /**
   * Build a ParagraphLine from an InternalLayoutLine by creating SpanBoxes
   * for each segment range [startSegmentIndex, endSegmentIndex).
   */
  private buildParagraphLine(layoutLine: InternalLayoutLine): ParagraphLine {
    const startSegIdx = layoutLine.startSegmentIndex;
    const endSegIdx = layoutLine.endSegmentIndex;

    // Determine default style from the first segment in this line
    const defaultStyle =
      startSegIdx < this.preparedSegmentInfos.length
        ? this.preparedSegmentInfos[startSegIdx]!.style
        : this.defaultLineStyle;

    const startOffset =
      startSegIdx < this.preparedSegmentInfos.length
        ? this.preparedSegmentInfos[startSegIdx]!.charStart
        : this.preparedTextLength;

    const paragraphLine = new ParagraphLine({
      defaultStyle,
      startOffset,
    });

    if (startSegIdx >= endSegIdx) {
      return paragraphLine;
    }

    // Group consecutive segments with the same style into single SpanBoxes
    let groupStart = startSegIdx;
    let groupStyle = this.preparedSegmentInfos[startSegIdx]!.style;
    let groupStartGrapheme = layoutLine.startGraphemeIndex;

    for (let i = startSegIdx; i < endSegIdx; i++) {
      const info = this.preparedSegmentInfos[i];
      if (info == null) continue;

      // Skip non-visual segments
      if (info.kind === "hard-break" || info.kind === "soft-hyphen") {
        // Flush current group first
        if (i > groupStart) {
          const spanBox = this.buildSpanBoxForRange(
            groupStart,
            i,
            groupStartGrapheme,
            0,
            groupStyle,
          );
          if (spanBox != null) {
            paragraphLine.addSpanBox(spanBox);
          }
        }
        groupStart = i + 1;
        groupStartGrapheme = 0;
        if (groupStart < this.preparedSegmentInfos.length) {
          groupStyle = this.preparedSegmentInfos[groupStart]!.style;
        }
        continue;
      }

      // Style change — flush group
      if (
        info.style.font !== groupStyle.font ||
        info.style.color !== groupStyle.color
      ) {
        if (i > groupStart) {
          const spanBox = this.buildSpanBoxForRange(
            groupStart,
            i,
            groupStartGrapheme,
            0,
            groupStyle,
          );
          if (spanBox != null) {
            paragraphLine.addSpanBox(spanBox);
          }
        }
        groupStart = i;
        groupStartGrapheme = 0;
        groupStyle = info.style;
      }
    }

    // Flush final group
    if (groupStart < endSegIdx) {
      const endGrapheme = layoutLine.endGraphemeIndex;
      const spanBox = this.buildSpanBoxForRange(
        groupStart,
        endSegIdx,
        groupStartGrapheme,
        endGrapheme,
        groupStyle,
      );
      if (spanBox != null) {
        paragraphLine.addSpanBox(spanBox);
      }
    }

    return paragraphLine;
  }

  /**
   * Build a SpanBox covering segments [startSeg, endSeg) with the given style.
   * startGrapheme/endGrapheme handle partial segments at line boundaries.
   */
  private buildSpanBoxForRange(
    startSeg: number,
    endSeg: number,
    startGrapheme: number,
    endGrapheme: number,
    style: PreparedSpanStyle,
  ): SpanBox | null {
    if (startSeg >= endSeg) return null;
    if (this.preparedLineBreakData == null) return null;

    const { widths, breakableFitAdvances } = this.preparedLineBreakData;
    let content = "";
    let totalWidth = 0;
    let charStart = this.preparedSegmentInfos[startSeg]?.charStart ?? 0;
    let charEnd = charStart;
    const boundaryOffsets: number[] = [0];
    const prefixWidths: number[] = [0];

    for (let i = startSeg; i < endSeg; i++) {
      const info = this.preparedSegmentInfos[i];
      if (info == null) continue;
      if (info.kind === "hard-break" || info.kind === "soft-hyphen") continue;

      const segText = info.text;
      const segWidth = widths[i] ?? 0;

      // Handle partial first segment (startGrapheme > 0)
      if (
        i === startSeg &&
        startGrapheme > 0 &&
        breakableFitAdvances[i] != null
      ) {
        const fitAdvances = breakableFitAdvances[i]!;
        // Build partial content from graphemes
        const graphemes = this.getSegmentGraphemes(segText);
        let partialText = "";
        let partialWidth = 0;
        for (let g = startGrapheme; g < graphemes.length; g++) {
          partialText += graphemes[g];
          partialWidth += fitAdvances[g] ?? 0;
          boundaryOffsets.push(content.length + partialText.length);
          prefixWidths.push(totalWidth + partialWidth);
        }
        content += partialText;
        totalWidth += partialWidth;
        charStart =
          info.charStart + this.graphemeOffset(segText, startGrapheme);
        charEnd = info.charEnd;
        continue;
      }

      // Handle partial last segment (endGrapheme > 0)
      if (
        i === endSeg - 1 &&
        endGrapheme > 0 &&
        breakableFitAdvances[i] != null
      ) {
        const fitAdvances = breakableFitAdvances[i]!;
        const graphemes = this.getSegmentGraphemes(segText);
        let partialText = "";
        let partialWidth = 0;
        const graphemeStart = i === startSeg ? startGrapheme : 0;
        for (
          let g = graphemeStart;
          g < endGrapheme && g < graphemes.length;
          g++
        ) {
          partialText += graphemes[g];
          partialWidth += fitAdvances[g] ?? 0;
          boundaryOffsets.push(content.length + partialText.length);
          prefixWidths.push(totalWidth + partialWidth);
        }
        content += partialText;
        totalWidth += partialWidth;
        if (i === startSeg) {
          charStart =
            info.charStart + this.graphemeOffset(segText, startGrapheme);
        }
        charEnd = info.charStart + this.graphemeOffset(segText, endGrapheme);
        continue;
      }

      // Full segment
      content += segText;
      totalWidth += segWidth;
      // Add per-grapheme boundaries for text segments
      if (breakableFitAdvances[i] != null) {
        const fitAdvances = breakableFitAdvances[i]!;
        const graphemes = this.getSegmentGraphemes(segText);
        let runWidth = totalWidth - segWidth;
        for (let g = 0; g < graphemes.length; g++) {
          runWidth += fitAdvances[g] ?? 0;
          boundaryOffsets.push(
            content.length -
              segText.length +
              this.graphemeEndOffset(graphemes, g),
          );
          prefixWidths.push(runWidth);
        }
      } else {
        boundaryOffsets.push(content.length);
        prefixWidths.push(totalWidth);
      }
      charEnd = info.charEnd;
    }

    if (content.length === 0) return null;

    return new SpanBox({
      boundaryOffsets,
      color: style.color,
      content,
      endOffset: charEnd,
      font: style.font,
      fontFamily: style.fontFamily,
      fontSize: style.fontSize,
      fontStyle: style.fontStyle,
      fontStyleValue: style.fontStyleValue,
      fontWeight: style.fontWeight,
      height: style.height,
      prefixWidths,
      startOffset: charStart,
      width: totalWidth,
    });
  }

  private segmentGraphemeCache = new Map<string, string[]>();

  private getSegmentGraphemes(text: string): string[] {
    let cached = this.segmentGraphemeCache.get(text);
    if (cached != null) return cached;

    if (typeof Intl !== "undefined" && typeof Intl.Segmenter === "function") {
      const segmenter = new Intl.Segmenter(undefined, {
        granularity: "grapheme",
      });
      cached = [];
      for (const gs of segmenter.segment(text)) {
        cached.push(gs.segment);
      }
    } else {
      cached = Array.from(text);
    }
    this.segmentGraphemeCache.set(text, cached);
    return cached;
  }

  private graphemeOffset(text: string, graphemeIndex: number): number {
    const graphemes = this.getSegmentGraphemes(text);
    let offset = 0;
    for (let i = 0; i < graphemeIndex && i < graphemes.length; i++) {
      offset += graphemes[i]!.length;
    }
    return offset;
  }

  private graphemeEndOffset(
    graphemes: string[],
    graphemeIndex: number,
  ): number {
    let offset = 0;
    for (let i = 0; i <= graphemeIndex && i < graphemes.length; i++) {
      offset += graphemes[i]!.length;
    }
    return offset;
  }

  private getCursorTextOffset(segmentIndex: number): number {
    if (segmentIndex >= this.preparedSegmentInfos.length) {
      return this.preparedTextLength;
    }
    return this.preparedSegmentInfos[segmentIndex]!.charStart;
  }

  /**
   * Pretext-based prepare: analyze and measure each source span, then combine
   * into a single PreparedLineBreakData for the line walker.
   */
  private prepare() {
    if (this.prepared) {
      return;
    }

    this.prepared = true;
    this.preparedSegmentInfos = [];
    this.preparedTextLength = 0;
    this.preparedIntrinsicWidth = 0;
    this.preparedIntrinsicHeight = this.defaultLineStyle.lineHeight;
    this.preparedLongestLine = 0;
    this.preparedLineBreakData = null;
    this.segmentGraphemeCache.clear();

    const measuredSpans: MeasuredSpanResult[] = [];

    for (const sourceSpan of this.source) {
      if (sourceSpan.content.length === 0) {
        continue;
      }

      const style = Paragraph.toPreparedStyle(sourceSpan);
      const spanStart = this.preparedTextLength;

      // Use pretext's analyzeText + measureAnalysis pipeline
      const measured = measureSpanText(sourceSpan.content, style.font, {
        whiteSpace: "pre-line",
      });
      measuredSpans.push(measured);

      // Build segment info for SpanBox creation
      for (let i = 0; i < measured.segments.length; i++) {
        const segText = measured.segments[i]!;
        const segStart = measured.segmentStarts[i]!;
        const segKind = measured.kinds[i]!;

        this.preparedSegmentInfos.push({
          style,
          text: segText,
          charStart: spanStart + segStart,
          charEnd: spanStart + segStart + segText.length,
          kind: segKind,
        });
      }

      this.preparedTextLength = spanStart + sourceSpan.content.length;
    }

    // Combine all measured spans into a single PreparedLineBreakData
    const { prepared, segments, segmentStarts } =
      combineMeasuredSpans(measuredSpans);
    this.preparedLineBreakData = prepared;

    // Compute intrinsic width (widest line at infinite width)
    if (prepared.widths.length > 0) {
      let lineWidth = 0;
      walkPreparedLines(prepared, Infinity, line => {
        if (line.width > lineWidth) {
          lineWidth = line.width;
        }
      });
      this.preparedIntrinsicWidth = lineWidth;
    }

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
