import type { Offset, Matrix4, Rect } from "../../../type";
import type { CanvasRenderPipeline } from "./canvas-renderer";
export abstract class Layer {
  attached: boolean = false;
  owner: CanvasRenderPipeline;

  attach(owner: CanvasRenderPipeline) {
    this.attached = true;
    this.owner = owner;
  }
  abstract addToScene(builder: SceneBuilder);
}

export class PictureLayer extends Layer {
  #paintBounds: Rect;
  picture: Picture;
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
    this.children = [];
  }

  buildScene(builder: SceneBuilder) {
    this.addToScene(builder);
  }

  append(child: Layer) {
    this.children.push(child);
    child.attach(this.owner);
  }
}

export class OffsetLayer extends ContainerLayer {
  offset: Offset;
}
export class TransformLayer extends OffsetLayer {
  transform: Matrix4;
}

export class SceneBuilder {
  #pictures: { x: number; y: number; picture: Picture }[] = [];

  render(ctx: CanvasRenderingContext2D) {
    /**
     * Vertical layering not yet considered.
     * Addition required!
     */
    for (const { x, y, picture } of this.#pictures) {
      ctx.drawImage(
        picture.toImage(),
        x,
        y,
        picture.size.width,
        picture.size.height,
      );
    }
  }

  addPicture(props: { x: number; y: number; picture: Picture }) {
    this.#pictures.push(props);
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
    const ctx = this.#source.getContext("2d");
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    return ctx;
  }

  endRecording() {
    const picture = new Picture(this.#source);
    this.#source = null;
    return picture;
  }
}
