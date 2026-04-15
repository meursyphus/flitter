import { CanvasPainter } from "../../framework";
import SingleChildRenderObject from "../../renderobject/SingleChildRenderObject";
import SingleChildRenderObjectWidget from "../../widget/SingleChildRenderObjectWidget";
import type Widget from "../../widget/Widget";

class BaseRepaintBoundary extends SingleChildRenderObjectWidget {
  constructor({ child, key }: { child?: Widget; key?: any } = {}) {
    super({ child, key });
  }

  override createRenderObject(): SingleChildRenderObject {
    return new RenderRepaintBoundary();
  }
}

class RenderRepaintBoundary extends SingleChildRenderObject {
  constructor() {
    super({ isPainter: false });
  }

  protected override createCanvasPainter(): CanvasPainter {
    return new RepaintBoundaryCanvasPainter(this);
  }
}

class RepaintBoundaryCanvasPainter extends CanvasPainter {
  override get isRepaintBoundary() {
    return true;
  }
}

export default BaseRepaintBoundary;
