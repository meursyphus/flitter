import { dedent } from 'ts-dedent';

export default dedent`
 import { BuildContext } from "@meursyphus/flitter/src/widget/ComponentWidget"
 import {
  ComponentWidget,
  Padding,
  Row,
  Text,
  Widget,
 } from "@meursyphus/flitter"

class YoutComponent extends ComponentWidget {

  build(context: BuildContext): Widget {
    return Row({
      mainAxisAlignment: "spaceEvenly"
      children: [
          Padding({
          padding: margin,
          child: Text('It is Component Widget example'),
        }),
      ],
    })
  }
}
`;
