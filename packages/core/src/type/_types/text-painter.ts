import type InlineSpan from "./Inline-span";
import { RenderComparison } from "./Inline-span";
import Utils, { assert, getTextWidth } from "../../utils";
import type { SvgPaintContext } from "../../framework";
import type Offset from "./_offset";
import { graphemes, segmentText } from "./text-segments";
import { getTextFont, getTextMeasurementGeneration } from "../../utils/getTextSize";

function getTextHeight({ fontSize }: { fontSize: number }) {
  return fontSize;
}

import { TextDirection, TextAlign, TextWidthBasis } from "..";
import { FontStyle } from "./text-style";

const defaultTextStyle = {
  fontFamily: "serif",
  fontSize: 16,
  fontWeight: "normal",
  fontColor: "black",
};

export default class TextPainter {
  #text?: InlineSpan;

  get text(): InlineSpan | undefined {
    return this.#text;
  }

  set text(value: InlineSpan | undefined) {
    if (this.#text === value) return;
    const comparison =
      this.#text == null || value == null
        ? RenderComparison.layout
        : this.#text.compareTo(value);
    this.#text = value;
    if (comparison >= RenderComparison.layout) {
      this.markNeedsLayout();
      return;
    }
    // The cached paragraph's geometry is still valid for the new span; re-key
    // the cache to the new reference so the next layout() keeps hitting it.
    this.#cachedText = value;
    if (comparison >= RenderComparison.paint) {
      // Paint properties (color) are baked into the paragraph's span boxes,
      // so the paragraph must be rebuilt from the new span before it is
      // painted again — see #ensureParagraphForPaint.
      this.#rebuildParagraphForPaint = true;
    }
  }

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

  // Layout cache — mirrors Flutter's TextPainter._layoutCache. A laid-out
  // paragraph is fully determined by its inputs, so when none of them changed
  // since the last layout we keep the existing paragraph instead of rebuilding
  // and re-measuring every word. This is the "compute once" payoff for repeated
  // relayouts (animation frames, parent-driven relayouts with stable text).
  #cachedText?: InlineSpan;
  #cachedMinWidth = NaN;
  #cachedMaxWidth = NaN;
  #cachedTextAlign?: TextAlign;
  #cachedTextDirection?: TextDirection;
  #cachedTextScaleFactor = NaN;
  #cachedMaxLines?: number;
  #cachedTextWidthBasis?: TextWidthBasis;
  #cachedEllipsis?: string;
  #cachedMeasurementGeneration = -1;

  // Whether the cached paragraph holds outdated paint information (set by a
  // paint-tier text change) and must be rebuilt before the next paint.
  #rebuildParagraphForPaint = false;

  /** Invalidate the cached paragraph, forcing the next layout to rebuild. */
  markNeedsLayout(): void {
    this.#cachedText = undefined;
    this.#cachedMinWidth = NaN;
    this.#cachedMaxWidth = NaN;
  }

  // Paint-tier changes preserve the existing measured boxes and line breaks.
  // Build only the resolved source spans, then copy their fill colors by index.
  #ensureParagraphForPaint(): void {
    if (!this.#rebuildParagraphForPaint) return;
    this.#rebuildParagraphForPaint = false;
    if (this.paragraph == null) return;
    const paragraph = this.createParagraph(this.text);
    if (!this.paragraph.updatePaint(paragraph.source)) {
      // Conservative fallback for custom InlineSpan implementations whose
      // compareTo understates a geometry change.
      paragraph.layout(this.paragraph.width);
      this.paragraph = paragraph;
    }
  }

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
    this.#ensureParagraphForPaint();
    assert(this.paragraph != null, "paragraph should not be null");
    ctx.textAlign = "start";
    ctx.textBaseline = "hanging";
    let lastFont: string | undefined;
    let lastColor: string | undefined;
    this.paragraph.lines.forEach(line => {
      line.spanBoxes.forEach(
        ({
          offset: { x, y },
          fontFamily,
          content,
          fontSize,
          fontWeight,
          fontStyle,
          color,
        }) => {
          const font = `${fontStyle === FontStyle.italic ? "italic " : ""}${fontWeight} ${fontSize}px ${fontFamily}`;
          if (lastFont !== font) ctx.font = lastFont = font;
          if (lastColor !== color) ctx.fillStyle = lastColor = color;
          ctx.fillText(content, x + offset.x, y + offset.y);
        },
      );
    });
  }

