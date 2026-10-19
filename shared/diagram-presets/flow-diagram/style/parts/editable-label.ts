import {
  FocusNode,
  Border,
  BoxDecoration,
  EdgeInsets,
  State,
  StatefulWidget,
  Text,
  TextField,
  TextEditingController,
  TextAlign,
  TextStyle,
  type BuildContext,
  type Widget,
} from "flitter-ui";
import type {
  FlowDiagramContext,
  NodeCustomArgs,
} from "flitter-ui/diagram";
import type { DefaultFlowConfig } from "../config";

/** One native input/focus owner per edit session, independent of node rebuilds. */
class LabelEditor extends StatefulWidget {
  constructor(
    readonly args: NodeCustomArgs,
    readonly flow: FlowDiagramContext<DefaultFlowConfig>,
    readonly style: TextStyle,
  ) {
    super(`label:${args.node.id}`);
  }
  override createState(): State<LabelEditor> {
    return new LabelEditorState();
  }
}

class LabelEditorState extends State<LabelEditor> {
  private text!: TextEditingController;
  private focus = new FocusNode();
  private closed = false;
  private unsubscribe = () => {};

  override initState(context: BuildContext): void {
    super.initState(context);
    const { node } = this.widget.args;
    this.text = new TextEditingController(String(node.data.label ?? node.id));
    this.text.selection = { start: 0, end: this.text.text.length };
    const signal = this.widget.flow.nodeSignal(node.id);
    signal.addListener(this.checkSession);
    this.unsubscribe = () => signal.removeListener(this.checkSession);
  }

  private checkSession = () => {
    if (this.widget.flow.editingId === this.widget.args.node.id) return;
    // Commit/Escape can precede the frame that unmounts this input. Release focus
    // immediately, and reject late input/blur events from this finished session.
    this.closed = true;
    this.focus.unfocus();
  };

  private change = (label: string) => {
    if (
      !this.closed &&
      this.widget.flow.editingId === this.widget.args.node.id
    ) {
      this.widget.flow.updateNodeData(this.widget.args.node.id, { label });
    }
  };

  private commit = () => {
    if (this.closed) return;
    this.closed = true;
    if (this.widget.flow.editingId === this.widget.args.node.id)
      this.widget.flow.stopEditing({ commit: true });
    this.focus.unfocus();
  };

  override dispose(): void {
    this.closed = true;
    this.unsubscribe();
    this.focus.dispose();
    this.text.dispose();
    super.dispose();
  }

  override build(): Widget {
    const {
      args: { node },
      flow,
      style,
    } = this.widget;
    return TextField("", {
      controller: this.text,
      focusNode: this.focus,
      autofocus: true,
      ariaLabel: `Edit ${node.id}`,
      style,
      width: Math.max(
        30,
        (node.width ?? flow.config.node.width) - flow.config.node.padding * 2,
      ),
      // The enclosing node already supplies padding. Keep the same line box in both modes.
      padding: EdgeInsets.all(0),
      textAlign: TextAlign.center,
      maxLines: Math.max(
        1,
        String(node.data.label ?? node.id).split("\n").length,
      ),
      height:
        flow.config.node.fontSize *
        1.2 *
        Math.max(1, String(node.data.label ?? node.id).split("\n").length),
      decoration: new BoxDecoration({}),
      focusedBorder: Border.all({ color: "transparent", width: 0 }),
      onChanged: this.change,
      onSubmitted: (text) => {
        this.change(text);
        this.commit();
      },
      onBlurred: this.commit,
    });
  }
}

/** The engine owns edit mode; this part alone chooses which data is text. */
export function EditableLabel(
  args: NodeCustomArgs,
  flow: FlowDiagramContext<DefaultFlowConfig>,
): Widget {
  const { node, isEditing, isCollapsed, hiddenChildCount } = args;
  const label = String(node.data.label ?? node.id);
  const style = new TextStyle({
    fontSize: flow.config.node.fontSize,
    height: 1.2,
    color: flow.config.colors.nodeColor,
    fontFamily: flow.config.node.fontFamily,
  });
  return isEditing
    ? new LabelEditor(args, flow, style)
    : Text(isCollapsed ? `${label} (${hiddenChildCount})` : label, {
        textAlign: TextAlign.center,
        style,
      });
}
