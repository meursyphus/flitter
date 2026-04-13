import {
  CanvasPainter,
  type CanvasPaintingContext,
  type SvgPaintContext,
  SvgPainter,
} from "../../../framework";
import { SingleChildRenderObject } from "../../../renderobject";
import { type Offset, Size } from "../../../type";
import { browser, assert } from "../../../utils";
import { SingleChildRenderObjectWidget } from "../../../widget";

import calculatePosition from "./calculatePosition";
import calculateSize from "./calculateSize";

type ObjectPosition =
  | "center"
  | "top"
  | "right"
  | "bottom"
  | "left"
  | "top left"
  | "top right"
  | "bottom left"
  | "bottom right";
type ObjectFit = "fill" | "contain" | "cover" | "none" | "scale-down";

class _Image extends SingleChildRenderObjectWidget {
  private _src: string;
  private _fit?: ObjectFit;
  private _width?: number;
  private _height?: number;
  private _position?: ObjectPosition;

  constructor({
    key,
    src,
    objectFit: fit,
    width,
    height,
    objectPosition: position,
  }: {
    key?: any;
    src: string;
    width?: number;
    height?: number;
    objectFit?: ObjectFit;
    objectPosition?: ObjectPosition;
  }) {
    super(key);
    this._src = src;
    this._fit = fit;
    this._width = width;
    this._height = height;
    this._position = position;
  }

  override createRenderObject() {
    return new RenderImage({
      src: this._src,
      objectFit: this._fit,
      width: this._width,
      height: this._height,
      objectPosition: this._position,
    });
  }

  override updateRenderObject(renderObject: RenderImage) {
    renderObject.src = this._src;
    renderObject.fit = this._fit;
    renderObject.width = this._width;
    renderObject.height = this._height;
    renderObject.position = this._position;
  }
}

class RenderImage extends SingleChildRenderObject {
  #src: string;

  get src() {
    return this.#src;
  }
  set src(value: string) {
    if (this.#src === value) return;
    this.#src = value;
    if (this.image != null) {
      this.image.src = value;
    }
    this.markNeedsLayout();
  }
  #fit?: ObjectFit;
  get fit(): ObjectFit | undefined {
    return this.#fit;
  }
  set fit(value: ObjectFit | undefined) {
    if (this.#fit === value) return;
    this.#fit = value;
    this.markNeedsLayout();
  }
  #width?: number;
  get width(): number | undefined {
    return this.#width;
  }
  set width(value: number | undefined) {
    if (this.#width === value) return;
    this.#width = value;
    this.markNeedsLayout();
  }
  #height?: number;
  get height(): number | undefined {
    return this.#height;
  }
  set height(value: number | undefined) {
    if (this.#height === value) return;
    this.#height = value;
    this.markNeedsLayout();
  }
  #position?: ObjectPosition;
  get position(): ObjectPosition | undefined {
    return this.#position;
  }
  set position(value: ObjectPosition | undefined) {
    if (this.#position === value) return;
    this.#position = value;
    this.markNeedsLayout();
  }
  image?: HTMLImageElement;
  imageLoaded = false;
  constructor({
    src,
    objectFit,
    width,
    height,
    objectPosition,
  }: {
    src: string;
    width?: number;
    height?: number;
    objectFit?: ObjectFit;
    objectPosition?: ObjectPosition;
  }) {
    super({ isPainter: true });
    this.#src = src;
    this.#fit = objectFit;
    this.#width = width;
    this.#height = height;
    this.#position = objectPosition;

    if (browser) {
      this.image = new Image();
      this.image.onload = () => {
        this.imageLoaded = true;
        if (!this.#mounted) return;

        this.markNeedsLayout();
      };
      this.image.src = src;
    }
  }

  override getIntrinsicWidth(): number {
    if (this.width != null) return this.width;
    return 0;
  }

  override getIntrinsicHeight(): number {
    if (this.height != null) return this.height;
    return 0;
  }

  calculatedImageSize?: {
    width: number;
    height: number;
  };

  #mounted = false;
  override preformLayout(): void {
    this.#mounted = true;

    if (!this.imageLoaded) {
      this.size = this.constraints.constrain(
        new Size({
          width: this.width ?? 0,
          height: this.height ?? 0,
        }),
      );

      return;
    }

    assert(this.image != null);
    const sourceSize = { width: this.image.width, height: this.image.height };

    const { width, height } = calculateSize(
      sourceSize,
      {
        width: this.width && this.constraints.constrainWidth(this.width),
        height: this.height && this.constraints.constrainHeight(this.height),
      },
      this.fit,
    );
    const size = new Size({ width, height });
    this.size = this.constraints.constrain(size);

    this.calculatedImageSize = calculateSize(
      sourceSize,
      {
        width: this.size.width,
        height: this.size.height,
      },
      this.fit,
    ).image;
  }

  override createCanvasPainter(): CanvasPainter {
    return new ImageCanvasPatiner(this);
  }

  protected override createSvgPainter(): SvgPainter {
    return new ImageSvgPainter(this);
  }
}

class ImageCanvasPatiner extends CanvasPainter {
  override performPaint(context: CanvasPaintingContext, offset: Offset) {
    const {
      size,
      image,
      imageLoaded,
      calculatedImageSize: imageSize,
      position = "center",
    } = this.renderObject as RenderImage;
    if (!image) return;
    if (!imageLoaded) return;
    assert(imageSize != null);

    const { sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight } =
      calculatePosition(
        { width: image.width, height: image.height },
        {
          container: size,
          image: { width: imageSize.width, height: imageSize.height },
        },
        position,
      );

    context.canvas.drawImage(
      image,
      sx,
      sy,
      sWidth,
      sHeight,
      offset.x + dx,
      offset.y + dy,
      dWidth,
      dHeight,
    );
  }
}

class ImageSvgPainter extends SvgPainter {
  override createDefaultSvgEl(context: SvgPaintContext) {
    return {
      img: context.createSvgEl("image"),
    };
  }
  protected override performPaint({ img }: { img: SVGImageElement }): void {
    const { src } = this.renderObject as RenderImage;
    img.setAttribute("href", src);
    // @todo
    console.warn("not implemented svg painter on image widget");
  }
}

export default _Image;