  paintOnSvg(textEl: SVGTextElement, { createSvgEl }: SvgPaintContext) {
    this.#ensureParagraphForPaint();
    this.resetText(textEl);
    assert(this.paragraph != null, "paragraph should not be null");

    this.paragraph!.lines.forEach(line => {
      line.spanBoxes.forEach(
        ({ offset, fontFamily, content, fontSize, fontWeight, fontStyle, color }) => {
          const tspanEl = createSvgEl("tspan");
          tspanEl.setAttribute("x", `${offset.x}`);
          tspanEl.setAttribute("y", `${offset.y}`);
          tspanEl.setAttribute("text-anchor", "start");
          tspanEl.setAttribute("dominant-baseline", "hanging");
          tspanEl.setAttribute("fill", color);
          tspanEl.setAttribute("font-size", `${fontSize}`);
          tspanEl.setAttribute("font-family", `${fontFamily}`);
          tspanEl.setAttribute("font-weight", fontWeight);
          tspanEl.setAttribute("font-style", fontStyle === FontStyle.italic ? "italic" : "normal");
          tspanEl.textContent = content;
          textEl.appendChild(tspanEl);
        },
      );
    });
  }

  private createParagraph(text?: InlineSpan): Paragraph {
    return new Paragraph(text ?? null, {
      textAlign: this.textAlign,
      ellipsis: this.ellipsis,
      maxLines: this.maxLines,
      textDirection: this.textDirection || TextDirection.ltr,
    });
  }

  private resetText(textEl: SVGTextElement) {
    while (textEl.firstChild) {
      textEl.removeChild(textEl.firstChild);
    }
  }

  layout({
    minWidth = 0,
    maxWidth = Infinity,
  }: {
    minWidth?: number;
    maxWidth?: number;
  } = {}) {
    const nonWidthInputsUnchanged =
      this.paragraph != null &&
      this.#cachedMeasurementGeneration === getTextMeasurementGeneration() &&
      this.#cachedText === this.text &&
      this.#cachedTextAlign === this.textAlign &&
      this.#cachedTextDirection === this.textDirection &&
      this.#cachedTextScaleFactor === this.textScaleFactor &&
      this.#cachedMaxLines === this.maxLines &&
      this.#cachedTextWidthBasis === this.textWidthBasis &&
      this.#cachedEllipsis === this.ellipsis;

    if (nonWidthInputsUnchanged) {
      if (
        this.#cachedMinWidth === minWidth &&
        this.#cachedMaxWidth === maxWidth
      ) {
        // Inputs unchanged since the last layout — reuse the existing paragraph.
        return;
      }

      if (this.#canReuseLineBreaks(maxWidth)) {
        // Width-only change that provably cannot move a line break — keep the
        // measured lines and just recompute the paragraph width and the
        // alignment offsets the way a full layout would.
        this.#resizeParagraph(minWidth, maxWidth);
        this.#cachedMinWidth = minWidth;
        this.#cachedMaxWidth = maxWidth;
        return;
      }
    }

    if (nonWidthInputsUnchanged) {
      // A narrower width may change wrapping, but the resolved source spans
      // are unchanged. Keep the paragraph and only run its layout phase.
      this.#ensureParagraphForPaint();
    } else {
      this.paragraph = this.createParagraph(this.text);
      this.#rebuildParagraphForPaint = false;
    }
    this.layoutParagraph({ minWidth, maxWidth });

    this.#cachedMeasurementGeneration = getTextMeasurementGeneration();
    this.#cachedText = this.text;
    this.#cachedMinWidth = minWidth;
    this.#cachedMaxWidth = maxWidth;
    this.#cachedTextAlign = this.textAlign;
    this.#cachedTextDirection = this.textDirection;
    this.#cachedTextScaleFactor = this.textScaleFactor;
    this.#cachedMaxLines = this.maxLines;
    this.#cachedTextWidthBasis = this.textWidthBasis;
    this.#cachedEllipsis = this.ellipsis;
  }

