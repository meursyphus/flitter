import { Offset, type Matrix4, type Rect } from "../../../type";
import type Path from "../../../type/_types/_path";
import type { CanvasRenderPipeline } from "./canvas-renderer";
export abstract class Layer {
  attached: boolean = false;
  owner!: CanvasRenderPipeline;

  attach(owner: CanvasRenderPipeline) {
    this.owner = owner;
    this.attached = true;
  }
  detach() {
    this.attached = false;
    this.owner = null as unknown as CanvasRenderPipeline;
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
}

export class ContainerLayer extends Layer {
  children: Layer[] = [];
  override attach(owner: CanvasRenderPipeline) {
    super.attach(owner);
    this.visitChildren(layer => {
      layer.attach(owner);
    });
  }
  override detach() {
    this.visitChildren(layer => {
      layer.detach();
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
    this.visitChildren(layer => {
      layer.detach();
    });
    this.children = [];
  }

  buildScene(builder: SceneBuilder) {
    this.addToScene(builder);
  }

  append(child: Layer) {
    this.children.push(child);
    if (this.attached) {
      child.attach(this.owner);
    }
  }
}

export class OffsetLayer extends ContainerLayer {
  offset: Offset = Offset.Constants.zero;

  override addToScene(builder: SceneBuilder) {
    builder.pushOffset(this.offset);
    super.addToScene(builder);
    builder.pop();
  }
}
export class TransformLayer extends OffsetLayer {
  transform!: Matrix4;

  override addToScene(builder: SceneBuilder) {
    builder.pushTransform({
      offset: this.offset,
      transform: this.transform,
    });
    this.visitChildren(layer => {
      layer.addToScene(builder);
    });
    builder.pop();
  }
}

export class OpacityLayer extends ContainerLayer {
  opacity: number = 1;

  override addToScene(builder: SceneBuilder) {
    builder.pushOpacity(this.opacity);
    super.addToScene(builder);
    builder.pop();
  }
}

export class ClipPathLayer extends ContainerLayer {
  offset: Offset = Offset.Constants.zero;
  path!: Path;

  override addToScene(builder: SceneBuilder) {
    builder.pushClipPath({
      offset: this.offset,
      path: this.path,
    });
    super.addToScene(builder);
    builder.pop();
  }
}

export class SceneBuilder {
  #commands: (
    | { type: "picture"; x: number; y: number; picture: Picture }
    | { type: "pushOffset"; offset: Offset }
    | { type: "pushTransform"; offset: Offset; transform: Matrix4 }
    | { type: "pushOpacity"; opacity: number }
    | { type: "pushClipPath"; offset: Offset; path: Path }
    | { type: "pop" }
  )[] = [];

  render(ctx: CanvasRenderingContext2D) {
    for (const command of this.#commands) {
      switch (command.type) {
        case "picture":
          ctx.drawImage(
            command.picture.toImage(),
            command.x,
            command.y,
            command.picture.size.width,
            command.picture.size.height,
          );
          break;
        case "pushOffset":
          ctx.save();
          ctx.translate(command.offset.x, command.offset.y);
          break;
        case "pushTransform": {
          const arr = command.transform._m4storage;
          ctx.save();
          ctx.translate(command.offset.x, command.offset.y);
          ctx.transform(
            arr[0],
            arr[1],
            arr[4],
            arr[5],
            arr[12],
            arr[13],
          );
          ctx.translate(-command.offset.x, -command.offset.y);
          break;
        }
        case "pushOpacity":
          ctx.save();
          ctx.globalAlpha *= command.opacity;
          break;
        case "pushClipPath":
          ctx.save();
          ctx.translate(command.offset.x, command.offset.y);
          ctx.clip(command.path.toCanvasPath());
          ctx.translate(-command.offset.x, -command.offset.y);
          break;
        case "pop":
          ctx.restore();
          break;
      }
    }
  }

  addPicture(props: { x: number; y: number; picture: Picture }) {
    this.#commands.push({
      type: "picture",
      ...props,
    });
  }

  pushOffset(offset: Offset) {
    this.#commands.push({
      type: "pushOffset",
      offset,
    });
  }

  pushTransform(props: { offset: Offset; transform: Matrix4 }) {
    this.#commands.push({
      type: "pushTransform",
      ...props,
    });
  }

  pushOpacity(opacity: number) {
    this.#commands.push({
      type: "pushOpacity",
      opacity,
    });
  }

  pushClipPath(props: { offset: Offset; path: Path }) {
    this.#commands.push({
      type: "pushClipPath",
      ...props,
    });
  }

  pop() {
    this.#commands.push({
      type: "pop",
    });
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
}

export class PictureRecorder {
  #source: HTMLCanvasElement | null;

  /**
   *
   * @implements: This recorder is currently under implementation and does not actually record but directly reflects on the canvas context. Temporarily, it requires the paintSize immediately. The recorder is intended to manage the drawing order for implementing z-index. Once implemented, it will function as a recorder by not directly drawing on the canvas context but recording the operations.
   */
  constructor(paintBounds: Rect) {
    this.#source = document.createElement("canvas");
    const dpr = window.devicePixelRatio;
    this.#source.width = paintBounds.width * dpr;
    this.#source.height = paintBounds.height * dpr;
  }

  /**
   * @implements: This function is still incomplete. So It needs paintSize temporarily. Once completed, it will intercept the CanvasRenderingContext2D API
   * to record in the recorder. The recorder will log according to the vertical layering order.
   * When endRecording is called, the recorded content will be returned as a Picture.
   */
  createCanvasContext(): CanvasRenderingContext2D {
    const ctx = this.#source!.getContext("2d")!;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    return ctx;
  }

  endRecording() {
    const picture = new Picture(this.#source!);
    this.#source = null;
    return picture;
  }
}
