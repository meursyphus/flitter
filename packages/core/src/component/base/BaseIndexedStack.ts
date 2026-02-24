import type Widget from "../../widget/Widget";
import type { Alignment } from "../../type";
import { StackFit } from "../../type";
import BaseStack from "./BaseStack";
import StatelessWidget from "../../widget/StatelessWidget";

class IndexedStack extends StatelessWidget {
  index: number;
  fit: StackFit;
  alignment: Alignment;
  children: Widget[];
  constructor({
    children,
    index = 0,
    sizing = StackFit.loose,
    alignment,
    key,
  }: {
    children: Widget[];
    sizing?: StackFit;
    alignment?: Alignment;
    index?: number;
    key?: any;
  }) {
    super(key);
    this.index = index;
    this.fit = sizing;
    this.alignment = alignment;
    this.children = children;
  }

  build(): Widget {
    return new BaseStack({
      children: this.children.slice(this.index, this.index + 1),
      alignment: this.alignment,
      fit: this.fit,
    });
  }
}

export default IndexedStack;
