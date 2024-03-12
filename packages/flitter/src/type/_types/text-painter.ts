import type InlineSpan from "./Inline-span";
import Utils, { assert, getTextWidth } from "../../utils";
import type { PaintContext } from "../../utils/type";

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

  paint(textEl: SVGTextElement, { createSvgEl }: PaintContext) {
    this.resetText(textEl);
    assert(this.paragraph != null, "paragraph should not be null");

    this.paragraph!.lines.forEach((line) => {
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
        }
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
    this.paragraph = this.createParagraph(this.text);
    this.layoutParagraph({ minWidth, maxWidth });
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
    }: { textAlign: TextAlign; ellipsis?: string; textDirection: TextDirection }
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
    this.source.forEach(
      ({
        content,
        fontFamily,
        fontSize,
        fontStyle,
        fontWeight,
        color,
        height,
      }) => {
        const words = content.split(/(\s|\n)/);

        let currentText = "";
        let currentWidth = 0;
        const currentHeight = getTextHeight({ fontSize });
        const font = `${fontWeight} ${fontSize}px ${fontFamily}`;
        words.forEach((word) => {
          const wordWidth = getTextWidth({
            text: word,
            font,
          });

          if (
            currentLine.width + currentWidth + wordWidth > this.width ||
            word === "\n"
          ) {
            addSpanBox();
            this.addLine(currentLine);
            currentLine = new ParagraphLine();
            //prevent space on new line
            if ([" ", "\n"].includes(word)) {
              currentWidth = 0;
              currentText = "";
            } else {
              currentWidth = wordWidth;
              currentText = word;
            }
          } else {
            currentText += word;
            currentWidth += wordWidth;
          }
        });

        addSpanBox();

        function addSpanBox() {
          if (!currentText) return;
          currentLine.addSpanBox(
            new SpanBox({
              content: currentText,
              fontFamily,
              fontSize,
              fontStyle,
              fontWeight,
              color,
              height,
              size: {
                height: currentHeight,
                width: currentWidth,
              },
            })
          );
        }
      }
    );

    this.addLine(currentLine);
    this.align();
  }

  private addLine(line: ParagraphLine) {
    if (line.spanBoxes.length === 0) return;
    this.lines.push(line);
  }

  private align() {
    let currentHeight = 0;

    this.lines.forEach((line) => {
      line.layout(this.resolvedTextAlign, {
        paragraphWidth: this.width,
        offsetY: currentHeight,
      });
      currentHeight += line.height;
    });
  }

  get resolvedTextAlign(): "left" | "right" | "center" {
    if (this.textAlign === TextAlign.start) {
      return this.textDirection === TextDirection.ltr ? "left" : "right";
    }

    if (this.textAlign === TextAlign.end) {
      return this.textDirection === TextDirection.ltr ? "right" : "left";
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
      0
    );
  }

  get width() {
    return this.spanBoxes.reduce((acc, { size }) => acc + size.width, 0);
  }

  layout(
    textAlign: "left" | "right" | "center",
    { paragraphWidth, offsetY }: { offsetY: number; paragraphWidth: number }
  ) {
    this.spanBoxes.forEach((spanBox) => {
      spanBox.offset.y = offsetY - spanBox.size.height + this.height;
    });

    switch (textAlign) {
      case "left":
        this.alignHorizontally(0);
        break;
      case "right":
        this.alignHorizontally(paragraphWidth - this.width);
        break;
      case "center":
        this.alignHorizontally((paragraphWidth - this.width) / 2);
        break;
    }
  }

  private alignHorizontally(offsetX: number) {
    let currentX = offsetX;
    this.spanBoxes.forEach((spanBox) => {
      spanBox.offset.x = currentX;
      currentX += spanBox.size.width;
    });
  }

  addSpanBox(spanBox: SpanBox) {
    this.spanBoxes.push(spanBox);
  }
}
