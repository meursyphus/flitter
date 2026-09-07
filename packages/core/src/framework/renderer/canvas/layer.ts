import type { Offset, Matrix4, Rect } from "../../../type";
import type { Path } from "../../../type/_types/_path";
import type { CanvasRenderPipeline } from "./canvas-renderer";
export abstract class Layer {
  parent: ContainerLayer | null = null;
  attached: boolean = false;
  owner!: CanvasRenderPipeline;

  attach(owner: CanvasRenderPipeline) {
    this.attached = true;
    this.owner = owner;
  }

  detach() {
    this.attached = false;
  }

  remove() {
    this.parent?.removeChild(this);
  }

  abstract addToScene(builder: SceneBuilder): void;
}

export class PictureLayer extends Layer {
  #paintBounds: Rect;
  picture!: Picture;
  constructor(paintBounds: Rect) {
    super();
    this.#paintBounds = paintBounds;
  }
  override addToScene(builder: SceneBuilder) {
    builder.addPicture({
      x: this.#paintBounds.left,
      y: this.#paintBounds.top,
      picture: this.picture,
    });
  }

  /**
   * Hands this layer's backing canvas to the caller so a new recording can
   * reuse the buffer. Only valid once the layer has been removed from the
   * layer tree: the picture must never be drawn again afterwards.
   */
  recycleSource(): HTMLCanvasElement | null {
    const picture = this.picture as Picture | undefined;
    return picture == null ? null : picture.source;
  }
}

export class ContainerLayer extends Layer {
  children: Layer[] = [];

  override attach(owner: CanvasRenderPipeline) {
    super.attach(owner);
    this.visitChildren(child => {
      child.attach(owner);
    });
  }

  override detach() {
    this.visitChildren(child => {
      child.detach();
    });
    super.detach();
  }

  override addToScene(builder: SceneBuilder) {
    this.visitChildren(layer => {
      layer.addToScene(builder);
    });
  }

  visitChildren(visitor: (layer: Layer) => void) {
    for (const child of this.children) {
      visitor(child);
    }
  }
  removeAllChildren() {
    this.children.forEach(child => {
      child.parent = null;
      child.detach();
    });
    this.children = [];
  }

  buildScene(builder: SceneBuilder) {
    this.addToScene(builder);
  }

  append(child: Layer) {
    child.remove();
    this.children.push(child);
    child.parent = this;
    if (this.attached) {
      child.attach(this.owner);
    }
  }

  removeChild(child: Layer) {
    const index = this.children.indexOf(child);
    if (index === -1) return;
    this.children.splice(index, 1);
    child.parent = null;
    child.detach();
  }
}

export class OffsetLayer extends ContainerLayer {
  offset: Offset;

  constructor(offset: Offset) {
    super();
    this.offset = offset;
  }

  override addToScene(builder: SceneBuilder) {
    builder.pushOffset(this.offset);
    super.addToScene(builder);
    builder.pop();
  }
}
export class TransformLayer extends OffsetLayer {
  transform: Matrix4;

  constructor({ offset, transform }: { offset: Offset; transform: Matrix4 }) {
    super(offset);
    this.transform = transform;
  }

  override addToScene(builder: SceneBuilder) {
    builder.pushTransform(this.transform, this.offset);
    this.visitChildren(layer => {
      layer.addToScene(builder);
    });
    builder.pop();
  }
}

export class OpacityLayer extends OffsetLayer {
  opacity: number;

  constructor({ offset, opacity }: { offset: Offset; opacity: number }) {
    super(offset);
    this.opacity = opacity;
  }

  override addToScene(builder: SceneBuilder) {
    builder.pushOpacity(this.opacity, this.offset);
    this.visitChildren(layer => {
      layer.addToScene(builder);
    });
    builder.pop();
  }
}

export class ClipPathLayer extends OffsetLayer {
  clipPath: Path;
  translateContents: boolean;

  constructor({
    offset,
    clipPath,
    translateContents = true,
  }: {
    offset: Offset;
    clipPath: Path;
    translateContents?: boolean;
  }) {
    super(offset);
    this.clipPath = clipPath;
    this.translateContents = translateContents;
  }

  override addToScene(builder: SceneBuilder) {
    builder.pushClipPath(this.clipPath, this.offset, this.translateContents);
    this.visitChildren(layer => {
      layer.addToScene(builder);
    });
    builder.pop();
  }
}

export class ClipRectLayer extends OffsetLayer {
  clipRect: Rect;

  constructor({ offset, clipRect }: { offset: Offset; clipRect: Rect }) {
    super(offset);
    this.clipRect = clipRect;
  }

  override addToScene(builder: SceneBuilder) {
    builder.pushClipRect(this.clipRect, this.offset);
    this.visitChildren(layer => {
      layer.addToScene(builder);
    });
    builder.pop();
  }
}

