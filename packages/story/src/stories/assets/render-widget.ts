import { dedent } from 'ts-dedent';

export default dedent`
import SingleChildRenderObject from '../../renderobject/SingleChildRenderObject';
import { Size, Constraint } from '../../type';
import type { PaintContext } from '../../utils/type';
import SingleChildRenderObjectWidget from '../../widget/SingleChildRenderObjectWidget';
import type Widget from '../../widget/Widget';

class CustomWidget extends SingleChildRenderObjectWidget {
  createRenderObject(): RenderCustom {
    return new RenderFlexible({ flex: this.flex, fit: this.fit });
  }

  updateRenderObject(renderObject: RenderCustom): void {}
}

export class RenderFlexible extends SingleChildRenderObject {
  constructor({}: {}) {
    super({ isPainter: false });
  }

  protected preformLayout(): void {
    // you must call child's layout function and determine size of widget.
    let size = Size.zero();
    if (this.child != null) {
      this.child.layout(childConstraint);
      size = this.child.size;
    }
    this.size = this.constraint.constrain(size);
  }
}
`;