  // A soft line break can only occur when a line's accumulated content width
  // exceeds the available width. `intrinsicWidth` is the sum of every span
  // box, which no per-line accumulation can exceed, so when both the width
  // the cached lines were broken at and the requested width are at least that
  // total, neither layout can soft-wrap: every break comes from an explicit
  // "\n" and the line composition is provably identical.
  #canReuseLineBreaks(maxWidth: number): boolean {
    const contentWidth = this.paragraph!.intrinsicWidth;
    return !this.paragraph!.didExceedMaxLines &&
      this.#cachedMaxWidth >= contentWidth && maxWidth >= contentWidth;
  }

  // Mirrors the width selection of layoutParagraph (same operations, same
  // order, so the resulting width is bit-identical), but reuses the already
  // measured lines instead of re-running word wrap.
  #resizeParagraph(minWidth: number, maxWidth: number): void {
    const paragraph = this.paragraph!;
    let newWidth = maxWidth;
    if (minWidth !== maxWidth) {
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
    }
    if (newWidth !== paragraph.width) {
      paragraph.resize(newWidth);
    }
  }

  private layoutParagraph({
    minWidth = 0,
    maxWidth = Infinity,
  }: {
    minWidth?: number;
    maxWidth?: number;
  }) {
    this.paragraph!.layout(maxWidth);

    // A truncated paragraph must retain the available width: its visible
    // content is no longer a valid estimate of the untruncated intrinsic width.
    if (this.paragraph!.didExceedMaxLines) return;
    if (minWidth !== maxWidth) {
      let newWidth: number;
      switch (this.textWidthBasis) {
        case TextWidthBasis.longestLine:
          newWidth = this.paragraph!.longestLine;
          break;
        case TextWidthBasis.parent:
          newWidth = this.intrinsicWidth;
          break;
        default:
          assert(false, `Unknown text width basis: ${this.textWidthBasis}`);
      }
      newWidth = Utils.clampDouble(newWidth, minWidth, maxWidth);

      if (newWidth !== this.paragraph!.width) {
        this.paragraph!.layout(newWidth);
      }
    }
  }
}