export class SceneBuilder {
  #commands: (
    | { type: "save" }
    | { type: "restore" }
    | { type: "translate"; offset: Offset }
    | { type: "transform"; offset: Offset; transform: Matrix4 }
    | { type: "opacity"; opacity: number; offset: Offset }
    | {
        type: "clipPath";
        clipPath: Path;
        offset: Offset;
        translateContents: boolean;
      }
    | { type: "clipRect"; clipRect: Rect; offset: Offset }
    | { type: "picture"; x: number; y: number; picture: Picture }
  )[] = [];

  render(ctx: CanvasRenderingContext2D) {
    // The compositor reuses the on-screen context across frames; the replay
    // must therefore stay hermetic. push*/pop pairs are balanced, but this
    // outer save/restore additionally guards any state a command mutates
    // outside its own save window from leaking into the next frame.
    ctx.save();
    for (const command of this.#commands) {
      switch (command.type) {
        case "save":
          ctx.save();
          break;
        case "restore":
          ctx.restore();
          break;
        case "translate":
          ctx.translate(command.offset.x, command.offset.y);
          break;
        case "transform": {
          ctx.translate(command.offset.x, command.offset.y);
          const arr = command.transform._m4storage;
          ctx.transform(arr[0], arr[1], arr[4], arr[5], arr[12], arr[13]);
          break;
        }
        case "opacity":
          ctx.translate(command.offset.x, command.offset.y);
          ctx.globalAlpha *= command.opacity;
          break;
        case "clipPath":
          ctx.translate(command.offset.x, command.offset.y);
          ctx.clip(command.clipPath.toCanvasPath());
          if (!command.translateContents)
            ctx.translate(-command.offset.x, -command.offset.y);
          break;
        case "clipRect":
          ctx.translate(command.offset.x, command.offset.y);
          ctx.beginPath();
          ctx.rect(
            command.clipRect.left,
            command.clipRect.top,
            command.clipRect.width,
            command.clipRect.height,
          );
          ctx.clip();
          break;
        case "picture":
          ctx.drawImage(
            command.picture.toImage(),
            command.x,
            command.y,
            command.picture.size.width,
            command.picture.size.height,
          );
          break;
      }
    }
    ctx.restore();
  }

  addPicture(props: { x: number; y: number; picture: Picture }) {
    this.#commands.push({
      type: "picture",
      ...props,
    });
  }

  pushOffset(offset: Offset) {
    this.#commands.push({ type: "save" });
    this.#commands.push({
      type: "translate",
      offset,
    });
  }

  pushTransform(transform: Matrix4, offset: Offset) {
    this.#commands.push({ type: "save" });
    this.#commands.push({
      type: "transform",
      offset,
      transform,
    });
  }

  pushOpacity(opacity: number, offset: Offset) {
    this.#commands.push({ type: "save" });
    this.#commands.push({
      type: "opacity",
      opacity,
      offset,
    });
  }

  pushClipPath(clipPath: Path, offset: Offset, translateContents = true) {
    this.#commands.push({ type: "save" });
    this.#commands.push({
      type: "clipPath",
      clipPath,
      offset,
      translateContents,
    });
  }

  pushClipRect(clipRect: Rect, offset: Offset) {
    this.#commands.push({ type: "save" });
    this.#commands.push({
      type: "clipRect",
      clipRect,
      offset,
    });
  }

  pop() {
    this.#commands.push({ type: "restore" });
  }
}

class Picture {
  #source: HTMLCanvasElement;
  constructor(source: HTMLCanvasElement) {
    this.#source = source;
  }

  toImage(): CanvasImageSource {
    return this.#source;
  }
  get size() {
    return {
      width: this.#source.width / window.devicePixelRatio,
      height: this.#source.height / window.devicePixelRatio,
    };
  }
  /**
   * Internal: the backing canvas, exposed only so a discarded picture's
   * buffer can be recycled into a new recording (PictureLayer.recycleSource).
   */
  get source(): HTMLCanvasElement {
    return this.#source;
  }
}

export class PictureRecorder {
  #source: HTMLCanvasElement | null;

  /**
   *
   * @implements: This recorder is currently under implementation and does not actually record but directly reflects on the canvas context. Temporarily, it requires the paintSize immediately. The recorder is intended to manage the drawing order for implementing z-index. Once implemented, it will function as a recorder by not directly drawing on the canvas context but recording the operations.
   */
  constructor(
    paintBounds: Rect,
    recycledCanvas: HTMLCanvasElement | null = null,
  ) {
    const dpr = window.devicePixelRatio;
    const width = paintBounds.width * dpr;
    const height = paintBounds.height * dpr;
    this.#source =
      (recycledCanvas != null
        ? PictureRecorder.#resetForReuse(recycledCanvas, width, height)
        : null) ?? PictureRecorder.#createSource(width, height);
  }

  static #createSource(width: number, height: number): HTMLCanvasElement {
    const source = document.createElement("canvas");
    source.width = width;
    source.height = height;
    return source;
  }

  /**
   * A canvas may only be reused when its backing store already has the target
   * size and the context can be returned to the pristine state of a freshly
   * created canvas. ctx.reset() guarantees exactly that (clears the bitmap and
   * resets the transform, clip, styles and the state stack); without it the
   * context could leak paint state from the canvas's previous recording, so
   * fall back to a fresh allocation instead.
   */
  static #resetForReuse(
    canvas: HTMLCanvasElement,
    width: number,
    height: number,
  ): HTMLCanvasElement | null {
    // The width/height IDL setters truncate, so compare against the truncated
    // target to recognize a same-size backing store.
    if (
      canvas.width !== Math.trunc(width) ||
      canvas.height !== Math.trunc(height)
    ) {
      return null;
    }
    const ctx = canvas.getContext("2d") as
      | (CanvasRenderingContext2D & { reset?: () => void })
      | null;
    if (ctx == null || typeof ctx.reset !== "function") return null;
    ctx.reset();
    return canvas;
  }

  /**
   * @implements: This function is still incomplete. So It needs paintSize temporarily. Once completed, it will intercept the CanvasRenderingContext2D API
   * to record in the recorder. The recorder will log according to the vertical layering order.
   * When endRecording is called, the recorded content will be returned as a Picture.
   */
  createCanvasContext(): CanvasRenderingContext2D {
    const ctx = this.#source!.getContext("2d")!;
    const dpr = window.devicePixelRatio;
    // setTransform rather than scale: both a fresh canvas and a reset() one
    // start at identity, and setTransform cannot accumulate across reuses.
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return ctx;
  }

  endRecording() {
    const picture = new Picture(this.#source!);
    this.#source = null;
    return picture;
  }
}
