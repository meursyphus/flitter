import { classToFunction } from "../utils";
import RenderRepaintBoundary from "../renderobject/RenderRepaintBoundary";
import SingleChildRenderObjectWidget from "../widget/SingleChildRenderObjectWidget";

class RepaintBoundary extends SingleChildRenderObjectWidget {
  override createRenderObject(): RenderRepaintBoundary {
    return new RenderRepaintBoundary();
  }

  override updateRenderObject(_renderObject: RenderRepaintBoundary): void {
    // No properties to update
  }
}

export default classToFunction(RepaintBoundary);
