import type { BuildContext } from "../element";
import { assert } from "../utils";
import type BuildOwner from "./BuildOwner";
class GlobalKey {
  buildOwner: BuildOwner;
  get currentContext(): BuildContext {
    assert(
      this.buildOwner != null,
      "buildOwner is null, currentContext must be called after initState"
    );
    return this.buildOwner.findByGlobalKey(this);
  }
}

export default GlobalKey;
