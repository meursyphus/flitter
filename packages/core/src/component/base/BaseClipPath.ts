import SingleChildRenderObject from "../../renderobject/SingleChildRenderObject";
import { Offset, type Size } from "../../type";
import type { Path } from "../../type/_types/_path";
import {
  SvgPainter,
  CanvasPainter,
  type SvgPaintContext,
  type CanvasPaintingContext,
} from "../../framework";
import type Widget from "../../widget/Widget";
import SingleChildRenderObjectWidget from "../../widget/SingleChildRenderObjectWidget";
import { createUniqueId } from "../../utils";
import {
  ClipPathLayer,
  type Layer,
} from "../../framework/renderer/canvas/layer";

type Clipper = (size: Size) => Path;

class BaseClipPath extends SingleChildRenderObjectWidget {
  public clipper: Clipper;
  public clipped: boolean;
  constructor({
    child,
    clipper,
    clipped = true,
    key,
  }: {
    child?: Widget;
    clipper: Clipper;
    clipped?: boolean;
    key?: any;
  }) {
    super({ child, key });
    this.clipper = clipper;
    this.clipped = clipped;
  }

  createRenderObject(): SingleChildRenderObject {
    return new RenderClipPath({ clipper: this.clipper, clipped: this.clipped });
  }

  updateRenderObject(renderObject: RenderClipPath): void {
    renderObject.clipper = this.clipper;
    renderObject.clipped = this.clipped;
  }
}

class RenderClipPath extends SingleChildRenderObject {
  _clipper: Clipper;
  private _clipped: boolean;
  private _clip: Path | null = null;
  private _clipWidth = 0;
  private _clipHeight = 0;

  get clipper() {
    return this._clipper;
  }

  set clipper(value: Clipper) {
    if (this._clipper === value) return;
    this._clipper = value;
    this._clip = null;
    // Disabled clips retain their wrapper, but new clippers must not dirty it.
    if (this.clipped) this.markNeedsPaint();
  }
  get clipped() {
    return this._clipped;
  }

  set clipped(value: boolean) {
    if (this._clipped === value) return;
    this._clipped = value;
    this.markNeedsPaint();
  }

  constructor({ clipper, clipped }: { clipper: Clipper; clipped: boolean }) {
    super({ isPainter: true });
    this._clipper = clipper;
    this._clipped = clipped;
  }

  /**
   * The clip is pure in (clipper, size): an identical clipper reference is
   * already treated as "no reclip" by the setter, so reusing the path while
   * both stay unchanged cannot change pixels.
   */
  getClip(): Path {
    const { width, height } = this.size;
    if (
      this._clip == null ||
      this._clipWidth !== width ||
      this._clipHeight !== height
    ) {
      this._clip = this._clipper(this.size);
      this._clipWidth = width;
      this._clipHeight = height;
    }
    return this._clip;
  }

  protected override createSvgPainter() {
    return new SvgPainterClipPath(this);
  }

  protected override createCanvasPainter() {
    return new ClipPathCanvasPainter(this);
  }
}

class SvgPainterClipPath extends SvgPainter {
  private id = createUniqueId();
  protected override getChildClipId(parentId?: string): string | undefined {
    return (this.renderObject as RenderClipPath).clipped ? this.id : parentId;
  }

  get clipper() {
    return (this.renderObject as RenderClipPath).getClip();
  }

  protected override performPaint({
    clipPath,
  }: {
    [key: string]: SVGElement;
  }): void {
    if (!(this.renderObject as RenderClipPath).clipped) return;
    const pathEl = clipPath.getElementsByTagName("path")[0];
    const d = this.clipper.getD();
    pathEl.setAttribute("d", d);
  }

  protected override createDefaultSvgEl({ createSvgEl }: SvgPaintContext): {
    [key: string]: SVGElement;
  } {
    const clipPath = createSvgEl("clipPath");
    clipPath.setAttribute("id", this.id);
    const path = createSvgEl("path");
    path.setAttribute("stroke-width", "0");
    clipPath.appendChild(path);
    return {
      clipPath,
    };
  }

  override createSvgEl(context: SvgPaintContext) {
    const { appendSvgEl } = context;
    const svgEls = this.createDefaultSvgEl(context);
    Object.entries(svgEls).forEach(([name, value]) => {
      value.setAttribute("data-render-name", name);
    });
    const values = Object.values(svgEls);
    const svgEl = values[0];
    svgEl.setAttribute("data-render-type", this.type);
    appendSvgEl(svgEl);

    return svgEl;
  }

  override resolveSvgEl(): {
    svgEls: Record<string, SVGElement>;
    container: SVGElement;
  } {
    const container = this.domNode;
    const svgEls: Record<string, SVGElement> = {};
    const name = container.getAttribute("data-render-name")!;
    svgEls[name] = container;

    return { svgEls, container };
  }
}

class ClipPathCanvasPainter extends CanvasPainter {
  override get paintBounds() {
    const render = this.renderObject as RenderClipPath;
    // Rectangular clips bound all visible descendants, including long text
    // and scroll content. Unknown custom paths keep the conservative estimate.
    return (
      (render.clipped ? this.clipper.getBounds() : undefined) ??
      super.paintBounds
    );
  }

  private clipLayer: ClipPathLayer | null = null;
  private boundaryLayers = new WeakMap<Layer, ClipPathLayer>();

  override wrapLayer(child: Layer, offset: Offset): Layer {
    if (!(this.renderObject as RenderClipPath).clipped) return child;
    let layer = this.boundaryLayers.get(child);
    if (layer == null) {
      layer = new ClipPathLayer({
        offset,
        clipPath: this.clipper,
        translateContents: false,
      });
      this.boundaryLayers.set(child, layer);
    }
    layer.offset = offset;
    layer.clipPath = this.clipper;
    layer.removeAllChildren();
    layer.append(child);
    return layer;
  }
  get clipper() {
    return (this.renderObject as RenderClipPath).getClip();
  }

  protected override performPaint(
    context: CanvasPaintingContext,
    offset: Offset,
  ): void {
    if (!(this.renderObject as RenderClipPath).clipped) {
      this.defaultPaint(context, offset);
      return;
    }
    if (context.paintsChildren && this.renderObject.needsCompositing) {
      // Keep picture coordinates in the enclosing boundary's space; only
      // translate the clip, not the separately recorded contents.
      const layer = (this.clipLayer ??= new ClipPathLayer({
        offset,
        clipPath: this.clipper,
        translateContents: false,
      }));
      layer.offset = offset;
      layer.clipPath = this.clipper;
      context.pushLayer(layer, childContext =>
        this.defaultPaint(childContext, offset),
      );
      return;
    }
    context.canvas.save();
    context.canvas.translate(offset.x, offset.y);
    context.canvas.clip(this.clipper.toCanvasPath());
    context.canvas.translate(-offset.x, -offset.y);
    this.defaultPaint(context, offset);
    context.canvas.restore();
  }
}

export default BaseClipPath;
