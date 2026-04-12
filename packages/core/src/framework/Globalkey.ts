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
    const currentContext = this.buildOwner.findByGlobalKey(this);
    assert(
      currentContext != null,
      "currentContext is null, the widget might be inactive or unmounted",
    );
    return currentContext;
  }
}

export default GlobalKey;
