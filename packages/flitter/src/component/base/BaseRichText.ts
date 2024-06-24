import {
  SvgPainter,
  CanvasPainter,
  type CanvasPaintingContext,
  type SvgPaintContext,
} from "../../framework";
import RenderObject from "../../renderobject/RenderObject";
import {
  TextDirection,
  TextAlign,
  TextWidthBasis,
  TextOverflow,
  Size,
  type Offset,
} from "../../type";
import RenderObjectWidget from "../../widget/RenderObjectWidget";
import type InlineSpan from "../../type/_types/Inline-span";
import TextPainter from "../../type/_types/text-painter";
import { assert } from "../../utils";

export type RichTextProps = {
  text: InlineSpan;
  textAlign?: TextAlign;
  textDirection?: TextDirection;
  softWrap?: boolean;
  overflow?: TextOverflow;
  textScaleFactor?: number;
  maxLines?: number;
  textWidthBasis?: TextWidthBasis;
  textPainter?: TextPainter;
};

class RichText extends RenderObjectWidget {
  text: InlineSpan;
  textAlign: TextAlign;
  textDirection?: TextDirection;
  softWrap: boolean;
  overflow: TextOverflow;
  textScaleFactor: number;
  maxLines?: number;
  textWidthBasis: TextWidthBasis;
  textPainter?: TextPainter;

  constructor({
    text,
    textAlign,
    textDirection,
    softWrap = true,
    overflow = TextOverflow.clip,
    textScaleFactor,
    maxLines,
    textWidthBasis,
    key,
    textPainter,
  }: RichTextProps & { key?: any }) {
    super({ children: [], key });
    this.text = text;
    this.textAlign = textAlign;
    this.textDirection = textDirection;
    this.softWrap = softWrap;
    this.overflow = overflow;
    this.textScaleFactor = textScaleFactor;
    this.maxLines = maxLines;
    this.textWidthBasis = textWidthBasis;
    this.textPainter = textPainter;
  }

  createRenderObject(): RenderObject {
    return new RenderParagraph({
      text: this.text,
      textAlign: this.textAlign,
      textDirection: this.textDirection,
      softWrap: this.softWrap,
      overflow: this.overflow,
      textScaleFactor: this.textScaleFactor,
      maxLines: this.maxLines,
      textWidthBasis: this.textWidthBasis,
      textPainter: this.textPainter,
    });
  }

  updateRenderObject(renderObject: RenderParagraph): void {
    if (this.softWrap != null) renderObject.softWrap = this.softWrap;
    if (this.overflow != null) renderObject.overflow = this.overflow;
    if (this.textScaleFactor != null) renderObject.textScaleFactor = this.textScaleFactor;
    if (this.maxLines != null) renderObject.maxLines = this.maxLines;
    if (this.textWidthBasis != null) renderObject.textWidthBasis = this.textWidthBasis;
    if (this.text != null) renderObject.text = this.text;
    if (this.textAlign != null) renderObject.textAlign = this.textAlign;
    if (this.textDirection != null) renderObject.textDirection = this.textDirection;
    if (this.textPainter != null) renderObject.textPainter = this.textPainter;
  }
}

