import RenderObject from "../../renderobject/RenderObject";
import {
  TextDirection,
  TextAlign,
  TextWidthBasis,
  TextOverflow,
  Size,
} from "../../type";
import type { PaintContext } from "../../utils/type";
import RenderObjectWidget from "../../widget/RenderObjectWidget";
import type InlineSpan from "../../type/_types/Inline-span";
import TextPainter from "../../type/_types/text-painter";

export type RichTextProps = {
  text: InlineSpan;
  textAlign?: TextAlign;
  textDirection?: TextDirection;
  softWrap?: boolean;
  overflow?: TextOverflow;
  textScaleFactor?: number;
  maxLines?: number;
  textWidthBasis?: TextWidthBasis;
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

  constructor({
    text,
    textAlign = TextAlign.start,
    textDirection,
    softWrap = true,
    overflow = TextOverflow.clip,
    textScaleFactor = 1,
    maxLines,
    textWidthBasis = TextWidthBasis.parent,
    key,
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
  }

  createRenderObject(): RenderObject {
    return new RenderParagraph({
      text: this.text,
      textAlign: this.textAlign,
      textDirection: this.textDirection || TextDirection.ltr,
      softWrap: this.softWrap,
      overflow: this.overflow,
      textScaleFactor: this.textScaleFactor,
      maxLines: this.maxLines,
      textWidthBasis: this.textWidthBasis,
    });
  }

  updateRenderObject(renderObject: RenderParagraph): void {
    renderObject.softWrap = this.softWrap;
    renderObject.overflow = this.overflow;
    renderObject.textScaleFactor = this.textScaleFactor;
    renderObject.maxLines = this.maxLines;
    renderObject.textWidthBasis = this.textWidthBasis;
    renderObject.text = this.text;
    renderObject.textAlign = this.textAlign;
    renderObject.textDirection = this.textDirection || TextDirection.ltr;
  }
}

class RenderParagraph extends RenderObject {
  _softWrap: boolean;
  _overflow: TextOverflow;
  get softWrap(): boolean {
    return this._softWrap;
  }
  set softWrap(newSoftWrap: boolean) {
    if (this._softWrap === newSoftWrap) return; // early return
    this._softWrap = newSoftWrap;
    this.markNeedsLayout();
  }

  get overflow(): TextOverflow {
    return this._overflow;
  }

  set overflow(newOverflow: TextOverflow) {
    if (this._overflow === newOverflow) return; // early return
    this._overflow = newOverflow;
    this.markNeedsLayout();
  }
  textPainter: TextPainter;
  constructor({
    text,
    textAlign = TextAlign.start,
    textDirection,
    softWrap = true,
    overflow = TextOverflow.clip,
    textScaleFactor = 1,
    maxLines,
    textWidthBasis = TextWidthBasis.parent,
  }: RichTextProps) {
    super({ isPainter: true });
    this._softWrap = softWrap;
    this._overflow = overflow;
    this.textPainter = new TextPainter({
      text,
      textAlign,
      textDirection,
      textScaleFactor,
      maxLines,
      ellipsis: overflow == TextOverflow.ellipsis ? "\u2026" : undefined,
      textWidthBasis,
    });
  }

  get text() {
    return this.textPainter.text!;
  }

  set text(value: InlineSpan) {
    if (this.textPainter.text.eqauls(value)) return;
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

  protected performPaint(
    {
      text: textEl,
    }: {
      text: SVGTextElement;
    },
    context: PaintContext
  ): void {
    /**
     * Safari has issue that tspan inherit text's transform only when mounted.
     * even if existing text's transform style is changed, tspan still inherit previous position.
     * so we need to remove text and create whenever paint is called.
     */
    if (
      context.isOnBrowser &&
      typeof navigator !== "undefined" &&
      /^(?!.*Chrome).*Safari.*/i.test(navigator.userAgent)
    ) {
      const newTextEl = context.createSvgEl("text") as SVGTextElement;
      newTextEl.setAttribute("style", textEl.getAttribute("style"));
      newTextEl.setAttribute("data-render-name", "text");
      textEl.parentNode.appendChild(newTextEl);
      textEl.remove();
      this.textPainter.paint(newTextEl, context);
      return;
    }

    if (!this.needsPaint && !this.changedLayout) return;
    this.textPainter.paint(textEl, context);
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
      })
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

  createDefaultSvgEl({ createSvgEl }: PaintContext): {
    [key: string]: SVGElement;
  } {
    return {
      text: createSvgEl("text"),
    };
  }
}

export default RichText;
