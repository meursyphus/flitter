import type { BuildContext } from "../element";
import { assert } from "../utils";
import type BuildOwner from "./BuildOwner";
class GlobalKey {
  isGlobalKey = true;
  buildOwner!: BuildOwner;
  get currentContext(): BuildContext {
    assert(
      this.buildOwner != null,
      "buildOwner is null, currentContext must be called after initState",
    );
    const element = this.buildOwner.findByGlobalKey(this);
    assert(
      element != null,
      "can not find requested element for currentContext",
    );
    return element;
  }
}

export default GlobalKey;
