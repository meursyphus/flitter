import { type State, StatefulElement } from "../element";
import Widget from "./Widget";

class StatefulWidget extends Widget {
  createElement(): StatefulElement {
    return new StatefulElement(this);
  }

  createState(): State<StatefulWidget> {
    throw new Error("not implemented createState");
  }
}

export default StatefulWidget;
