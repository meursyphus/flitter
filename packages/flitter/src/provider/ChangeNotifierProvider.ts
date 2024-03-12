import type { BuildContext } from "../element";
import { State } from "../element";
import type { Widget } from "../widget";
import { StatefulWidget } from "../widget";
import type ChangeNotifier from "./ChangeNotifier";
import Provider from "./Provider";

class ChangeNotifierProvider extends StatefulWidget {
  child: Widget;
  create: () => ChangeNotifier;
  providerKey: any;
  constructor({
    child,
    create,
    key,
    providerKey,
  }: {
    child: Widget;
    create: () => ChangeNotifier;
    key?: string;
    providerKey: any;
  }) {
    super(key);
    this.child = child;
    this.create = create;
    this.providerKey = providerKey;
  }

  createState(): ChangeNotifierProviderState {
    return new ChangeNotifierProviderState();
  }
}

class ChangeNotifierProviderState extends State<ChangeNotifierProvider> {
  value: ChangeNotifier;
  initState(_: BuildContext): void {
    this.value = this.widget.create();
    this.value.addListener(() => {
      this.setState();
    });
  }

  build(_: BuildContext): Widget {
    return Provider({
      child: this.widget.child,
      value: this.value,
      providerKey: this.widget.providerKey,
    });
  }
}

export default (
  ...props: ConstructorParameters<typeof ChangeNotifierProvider>
) => new ChangeNotifierProvider(...props);
