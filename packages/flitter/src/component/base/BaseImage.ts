import {
  CanvasPainter,
  type CanvasPaintingContext,
  type SvgPaintContext,
  SvgPainter,
} from "../../framework";
import { SingleChildRenderObject } from "../../renderobject";
import { type Offset, Size } from "../../type";
import { browser, assert, never } from "../../utils";
import { SingleChildRenderObjectWidget } from "../../widget";

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

class BaseImage extends SingleChildRenderObjectWidget {
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

    const { width, height } = calcImageSize(
      sourceSize,
      this.width && this.constraints.constrainWidth(this.width),
      this.height && this.constraints.constrainHeight(this.height),
      this.fit,
    );
    const size = new Size({ width, height });
    this.size = this.constraints.constrain(size);

    this.calculatedImageSize = calcImageSize(
      sourceSize,
      this.size.width,
      this.size.height,
      this.fit,
    ).image;
  }

  override createCanvasPainter(): CanvasPainter {
    return new ImageCanvasPainter(this);
  }

  protected override createSvgPainter(): SvgPainter {
    return new ImageSvgPainter(this);
  }
}

class ImageCanvasPainter extends CanvasPainter {
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
      calculateImageRendering(
        { width: image.width, height: image.height },
        {
          containerWidth: size.width,
          containerHeight: size.height,
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
function calculateImageRendering(
  sourceImageSize: { width: number; height: number },
  calcImageSizeResult: {
    containerWidth: number;
    containerHeight: number;
    image: { width: number; height: number };
  },
  objectPosition: ObjectPosition = "center",
): {
  sx: number;
  sy: number;
  sWidth: number;
  sHeight: number;
  dx: number;
  dy: number;
  dWidth: number;
  dHeight: number;
} {
  const {
    containerWidth,
    containerHeight,
    image: { width: imageWidth, height: imageHeight },
  } = calcImageSizeResult;

  let sx = 0,
    sy = 0,
    sWidth = sourceImageSize.width,
    sHeight = sourceImageSize.height;
  let dx = 0,
    dy = 0;
  const dWidth = containerWidth,
    dHeight = containerHeight;

  // Convert objectPosition to x and y percentages
  let xPercent = 50,
    yPercent = 50;
  if (objectPosition.includes("left")) xPercent = 0;
  if (objectPosition.includes("right")) xPercent = 100;
  if (objectPosition.includes("top")) yPercent = 0;
  if (objectPosition.includes("bottom")) yPercent = 100;

  // Calculate scaling factors
  const scaleX = imageWidth / sourceImageSize.width;
  const scaleY = imageHeight / sourceImageSize.height;
  const scale = Math.max(scaleX, scaleY);

  // Calculate the dimensions of the part of the image that will be displayed
  sWidth = Math.min(sourceImageSize.width, containerWidth / scale);
  sHeight = Math.min(sourceImageSize.height, containerHeight / scale);

  // Calculate sx and sy based on objectPosition
  sx = ((sourceImageSize.width - sWidth) * xPercent) / 100;
  sy = ((sourceImageSize.height - sHeight) * yPercent) / 100;

  // Ensure source rectangle doesn't exceed original image bounds
  sx = Math.max(0, Math.min(sx, sourceImageSize.width - sWidth));
  sy = Math.max(0, Math.min(sy, sourceImageSize.height - sHeight));

  // Calculate dx and dy to center the image in the container
  dx = (containerWidth - dWidth) / 2;
  dy = (containerHeight - dHeight) / 2;

  // Round all values to prevent subpixel rendering issues
  return {
    sx: Math.round(sx),
    sy: Math.round(sy),
    sWidth: Math.round(sWidth),
    sHeight: Math.round(sHeight),
    dx: Math.round(dx),
    dy: Math.round(dy),
    dWidth: Math.round(dWidth),
    dHeight: Math.round(dHeight),
  };
}

function calcImageSize(
  source: { width: number; height: number },
  width?: number,
  height?: number,
  objectFit: ObjectFit = "none",
): {
  width: number;
  height: number;
  image: { width: number; height: number };
} {
  const aspectRatio = source.width / source.height;
  let resultWidth = width || source.width;
  let resultHeight = height || source.height;
  let imageWidth = source.width;
  let imageHeight = source.height;

  // Handle cases where only width or only height is specified
  if (width != null && height == null) {
    if (objectFit === "scale-down" && width > source.width) {
      resultHeight = source.height;
    } else {
      resultHeight = Math.round(width / aspectRatio);
    }
  } else if (width == null && height != null) {
    if (objectFit === "scale-down" && height > source.height) {
      resultWidth = source.width;
    } else {
      resultWidth = Math.round(height * aspectRatio);
    }
  }
  const calculateSize = () => {
    if (resultWidth / resultHeight > aspectRatio) {
      imageHeight = resultHeight;
      imageWidth = Math.round(imageHeight * aspectRatio);
    } else {
      imageWidth = resultWidth;
      imageHeight = Math.round(imageWidth / aspectRatio);
    }
  };

  switch (objectFit) {
    case "fill":
      imageWidth = resultWidth;
      imageHeight = resultHeight;
      break;
    case "contain":
      calculateSize();
      break;
    case "scale-down":
      calculateSize();
      // Ensure it doesn't exceed the original size
      if (imageWidth > source.width || imageHeight > source.height) {
        imageWidth = source.width;
        imageHeight = source.height;
      }
      break;
    case "cover":
      if (resultWidth / resultHeight > aspectRatio) {
        imageWidth = resultWidth;
        imageHeight = Math.round(imageWidth / aspectRatio);
      } else {
        imageHeight = resultHeight;
        imageWidth = Math.round(imageHeight * aspectRatio);
      }
      break;
    // Keep original image size
    case "none":
      break;
    default:
      never(objectFit);
  }

  return {
    width: Math.round(resultWidth),
    height: Math.round(resultHeight),
    image: {
      width: Math.round(imageWidth),
      height: Math.round(imageHeight),
    },
  };
}

export default BaseImage;