export class Paragraph {
  ellipsis?: string;
  maxLines?: number;
  didExceedMaxLines = false;
  private prepared?: PreparedSegment[];
  private characterLines?: CharacterLine[];
  private preparedWidths = new Map<string, Map<string, number>>();
  source: Span[] = [];
  lines: ParagraphLine[] = [];
  textDirection: TextDirection;
  textAlign: TextAlign;

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
    assert(maxLines == null || (Number.isInteger(maxLines) && maxLines > 0), "maxLines must be a positive integer");
    this.maxLines = maxLines;
    this.ellipsis = ellipsis;
    this.textAlign = textAlign;
    this.textDirection = textDirection;
    this.build(text);
  }

  build(text: InlineSpan | null) {
    text?.build(this);
  }

  // It is only valid after layout call
  width: number = 0;

  get height(): number {
    return this.lines.reduce((acc, line) => acc + line.height, 0);
  }

  get longestLine(): number {
    return this.lines.reduce((acc, line) => Math.max(acc, line.width), 0);
  }

  get intrinsicWidth(): number {
    return this.lines.reduce((acc, line) => acc + line.width, 0);
  }

  get intrinsicHeight(): number {
    return this.lines.reduce((acc, line) => Math.max(acc + line.height), 0);
  }

  /** Update fill colors without tokenizing, measuring or breaking lines. */
  updatePaint(source: Span[]): boolean {
    if (source.length !== this.source.length) return false;
    for (let i = 0; i < source.length; i++) {
      const a = source[i];
      const b = this.source[i];
      if (
        a.content !== b.content ||
        a.fontSize !== b.fontSize ||
        a.fontFamily !== b.fontFamily ||
        a.fontWeight !== b.fontWeight ||
        a.fontStyle !== b.fontStyle ||
        a.height !== b.height
      )
        return false;
    }
    for (const line of this.lines) {
      for (const box of line.spanBoxes)
        box.color = source[box.sourceIndex].color;
    }
    this.source = source;
    this.characterLines = undefined;
    return true;
  }

  /** Resolve boundaries once. Widths are prepared lazily so truncated tails
   * never reach measureText; each visible (segment, font) is then reusable. */
  prepare(): PreparedSegment[] {
    if (this.prepared) return this.prepared;
    const text = this.source.map(span => span.content).join("");
    const segments = segmentText(text);
    let sourceIndex = 0;
    let sourceStart = 0;
    this.prepared = segments.map(segment => {
      const parts: PreparedPart[] = [];
      while (sourceIndex < this.source.length && sourceStart + this.source[sourceIndex].content.length <= segment.start) {
        sourceStart += this.source[sourceIndex++].content.length;
      }
      let index = sourceIndex;
      let start = sourceStart;
      while (index < this.source.length && start < segment.end) {
        const source = this.source[index];
        const from = Math.max(start, segment.start);
        const to = Math.min(start + source.content.length, segment.end);
        if (to > from) parts.push({
          sourceIndex: index,
          textStart: from,
          textEnd: to,
          content: text.slice(from, to),
          font: getTextFont({ ...source, italic: source.fontStyle === FontStyle.italic }),
        });
        start += source.content.length;
        index++;
      }
      return { ...segment, parts };
    });
    return this.prepared;
  }

  private measureText(text: string, font: string): number {
    let widths = this.preparedWidths.get(font);
    if (!widths) this.preparedWidths.set(font, widths = new Map());
    let width = widths.get(text);
    if (width === undefined) {
      width = getTextWidth({ text, font });
      widths.set(text, width);
    }
    return width;
  }

  private measure(part: PreparedPart): number {
    return part.width ??= /^[\r\n\u00ad]+$/.test(part.content)
      ? 0
      : this.measureText(part.content, part.font);
  }

  private box(part: PreparedPart, content = part.content, width = this.measure(part)): SpanBox {
    return new SpanBox({
      ...this.source[part.sourceIndex],
      sourceIndex: part.sourceIndex,
      textStart: part.textStart,
      textEnd: part.textEnd,
      content,
      size: { width, height: this.source[part.sourceIndex].fontSize },
    });
  }

  layout(width: number = Infinity) {
    this.width = width;
    this.lines = [];
    this.characterLines = undefined;
    this.didExceedMaxLines = false;
    const segments = this.prepare();
    let currentLine = new ParagraphLine();
    let discretionaryBreak: PreparedPart | undefined;
    const lastLine = () => this.maxLines != null && this.lines.length + 1 >= this.maxLines;
    const finish = () => {
      this.lines.push(currentLine);
      currentLine = new ParagraphLine();
      discretionaryBreak = undefined;
    };
    const truncate = () => {
      this.didExceedMaxLines = true;
      if (this.ellipsis) this.ellipsize(currentLine, width);
    };

    for (let index = 0; index < segments.length; index++) {
      const segment = segments[index];
      if (/^[\r\n]/.test(segment.content)) {
        // The newline belongs to the line it terminates, including empty lines.
        for (const part of segment.parts) currentLine.addSpanBox(this.box(part, "", 0));
        if (lastLine()) { truncate(); break; }
        finish();
        // A trailing hard break still creates an empty final line.
        if (index === segments.length - 1 && (this.maxLines == null || this.lines.length < this.maxLines)) {
          const part = segment.parts[segment.parts.length - 1];
          currentLine.addSpanBox(this.box({ ...part, textStart: part.textEnd }, "", 0));
        }
        continue;
      }
      if (segment.content === "\u00ad") {
        discretionaryBreak = segment.parts[0];
        currentLine.addSpanBox(this.box(discretionaryBreak, "", 0));
        continue;
      }
      const segmentWidth = segment.parts.reduce((total, part) => total + this.measure(part), 0);
      if (currentLine.spanBoxes.length > 0 && currentLine.width + segmentWidth > width) {
        if (lastLine()) { truncate(); break; }
        if (discretionaryBreak) {
          const hyphen = this.measureText("-", discretionaryBreak.font);
          if (currentLine.width + hyphen <= width) {
            currentLine.addSpanBox(this.box(discretionaryBreak, "-", hyphen));
            finish();
          }
        } else finish();
      }
      discretionaryBreak = undefined;
      for (const part of segment.parts) currentLine.addSpanBox(this.box(part));
      if (currentLine.width > width && this.ellipsis && (this.maxLines == null || lastLine())) {
        truncate();
        break;
      }
    }
    if (currentLine.spanBoxes.length > 0) this.lines.push(currentLine);
    this.align();
  }

  private ellipsize(line: ParagraphLine, width: number): void {
    const last = line.spanBoxes[line.spanBoxes.length - 1];
    if (!last) return;
    const font = getTextFont({ ...last, italic: last.fontStyle === FontStyle.italic });
    const ellipsisWidth = this.measureText(this.ellipsis!, font);
    const kept: SpanBox[] = [];
    let used = 0;
    for (const box of line.spanBoxes) {
      if (used + box.size.width + ellipsisWidth <= width) {
        kept.push(box);
        used += box.size.width;
        continue;
      }
      const boxFont = getTextFont({ ...box, italic: box.fontStyle === FontStyle.italic });
      let content = "";
      let contentWidth = 0;
      for (const grapheme of graphemes(box.content)) {
        const candidate = content + grapheme.segment;
        const candidateWidth = this.measureText(candidate, boxFont);
        if (used + candidateWidth + ellipsisWidth > width) break;
        content = candidate;
        contentWidth = candidateWidth;
      }
      if (content) kept.push(new SpanBox({ ...box, content,
        textEnd: box.textStart + content.length,
        size: { ...box.size, width: contentWidth },
      }));
      break;
    }
    const textEnd = kept[kept.length - 1]?.textEnd ?? last.textStart;
    // An ellipsis wider than the constraint is itself clipped by omitting it.
    if (ellipsisWidth <= width) kept.push(new SpanBox({ ...last,
      content: this.ellipsis!, textStart: textEnd, textEnd,
      size: { ...last.size, width: ellipsisWidth },
    }));
    if (kept.length === 0) kept.push(new SpanBox({ ...last,
      content: "", textStart: textEnd, textEnd, size: { ...last.size, width: 0 },
    }));
    line.replaceSpanBoxes(kept);
  }

  /** UTF-16 ranges agree with textarea selectionStart/End. Measure prefixes
   * only when editing needs them, preserving kerning and grapheme boundaries. */
  getCharacterLines(): CharacterLine[] {
    if (this.characterLines) return this.characterLines;
    this.characterLines = this.lines.map(line => ({
      height: line.height,
      spanBoxes: line.spanBoxes.flatMap(box => {
        if (!box.content) return [box];
        const font = getTextFont({ ...box, italic: box.fontStyle === FontStyle.italic });
        let previousWidth = 0;
        const characters = graphemes(box.content);
        // Prefix shaping is exact for ordinary words. Bound work for pasted
        // megawords: individual advances scaled to the measured segment avoid
        // quadratic prefix strings and keep the final caret at the painted end.
        const advances = characters.length > 256
          ? characters.map(character => this.measureText(character.segment, font))
          : undefined;
        const advanceTotal = advances?.reduce((sum, advance) => sum + advance, 0) ?? 0;
        let advance = 0;
        return characters.map(({ segment, index }, characterIndex) => {
          const end = index + segment.length;
          if (advances) advance += advances[characterIndex];
          const width = end === box.content.length ? box.size.width
            : advances ? box.size.width * advance / (advanceTotal || 1)
            : Math.min(box.size.width, this.measureText(box.content.slice(0, end), font));
          const character = new SpanBox({ ...box, content: segment,
            textStart: box.textStart + index, textEnd: box.textStart + end,
            size: { ...box.size, width: Math.max(0, width - previousWidth) },
          });
          character.offset = { x: box.offset.x + previousWidth, y: box.offset.y };
          previousWidth = width;
          return character;
        });
      }),
    }));
    return this.characterLines;
  }

  /**
   * Repositions the existing lines for a new paragraph width without
   * re-measuring or re-breaking. Only valid when the caller has proven that
   * no soft line break can change at either the old or the new width: the
   * alignment pass is the same one a full layout ends with, so the resulting
   * offsets are bit-identical to a full relayout.
   */
  resize(width: number): void {
    this.characterLines = undefined;
    this.width = width;
    this.align();
  }

  private align() {
    let currentHeight = 0;

    this.lines.forEach(line => {
      line.layout(this.resolvedTextAlign, {
        paragraphWidth: this.width,
        offsetY: currentHeight,
      });
      currentHeight += line.height;
    });
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

  addText({
    fontFamily = defaultTextStyle.fontFamily,
    fontSize = defaultTextStyle.fontSize,
    fontWeight = defaultTextStyle.fontWeight,
    content = "",
    height = 1.2,
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
    this.prepared = undefined;
    this.source.push({
      height,
      fontFamily,
      fontSize,
      fontWeight,
      content,
      color,
      fontStyle,
    });
  }
}

type Span = {
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
  fontStyle: FontStyle;
  color: string;
  content: string;
  /// The height of this text span, as a multiple of the font size.
  ///
  /// When [height] is null or omitted, the line height will be determined
  /// by the font's metrics directly, which may differ from the fontSize.
  /// When [height] is non-null, the line height of the span of text will be a
  /// multiple of [fontSize] and be exactly `fontSize * height` logical pixels
  /// tall.
  height: number; // this is line height
};

type PreparedPart = {
  sourceIndex: number;
  content: string;
  textStart: number;
  textEnd: number;
  font: string;
  width?: number;
};
type PreparedSegment = {
  content: string;
  start: number;
  end: number;
  parts: PreparedPart[];
};
type CharacterLine = { height: number; spanBoxes: SpanBox[] };

class SpanBox {
  readonly sourceIndex: number;
  readonly textStart: number;
  readonly textEnd: number;
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
  fontStyle: FontStyle;
  color: string;
  content: string;
  height: number; // this is line height
  size: { width: number; height: number };
  offset: { x: number; y: number } = { x: 0, y: 0 };

  constructor({
    sourceIndex,
    textStart,
    textEnd,
    fontFamily,
    fontSize,
    fontStyle,
    fontWeight,
    color,
    content,
    height,
    size,
  }: Span & { sourceIndex: number; textStart: number; textEnd: number; size: { width: number; height: number } }) {
    this.sourceIndex = sourceIndex;
    this.textStart = textStart;
    this.textEnd = textEnd;
    this.fontFamily = fontFamily;
    this.fontStyle = fontStyle;
    this.fontWeight = fontWeight;
    this.color = color;
    this.content = content;
    this.height = height;
    this.size = size;
    this.fontSize = fontSize;
  }
}

class ParagraphLine {
  spanBoxes: SpanBox[] = [];
  private measuredWidth = 0;
  private measuredHeight = 0;

  get height() {
    return this.measuredHeight;
  }

  get width() {
    return this.measuredWidth;
  }

  layout(
    textAlign: TextAlign,
    { paragraphWidth, offsetY }: { offsetY: number; paragraphWidth: number },
  ) {
    this.spanBoxes.forEach(spanBox => {
      spanBox.offset.y = offsetY - spanBox.size.height + this.height;
    });

    switch (textAlign) {
      case TextAlign.left:
        this.alignHorizontally(0);
        break;
      case TextAlign.right:
        this.alignHorizontally(paragraphWidth - this.width);
        break;
      case TextAlign.center:
        this.alignHorizontally((paragraphWidth - this.width) / 2);
        break;
    }
  }

  private alignHorizontally(offsetX: number) {
    let currentX = offsetX;
    this.spanBoxes.forEach(spanBox => {
      spanBox.offset.x = currentX;
      currentX += spanBox.size.width;
    });
  }

  replaceSpanBoxes(boxes: SpanBox[]) {
    this.spanBoxes = [];
    this.measuredWidth = 0;
    this.measuredHeight = 0;
    for (const box of boxes) this.addSpanBox(box);
  }

  addSpanBox(spanBox: SpanBox) {
    this.spanBoxes.push(spanBox);
    this.measuredWidth += spanBox.size.width;
    this.measuredHeight = Math.max(
      this.measuredHeight,
      spanBox.size.height * spanBox.height,
    );
  }
}
