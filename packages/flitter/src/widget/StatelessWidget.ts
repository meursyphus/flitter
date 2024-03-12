import type { BuildContext } from ".";
import { StatelessElement } from "../element";
import Widget from "./Widget";

class StatelessWidget extends Widget {
  createElement(): StatelessElement {
    return new StatelessElement(this);
  }

  initState(_: BuildContext): void {}

  build(_: BuildContext): Widget {
    throw { message: "not implemented build on ComponentWidget" };
  }
}

export default StatelessWidget;