export class RenderParagraph extends RenderObject {
  #softWrap: boolean;
  #overflow: TextOverflow;
  get softWrap(): boolean {
    return this.#softWrap;
  }
  set softWrap(newSoftWrap: boolean) {
    if (this.#softWrap === newSoftWrap) return; // early return
    this.#softWrap = newSoftWrap;
    this.markNeedsLayout();
  }

  get overflow(): TextOverflow {
    return this.#overflow;
  }

  set overflow(newOverflow: TextOverflow) {
    if (this.#overflow === newOverflow) return; // early return
    this.#overflow = newOverflow;
    this.markNeedsLayout();
  }
  #textPainter: TextPainter;
  get textPainter() {
    return this.#textPainter;
  }
  set textPainter(value: TextPainter) {
    if (this.#textPainter === value) return;
    this.#textPainter = value;
    this.markNeedsLayout();
  }
  constructor({
    text,
    textAlign,
    textDirection,
    softWrap = true,
    overflow = TextOverflow.clip,
    textScaleFactor,
    maxLines,
    textWidthBasis,
    textPainter,
  }: RichTextProps) {
    super({ isPainter: true });
    this.#softWrap = softWrap;
    this.#overflow = overflow;

    if (textPainter) {
      assert(
        textAlign == null &&
          textDirection == null &&
          textScaleFactor == null &&
          textWidthBasis == null &&
          maxLines == null,
        "textAlign, textDirection, textScaleFactor, textWidthBasis, maxLines cannot be set when textPainter is provided.",
      );
      this.#textPainter = textPainter;
    } else {
      this.#textPainter = new TextPainter({
        text,
        textAlign: textAlign ?? TextAlign.start,
        textDirection: textDirection ?? TextDirection.ltr,
        textScaleFactor: textScaleFactor ?? 1,
        ellipsis: overflow == TextOverflow.ellipsis ? "\u2026" : undefined,
        textWidthBasis: textWidthBasis ?? TextWidthBasis.parent,
        maxLines,
      });
    }
  }

  get text() {
    return this.textPainter.text!;
  }

  set text(value: InlineSpan) {
    if (this.textPainter.text.equals(value)) return;
    this.textPainter.text = value;
    this.markNeedsLayout();
  }

  get textWidthBasis(): TextWidthBasis {
    return this.textPainter.textWidthBasis;
  }

  set textWidthBasis(value: TextWidthBasis) {
    if (this.textPainter.textWidthBasis === value) return;
    this.textPainter.textWidthBasis = value;
    this.markNeedsLayout();
  }

  get textAlign(): TextAlign {
    return this.textPainter.textAlign;
  }

  set textAlign(textAlign: TextAlign) {
    if (this.textPainter.textAlign === textAlign) return;
    this.textPainter.textAlign = textAlign;
    this.markNeedsLayout();
  }

  get textDirection(): TextDirection {
    return this.textPainter.textDirection!;
  }

  set textDirection(direction: TextDirection) {
    if (this.textPainter.textDirection === direction) return;
    this.textPainter.textDirection = direction;
    this.markNeedsLayout();
  }

  get textScaleFactor(): number {
    return this.textPainter.textScaleFactor;
  }

  set textScaleFactor(scaleFactor: number) {
    if (this.textPainter.textScaleFactor === scaleFactor) return;
    this.textPainter.textScaleFactor = scaleFactor;
    this.markNeedsLayout();
  }

  get maxLines(): number | undefined {
    return this.textPainter.maxLines;
  }

  set maxLines(value: number | undefined) {
    if (this.textPainter.maxLines === value) return;
    this.textPainter.maxLines = value;
    this.markNeedsLayout();
  }

  protected preformLayout(): void {
    this.layoutText({
      maxWidth: this.constraints.maxWidth,
      minWidth: this.constraints.minWidth,
    });

    this.size = this.constraints.constrain(
      new Size({
        width: this.textPainter.width,
        height: this.textPainter.height,
      }),
    );
  }

  previousWidth: number;
  previousHeight: number;
  changedLayout: boolean;

  private layoutText({
    maxWidth = Infinity,
    minWidth = 0,
  }: {
    minWidth?: number;
    maxWidth?: number;
  }) {
    const widthMatters =
      this.softWrap || this.overflow === TextOverflow.ellipsis;

    this.previousWidth = this.textPainter.width;
    this.previousHeight = this.textPainter.height;

    this.textPainter.layout({
      minWidth: minWidth,
      maxWidth: widthMatters ? maxWidth : Infinity,
    });

    this.changedLayout =
      this.textPainter.width !== this.previousWidth ||
      this.textPainter.height !== this.previousHeight;
  }

  override getIntrinsicHeight(): number {
    this.textPainter.layout();
    return this.textPainter.height;
  }

  override getIntrinsicWidth(): number {
    this.textPainter.layout();
    return this.textPainter.width;
  }

  protected override createSvgPainter(): SvgPainter {
    return new ParagraphSvgPainter(this);
  }

  protected override createCanvasPainter(): CanvasPainter {
    return new ParagraphCanvasPainter(this);
  }
}

class ParagraphSvgPainter extends SvgPainter {
  get textPainter() {
    return (this.renderObject as RenderParagraph).textPainter;
  }
  get changedLayout() {
    return (this.renderObject as RenderParagraph).changedLayout;
  }
  protected override createDefaultSvgEl({ createSvgEl }: SvgPaintContext): {
    [key: string]: SVGElement;
  } {
    return {
      text: createSvgEl("text"),
    };
  }

  protected override performPaint(
    {
      text: textEl,
    }: {
      text: SVGTextElement;
    },
    context: SvgPaintContext,
  ): void {
    /**
     * Safari has issue that tspan inherit text's transform only when mounted.
     * even if existing text's transform style is changed, tspan still inherit previous position.
     * so we need to remove text and create whenever paint is called.
     */
    if (
      context.isOnBrowser() &&
      typeof navigator !== "undefined" &&
      /^(?!.*Chrome).*Safari.*/i.test(navigator.userAgent)
    ) {
      const newTextEl = context.createSvgEl("text") as SVGTextElement;
      newTextEl.setAttribute("style", textEl.getAttribute("style"));
      newTextEl.setAttribute("data-render-name", "text");
      textEl.parentNode.appendChild(newTextEl);
      textEl.remove();
      this.textPainter.paintOnSvg(newTextEl, context);
      return;
    }

    if (!this.needsPaint && !this.changedLayout) return;
    this.textPainter.paintOnSvg(textEl, context);
  }
}

class ParagraphCanvasPainter extends CanvasPainter {
  get textPainter() {
    return (this.renderObject as RenderParagraph).textPainter;
  }

  protected override performPaint(
    context: CanvasPaintingContext,
    offset: Offset,
  ): void {
    this.textPainter.paintOnCanvas(context.canvas, offset);
  }
}

export default RichText;
