import type { Meta, StoryObj } from '@storybook/react';
import DualRenderer from '../../components/DualRenderer';
import {
  Container, EdgeInsets, FocusNode, InputDecoration, State, StatefulWidget,
  Text, TextEditingController, TextField, TextStyle, type Widget,
} from 'flitter-core';

const meta = { title: 'Input/TextField', component: DualRenderer } satisfies Meta<typeof DualRenderer>;
export default meta;
type Story = StoryObj<typeof meta>;

class InputExample extends StatefulWidget {
  createState() { return new InputExampleState(); }
}
class InputExampleState extends State<InputExample> {
  controller = new TextEditingController('Edit this text');
  focusNode = new FocusNode();
  dispose() { this.controller.dispose(); this.focusNode.dispose(); super.dispose(); }
  build(): Widget {
    return Container({ padding: EdgeInsets.all(24), child: TextField('', {
      controller: this.controller,
      focusNode: this.focusNode,
      width: 350,
      style: new TextStyle({ fontSize: 18, fontFamily: 'sans-serif' }),
      decoration: new InputDecoration({
        labelText: 'Message', hintText: 'Write a message',
        prefixIcon: Text('>'), suffixIcon: Text('*'), contentPadding: EdgeInsets.all(10),
      }),
    }) });
  }
}

export const Controlled: Story = {
  args: { width: '450px', height: '180px', widget: new InputExample() },
};
export const Uncontrolled: Story = {
  args: { width: '450px', height: '180px', widget: Container({ padding: EdgeInsets.all(24), child: TextField('', {
    width: 350,
    decoration: new InputDecoration({ hintText: 'Paste or type here', contentPadding: EdgeInsets.all(10) }),
  }) }) },
};
export const Multiline: Story = {
  args: { width: '450px', height: '220px', widget: Container({ padding: EdgeInsets.all(24), child: TextField('First line\nSecond line', {
    width: 350, maxLines: 4, height: 100,
    decoration: new InputDecoration({ labelText: 'Notes', contentPadding: EdgeInsets.all(10) }),
  }) }) },
};
