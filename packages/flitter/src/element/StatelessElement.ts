import type { StatelessWidget, Widget } from "../widget";
import ComponentElement from "./ComponentElement";
class StatelessElement extends ComponentElement {
  initState(): void {
    (this.widget as StatelessWidget).initState(this);
  }

  build(): Widget {
    return (this.widget as StatelessWidget).build(this);
  }
}

export default StatelessElement;
