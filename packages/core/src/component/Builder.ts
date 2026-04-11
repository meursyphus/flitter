import type { BuildContext } from "../element";
import StatelessWidget from "../widget/StatelessWidget";
import type Widget from "../widget/Widget";

function Builder(...props: ConstructorParameters<typeof _Builder>) {
  return new _Builder(...props);
}

class _Builder extends StatelessWidget {
  builder: (context: BuildContext) => Widget;
  constructor({
    builder,
    key,
  }: {
    builder: (context: BuildContext) => Widget;
    key?: any;
  }) {
    super(key);
    this.builder = builder;
  }
  override build(context: BuildContext): Widget {
    return this.builder(context);
  }
}

export default Builder;
