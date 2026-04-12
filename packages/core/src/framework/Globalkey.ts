import type { BuildContext } from "../element";
import { assert } from "../utils";
import type BuildOwner from "./BuildOwner";
class GlobalKey {
  isGlobalKey = true;
  buildOwner!: BuildOwner;
  findCurrentContext(): BuildContext | null {
    if (this.buildOwner == null) {
      return null;
    }

    return (this.buildOwner.findByGlobalKey(this) as BuildContext | undefined) ?? null;
  }

  get currentContext(): BuildContext {
    const currentContext = this.findCurrentContext();
    assert(
      currentContext != null,
      this.buildOwner != null
        ? "currentContext is null, the widget might be inactive or unmounted"
        : "buildOwner is null, currentContext must be called after initState",
    );
    return currentContext;
  }
}

export default GlobalKey;
