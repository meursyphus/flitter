import type { BuildContext } from "../element";
import { State } from "../element";
import type { Widget } from "../widget";
import { StatefulWidget } from "../widget";
import type ChangeNotifier from "./ChangeNotifier";
import Provider from "./Provider";

class ChangeNotifierProvider extends StatefulWidget {
  child: Widget;
  create: () => ChangeNotifier;
  update?: (notifier: ChangeNotifier) => void;
  providerKey: any;
  constructor({
    child,
    create,
    update,
    key,
    providerKey,
  }: {
    child: Widget;
    create: () => ChangeNotifier;
    update?: (notifier: ChangeNotifier) => void;
    key?: string;
    providerKey: any;
  }) {
    super(key);
    this.child = child;
    this.create = create;
    this.update = update;
    this.providerKey = providerKey;
  }

  createState(): ChangeNotifierProviderState {
    return new ChangeNotifierProviderState();
  }
}

class ChangeNotifierProviderState extends State<ChangeNotifierProvider> {
  value!: ChangeNotifier;
  private listener!: () => void;
  private version = 0;
  initState(_: BuildContext): void {
    this.value = this.widget.create();
    this.listener = () => {
      this.setState(() => {
        this.version += 1;
      });
    };
    this.value.addListener(this.listener);
  }

  override dispose(): void {
    this.value.removeListener(this.listener);
    super.dispose();
  }

  didUpdateWidget(oldWidget: ChangeNotifierProvider): void {
    super.didUpdateWidget(oldWidget);
    if (this.widget.update) {
      this.widget.update(this.value);
    }
  }

  build(_: BuildContext): Widget {
    return Provider({
      child: this.widget.child,
      value: this.value,
      providerKey: this.widget.providerKey,
      notifyToken: this.version,
    });
  }
}

export default (
  ...props: ConstructorParameters<typeof ChangeNotifierProvider>
) => new ChangeNotifierProvider(...props);
