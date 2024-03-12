import ShortUniqueId from "short-unique-id";
import SingleChildRenderObject from "../../renderobject/SingleChildRenderObject";
import type { Size } from "../../type";
import type { Path } from "../../type/_types/_path";
import type { PaintContext } from "../../utils/type";
import SingleChildRenderObjectWidget from "../../widget/SingleChildRenderObjectWidget";
import type Widget from "../../widget/Widget";

type Clipper = (size: Size) => Path;

const uid = new ShortUniqueId({ dictionary: "hex" });
class BaseClipPath extends SingleChildRenderObjectWidget {
  public clipper: Clipper;
  constructor({
    child,
    clipper,
    key,
  }: {
    child?: Widget;
    clipper: Clipper;
    key?: any;
  }) {
    super({ child, key });
    this.clipper = clipper;
  }

  createRenderObject(): SingleChildRenderObject {
    return new RenderClipPath({ clipper: this.clipper });
  }

  updateRenderObject(renderObject: RenderClipPath): void {
    renderObject.clipper = this.clipper;
  }
}

class RenderClipPath extends SingleChildRenderObject {
  _clipper: Clipper;
  private id = uid.randomUUID(6);

  get clipper() {
    return this._clipper;
  }

  set clipper(value: Clipper) {
    if (this._clipper === value) return;
    this._clipper = value;
    this.markNeedsPaint();
  }
  constructor({ clipper }: { clipper: Clipper }) {
    super({ isPainter: true });
    this._clipper = clipper;
  }

  protected getChildClipId(_parentId?: string | undefined): string | undefined {
    return this.id;
  }

  protected performPaint({ clipPath }: { [key: string]: SVGElement }): void {
    const pathEl = clipPath.getElementsByTagName("path")[0];
    const d = this.clipper(this.size).getD();
    pathEl.setAttribute("d", d);
  }

  protected createDefaultSvgEl({ createSvgEl }: PaintContext): {
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

  override mountSvgEl(context: PaintContext): void {
    const { appendSvgEl } = context;
    const svgEls = this.createDefaultSvgEl(context);
    Object.entries(svgEls).forEach(([name, value]) => {
      value.setAttribute("data-render-name", name);
    });
    const values = Object.values(svgEls);
    const svgEl = values[0];
    svgEl.setAttribute("data-render-type", this.type);
    appendSvgEl(svgEl);

    this.domNode = svgEl;
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

export default BaseClipPath;
