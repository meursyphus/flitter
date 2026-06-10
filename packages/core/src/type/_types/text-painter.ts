import type InlineSpan from "./Inline-span";
import { RenderComparison } from "./Inline-span";
import Utils, { assert, getTextWidth } from "../../utils";
import type { SvgPaintContext } from "../../framework";
import type Offset from "./_offset";

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

  // Whether the cached paragraph holds outdated paint information (set by a
  // paint-tier text change) and must be rebuilt before the next paint.
  #rebuildParagraphForPaint = false;

  /** Invalidate the cached paragraph, forcing the next layout to rebuild. */
  markNeedsLayout(): void {
    this.#cachedText = undefined;
    this.#cachedMinWidth = NaN;
    this.#cachedMaxWidth = NaN;
  }

  // Rebuilding at the exact width the cached paragraph was last laid out at
  // reproduces identical line breaks and offsets (layout is deterministic in
  // its geometry inputs, and a paint-tier text change cannot alter them),
  // while the rebuilt span boxes pick up the new paint properties.
  #ensureParagraphForPaint(): void {
    if (!this.#rebuildParagraphForPaint) return;
    this.#rebuildParagraphForPaint = false;
    if (this.paragraph == null) return;
    const paragraph = this.createParagraph(this.text);
    paragraph.layout(this.paragraph.width);
    this.paragraph = paragraph;
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
    this.paragraph.lines.forEach(line => {
      line.spanBoxes.forEach(
        ({
          offset: { x, y },
          fontFamily,
          content,
          fontSize,
          fontWeight,
          color,
        }) => {
          ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
          ctx.textAlign = "start";
          ctx.textBaseline = "hanging";
          ctx.fillStyle = color;
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
        ({ offset, fontFamily, content, fontSize, fontWeight, color }) => {
          const tspanEl = createSvgEl("tspan");
          tspanEl.setAttribute("x", `${offset.x}`);
          tspanEl.setAttribute("y", `${offset.y}`);
          tspanEl.setAttribute("text-anchor", "start");
          tspanEl.setAttribute("dominant-baseline", "hanging");
          tspanEl.setAttribute("fill", color);
          tspanEl.setAttribute("font-size", `${fontSize}`);
          tspanEl.setAttribute("font-family", `${fontFamily}`);
          tspanEl.setAttribute("font-weight", fontWeight);
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

    this.paragraph = this.createParagraph(this.text);
    this.#rebuildParagraphForPaint = false;
    this.layoutParagraph({ minWidth, maxWidth });

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
    return this.#cachedMaxWidth >= contentWidth && maxWidth >= contentWidth;
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
  source: Span[] = [];
  lines: ParagraphLine[] = [];
  textDirection: TextDirection;
  textAlign: TextAlign;

  constructor(
    text: InlineSpan | null,
    {
      textAlign,
      ellipsis,
      textDirection,
    }: {
      textAlign: TextAlign;
      ellipsis?: string;
      textDirection: TextDirection;
    },
  ) {
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

  layout(width: number = Infinity) {
    this.width = width;
    this.lines = [];
    let currentLine = new ParagraphLine();
    let currentStyle: {
      fontSize: number;
      fontFamily: string;
      fontWeight: string;
      fontStyle: FontStyle;
      color: string;
      height: number;
    };

    const addNewLine = () => {
      if (currentLine.spanBoxes.length > 0) {
        this.lines.push(currentLine);
      }
      currentLine = new ParagraphLine();
    };

    const addWordToLine = (word: string, font: string) => {
      const wordWidth = getTextWidth({ text: word, font });
      if (currentLine.width + wordWidth > width) {
        addNewLine();
      }
      currentLine.addSpanBox(
        new SpanBox({
          content: word,
          ...currentStyle,
          size: {
            height: getTextHeight({ fontSize: currentStyle.fontSize }),
            width: wordWidth,
          },
        }),
      );
    };

    const processWord = (font: string) => (word: string) => {
      const containsNewline = word.includes("\n");

      if (containsNewline) {
        word.split(/(\n)/).forEach(part => {
          if (part === "\n") {
            addNewLine();
            currentLine.addSpanBox(
              new SpanBox({
                content: "\n",
                ...currentStyle,
                size: {
                  height: getTextHeight({ fontSize: currentStyle.fontSize }),
                  width: 0,
                },
              }),
            );
          } else if (part.length > 0) {
            addWordToLine(part, font);
          }
        });
      } else {
        addWordToLine(word, font);
      }
    };

    this.source.forEach(({ content, ...style }) => {
      currentStyle = style;
      const font = `${currentStyle.fontWeight} ${currentStyle.fontSize}px ${currentStyle.fontFamily}`;
      const words = content.match(/\S+|\s+/g) || [];
      words.forEach(processWord(font));
    });

    if (currentLine.spanBoxes.length > 0) {
      this.lines.push(currentLine);
    }

    this.align();
  }

  /**
   * Repositions the existing lines for a new paragraph width without
   * re-measuring or re-breaking. Only valid when the caller has proven that
   * no soft line break can change at either the old or the new width: the
   * alignment pass is the same one a full layout ends with, so the resulting
   * offsets are bit-identical to a full relayout.
   */
  resize(width: number): void {
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

class SpanBox {
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
    fontFamily,
    fontSize,
    fontStyle,
    fontWeight,
    color,
    content,
    height,
    size,
  }: Span & { size: { width: number; height: number } }) {
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

  get height() {
    return this.spanBoxes.reduce(
      (acc, { size, height }) => Math.max(acc, size.height * height),
      0,
    );
  }

  get width() {
    return this.spanBoxes.reduce((acc, { size }) => acc + size.width, 0);
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

  addSpanBox(spanBox: SpanBox) {
    this.spanBoxes.push(spanBox);
  }
}
